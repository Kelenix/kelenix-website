import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import CookieBanner from "@/components/layout/CookieBanner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "@/app/globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  const isEn = locale === "en";
  const title = isEn
    ? "Kelenix - Intelligence in service of global innovation"
    : "Kelenix - L'intelligence au service de l'innovation mondiale";
  const description = isEn
    ? "Kelenix supports businesses in their digital transformation through innovative technology solutions: software development, AI, web and mobile applications."
    : "Kelenix accompagne les entreprises dans leur transformation numérique grâce à des solutions technologiques innovantes : développement logiciel, IA, applications web et mobile.";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://kelenix.com"),
    title: { default: title, template: `%s | Kelenix` },
    description,
    keywords: isEn
      ? ["software development", "AI", "web apps", "mobile apps", "digital transformation", "Kelenix"]
      : ["développement logiciel", "IA", "applications web", "transformation digitale", "Kelenix"],
    authors: [{ name: "Kelenix" }],
    creator: "Kelenix",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "Kelenix",
      title,
      description,
      images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://kelenix.com/${locale}`,
      languages: { fr: "https://kelenix.com/fr", en: "https://kelenix.com/en" },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  const settingsRows = await prisma.siteSettings.findMany({
    where: { key: { in: ["company_email","company_phone","company_whatsapp","company_address","company_linkedin","company_facebook","company_instagram","company_youtube","company_twitter"] } },
  });
  const s = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));
  const footerSettings = {
    email:     s.company_email     || "contact@kelenix.com",
    phone:     s.company_phone     || "+33 1 23 45 67 89",
    whatsapp:  s.company_whatsapp  || "33612345678",
    address:   s.company_address   || "Paris, France",
    linkedin:  s.company_linkedin  || "https://linkedin.com/company/kelenix",
    facebook:  s.company_facebook  || "https://facebook.com/kelenix",
    instagram: s.company_instagram || "https://instagram.com/kelenix",
    youtube:   s.company_youtube   || "https://youtube.com/@kelenix",
    twitter:   s.company_twitter   || "https://x.com/kelenix",
  };

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-white text-gray-900">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer settings={footerSettings} />
          <WhatsAppButton />
          <ScrollToTop />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
