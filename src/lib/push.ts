import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Notifications push vers les appareils des administrateurs (Web Push).
// Les clés VAPID viennent de l'environnement ; sans elles, tout est désactivé proprement :
// rien n'est envoyé et l'admin affiche « non configuré ».
const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
const subject = process.env.VAPID_SUBJECT ?? "mailto:contact@kelenix.com";

/** Clé publique à donner au navigateur pour s'abonner, ou null si le serveur n'est pas configuré. */
export const pushPublicKey = publicKey && privateKey ? publicKey : null;

if (pushPublicKey) webpush.setVapidDetails(subject, publicKey, privateKey);

export type PushMessage = {
  title: string;
  body: string;
  /** Page de l'admin ouverte au clic sur la notification. */
  url: string;
};

type Target = { endpoint: string; p256dh: string; auth: string };

// Raccourcit un texte libre (message d'un visiteur) pour le corps d'une notification.
export function excerpt(text: string, max = 140) {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

async function send(targets: Target[], message: PushMessage) {
  const payload = JSON.stringify(message);
  const results = await Promise.allSettled(
    targets.map((t) =>
      webpush.sendNotification({ endpoint: t.endpoint, keys: { p256dh: t.p256dh, auth: t.auth } }, payload, { TTL: 86_400, urgency: "high" })
    )
  );

  // Abonnement expiré ou révoqué par le navigateur (404 / 410) : on l'oublie.
  const gone = targets
    .filter((_, i) => {
      const result = results[i];
      return result.status === "rejected" && [404, 410].includes((result.reason as { statusCode?: number })?.statusCode ?? 0);
    })
    .map((t) => t.endpoint);
  if (gone.length) await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: gone } } });

  return { total: targets.length, sent: results.filter((r) => r.status === "fulfilled").length };
}

const fields = { endpoint: true, p256dh: true, auth: true } as const;

/** Prévient tous les appareils abonnés. Ne lève jamais d'erreur : l'action du visiteur ne doit pas en dépendre. */
export async function notifyAdmins(message: PushMessage) {
  if (!pushPublicKey) return;
  try {
    const targets = await prisma.pushSubscription.findMany({ select: fields });
    if (targets.length) await send(targets, message);
  } catch (error) {
    console.error("[push] Envoi impossible :", error);
  }
}

/** Envoie une notification aux appareils d'un seul administrateur (bouton « Tester »). */
export async function notifyUser(userId: string, message: PushMessage) {
  if (!pushPublicKey) return { total: 0, sent: 0 };
  const targets = await prisma.pushSubscription.findMany({ where: { userId }, select: fields });
  return targets.length ? send(targets, message) : { total: 0, sent: 0 };
}
