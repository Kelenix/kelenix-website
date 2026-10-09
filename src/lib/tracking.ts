// Mesure d'audience et publicité : Google Analytics, Google Ads et pixel Meta (Facebook / Instagram).
// Rien n'est chargé ni envoyé sans l'accord du visiteur dans le bandeau cookies ; sans accord,
// les fonctions ci-dessous ne font rien. Les identifiants se règlent dans Admin → Paramètres.

/** Choix du visiteur, enregistré par le bandeau cookies. */
export type Consent = { essential: boolean; analytics: boolean; marketing: boolean };

export const CONSENT_KEY = "kelenix_cookies";
/** Émis sur window quand le visiteur enregistre son choix. */
export const CONSENT_EVENT = "kelenix:consent";
/** Émis sur window pour rouvrir le bandeau (lien « Gérer mes cookies »). */
export const OPEN_COOKIES_EVENT = "kelenix:open-cookies";

export function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Consent>;
    return { essential: true, analytics: value.analytics === true, marketing: value.marketing === true };
  } catch {
    return null;
  }
}

type Command = (...args: unknown[]) => void;
type PixelStub = Command & { callMethod?: Command; queue: unknown[][]; push: Command; loaded: boolean; version: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Command;
    fbq?: PixelStub;
    _fbq?: PixelStub;
  }
}

// File d'attente de Google : les commandes sont traitées quand gtag.js a fini de charger.
export function initGoogle({ analyticsId, adsId, consent }: { analyticsId: string | null; adsId: string | null; consent: Consent }) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js attend l'objet « arguments » lui-même, pas un tableau.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  const ads = consent.marketing ? "granted" : "denied";
  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
  // Les pages vues sont envoyées à la main (navigation sans rechargement), voir Tracking.tsx.
  if (analyticsId) window.gtag("config", analyticsId, { send_page_view: false });
  if (adsId) window.gtag("config", adsId);
}

// File d'attente du pixel Meta, équivalente à l'extrait officiel : traitée quand fbevents.js a chargé.
export function initMetaPixel(pixelId: string) {
  if (window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as PixelStub;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  fbq("init", pixelId);
}

export function trackPageView(path: string) {
  window.gtag?.("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
  window.fbq?.("track", "PageView");
}

/** Actions des visiteurs utiles à la publicité (conversions). */
export type TrackEvent =
  | { name: "lead"; source: "devis" | "contact" | "partenaire" }
  | { name: "newsletter" }
  | { name: "candidature" }
  | { name: "whatsapp" }
  | { name: "boutique" };

export function track(event: TrackEvent) {
  if (typeof window === "undefined") return;
  const { gtag, fbq } = window;
  switch (event.name) {
    case "lead":
      gtag?.("event", "generate_lead", { lead_source: event.source });
      // Une demande de devis est un prospect ; un message ou une demande de partenariat, une prise de contact.
      fbq?.("track", event.source === "devis" ? "Lead" : "Contact", { content_name: event.source });
      break;
    case "newsletter":
      gtag?.("event", "sign_up", { method: "newsletter" });
      fbq?.("track", "CompleteRegistration", { content_name: "newsletter" });
      break;
    case "candidature":
      gtag?.("event", "job_application");
      fbq?.("track", "SubmitApplication");
      break;
    case "whatsapp":
      gtag?.("event", "whatsapp_click");
      fbq?.("track", "Contact", { content_name: "whatsapp" });
      break;
    case "boutique":
      gtag?.("event", "shop_click");
      fbq?.("trackCustom", "BoutiqueClick");
      break;
  }
}

// Efface les cookies de mesure des catégories que le visiteur n'a pas (ou plus) acceptées.
export function clearTrackingCookies(consent: Consent) {
  const refused = [!consent.analytics && /^(_ga|_gid|_gat)/, !consent.marketing && /^(_gcl_|_fbp|_fbc)/].filter(Boolean) as RegExp[];
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => refused.some((pattern) => pattern.test(name)));
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
