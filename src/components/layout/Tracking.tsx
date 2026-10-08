"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { CONSENT_EVENT, CONSENT_KEY, initGoogle, initMetaPixel, parseConsent, track, trackPageView } from "@/lib/tracking";

type Props = {
  /** Identifiants saisis dans Admin → Paramètres (null : outil non utilisé). */
  metaPixelId: string | null;
  googleAnalyticsId: string | null;
  googleAdsId: string | null;
  /** Adresse de la boutique externe, pour suivre les clics qui y mènent. */
  storeUrl: string;
};

// Le choix du visiteur vit dans localStorage ; le bandeau cookies prévient quand il change.
function readStored() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null; // stockage bloqué par le navigateur : on considère qu'il n'y a pas d'accord
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Charge Google Analytics, Google Ads et le pixel Meta uniquement si le visiteur l'a accepté :
// « Analytiques » pour Google Analytics, « Marketing » pour Google Ads et Meta.
export default function Tracking({ metaPixelId, googleAnalyticsId, googleAdsId, storeUrl }: Props) {
  const pathname = usePathname();
  const raw = useSyncExternalStore(subscribe, readStored, () => null);
  const consent = useMemo(() => parseConsent(raw), [raw]);

  const analyticsId = consent?.analytics ? googleAnalyticsId : null;
  const adsId = consent?.marketing ? googleAdsId : null;
  const pixelId = consent?.marketing ? metaPixelId : null;
  const googleId = analyticsId ?? adsId;

  // Files d'attente créées avant le chargement des scripts : aucun événement n'est perdu.
  useEffect(() => {
    if (googleId && consent) initGoogle({ analyticsId, adsId, consent });
    if (pixelId) initMetaPixel(pixelId);
  }, [googleId, analyticsId, adsId, pixelId, consent]);

  // Page vue à l'arrivée puis à chaque changement de page.
  useEffect(() => {
    if (googleId || pixelId) trackPageView(pathname);
  }, [pathname, googleId, pixelId]);

  // Clics vers WhatsApp et vers la boutique, où qu'ils soient sur le site.
  useEffect(() => {
    if (!googleId && !pixelId) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.href.startsWith("https://wa.me/")) track({ name: "whatsapp" });
      else if (link.href.startsWith(storeUrl)) track({ name: "boutique" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [googleId, pixelId, storeUrl]);

  return (
    <>
      {googleId && <Script id="google-tag" src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} strategy="afterInteractive" />}
      {pixelId && <Script id="meta-pixel" src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />}
    </>
  );
}
