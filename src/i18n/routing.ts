import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/a-propos": { fr: "/a-propos", en: "/about" },
    "/services": "/services",
    "/services/[slug]": "/services/[slug]",
    "/portfolio": "/portfolio",
    "/portfolio/[slug]": "/portfolio/[slug]",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/temoignages": { fr: "/temoignages", en: "/testimonials" },
    "/contact": "/contact",
    "/devis": { fr: "/devis", en: "/quote" },
    "/faq": "/faq",
    "/carrieres": { fr: "/carrieres", en: "/careers" },
    "/partenaires": { fr: "/partenaires", en: "/partners" },
    "/mentions-legales": { fr: "/mentions-legales", en: "/legal-notice" },
    "/politique-de-confidentialite": { fr: "/politique-de-confidentialite", en: "/privacy-policy" },
    "/cgu": "/cgu",
    "/cookies": "/cookies",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
