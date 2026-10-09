"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AdminCounts = { messages: number; quotes: number; applications: number; partners: number };

/**
 * loading      : vérification en cours
 * unsupported  : le navigateur ne gère pas le push
 * install      : iPhone / iPad, le push n'existe que dans l'app ajoutée à l'écran d'accueil
 * unconfigured : le serveur n'a pas de clés VAPID
 * denied       : notifications bloquées dans le navigateur
 * off / on     : cet appareil n'est pas / est abonné
 */
export type PushState = "loading" | "unsupported" | "install" | "unconfigured" | "denied" | "off" | "on";

// Le service worker ne couvre que l'admin : le site public n'est pas concerné.
const SW_URL = "/sw.js";
const SW_SCOPE = "/admin";
const SYNCED = "kelenix-push-synced";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

const json = { "Content-Type": "application/json" };
const saveSubscription = (subscription: PushSubscription) =>
  fetch("/api/admin/push", { method: "POST", headers: json, body: JSON.stringify(subscription) });

// Émis dans la page dès qu'un élément change d'état (ouvert, traité…) : les pastilles se rechargent aussitôt.
export const COUNTS_EVENT = "kelenix-admin-counts";

// Rubrique de l'admin visée par une adresse : « /admin/messages?tab=devis » → « /admin/messages ».
const sectionOf = (url: string) => new URL(url, window.location.origin).pathname.split("/").slice(0, 3).join("/");

// Une fois la rubrique ouverte, ses notifications n'ont plus de raison de rester affichées sur l'appareil.
async function closeDeliveredNotifications(pathname: string) {
  try {
    const registration = await navigator.serviceWorker?.getRegistration(SW_SCOPE);
    const delivered = (await registration?.getNotifications()) ?? [];
    const current = sectionOf(pathname);
    for (const notification of delivered) {
      const target = sectionOf((notification.data as { url?: string } | null)?.url || "/admin");
      if (target === "/admin" || target === current) notification.close();
    }
  } catch {
    // Navigateur sans service worker ou sans accès aux notifications : rien à fermer.
  }
}

// Chiffre sur l'icône de l'admin installé sur le téléphone ou l'ordinateur.
function setAppBadge(total: number) {
  const nav = navigator as Navigator & { setAppBadge?: (n: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
  (total > 0 ? nav.setAppBadge?.(total) : nav.clearAppBadge?.())?.catch(() => {});
}

// Pastilles « nouveaux » du menu : rechargées chaque minute, à chaque changement de page, au retour
// sur l'onglet, dès qu'une notification push arrive et dès qu'un élément est ouvert.
export function useAdminCounts(pathname: string) {
  const [counts, setCounts] = useState<AdminCounts | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/admin/notifications", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: AdminCounts | null) => {
          if (cancelled || !data) return;
          setCounts(data);
          setAppBadge(data.messages + data.quotes + data.applications + data.partners);
        })
        .catch(() => {});

    load();
    closeDeliveredNotifications(pathname);
    const timer = setInterval(load, 60_000);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      load();
      closeDeliveredNotifications(pathname);
    };
    const onPush = (event: MessageEvent) => {
      if (event.data?.type === "kelenix-push") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener(COUNTS_EVENT, load);
    navigator.serviceWorker?.addEventListener("message", onPush);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(COUNTS_EVENT, load);
      navigator.serviceWorker?.removeEventListener("message", onPush);
    };
  }, [pathname]);

  return counts;
}

// Abonnement de cet appareil aux notifications push.
export function usePushNotifications() {
  const [state, setState] = useState<PushState>("loading");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const publicKey = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const set = (next: PushState) => {
      if (!cancelled) setState(next);
    };

    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        return set(ios ? "install" : "unsupported");
      }
      const config = await fetch("/api/admin/push")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
      if (!config?.publicKey) return set("unconfigured");
      publicKey.current = config.publicKey;
      if (Notification.permission === "denied") return set("denied");

      const registration = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      const subscription = await registration?.pushManager.getSubscription();
      if (!subscription || Notification.permission !== "granted") return set("off");

      // Déjà abonné : on redonne l'abonnement au serveur une fois par session, au cas où il l'aurait perdu.
      if (!sessionStorage.getItem(SYNCED)) {
        const res = await saveSubscription(subscription).catch(() => null);
        if (res?.ok) sessionStorage.setItem(SYNCED, "1");
      }
      set("on");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = useCallback(async () => {
    if (!publicKey.current) return;
    setBusy(true);
    setFeedback(null);
    try {
      // La demande d'autorisation doit suivre immédiatement le clic (exigence de Safari).
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        return;
      }
      const registration = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE, updateViaCache: "none" });
      await navigator.serviceWorker.ready;
      // Un ancien abonnement peut dater d'autres clés serveur : on repart d'un abonnement neuf.
      await (await registration.pushManager.getSubscription())?.unsubscribe();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey.current),
      });
      const res = await saveSubscription(subscription);
      if (!res.ok) throw new Error("save failed");
      sessionStorage.setItem(SYNCED, "1");
      setState("on");
      // Première notification, pour confirmer que tout fonctionne sur cet appareil.
      await fetch("/api/admin/push/test", { method: "POST" });
    } catch {
      setFeedback("Activation impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const registration = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/admin/push", { method: "DELETE", headers: json, body: JSON.stringify({ endpoint: subscription.endpoint }) });
        await subscription.unsubscribe();
      }
      sessionStorage.removeItem(SYNCED);
      setState("off");
    } catch {
      setFeedback("Désactivation impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }, []);

  const test = useCallback(async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const result = res.ok ? ((await res.json()) as { sent: number }) : null;
      setFeedback(result?.sent ? "Notification envoyée." : "Envoi impossible. Réactivez les notifications.");
    } catch {
      setFeedback("Envoi impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }, []);

  return { state, busy, feedback, enable, disable, test };
}
