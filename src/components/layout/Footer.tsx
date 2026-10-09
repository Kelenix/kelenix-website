"use client";

import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { OPEN_COOKIES_EVENT, track } from "@/lib/tracking";

const SocialIcons = {
  linkedin: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  youtube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  ),
  twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

type FooterSettings = { email: string; phone: string; whatsapp: string; address: string; linkedin: string; facebook: string; instagram: string; youtube: string; twitter: string };
type FooterService = { slug: string; titleFr: string; titleEn: string };

export default function Footer({ settings, services = [] }: { settings: FooterSettings; services?: FooterService[] }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "exists">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.exists) setStatus("exists");
      else {
        setStatus("success");
        track({ name: "newsletter" });
      }
      setEmail("");
    } catch {
      setStatus("success");
    }
  };

  const currentYear = new Date().getFullYear();

  const serviceLinks = services.map((s) => ({
    slug: s.slug,
    label: locale === "en" ? s.titleEn : s.titleFr,
  }));

  const quickLinks = [
    { href: "/", label: tNav("home") },
    { href: "/a-propos", label: tNav("about") },
    { href: "/services", label: tNav("services") },
    { href: "/portfolio", label: tNav("portfolio") },
    { href: "/blog", label: tNav("blog") },
    { href: "/faq", label: tNav("faq") },
    { href: "/carrieres", label: tNav("careers") },
    { href: "/partenaires", label: tNav("partners") },
    { href: "/contact", label: tNav("contact") },
    { href: "/devis", label: tNav("quote") },
  ];

  const socials = [
    { icon: SocialIcons.linkedin,  href: settings.linkedin,  label: "LinkedIn" },
    { icon: SocialIcons.facebook,  href: settings.facebook,  label: "Facebook" },
    { icon: SocialIcons.instagram, href: settings.instagram, label: "Instagram" },
    { icon: SocialIcons.youtube,   href: settings.youtube,   label: "YouTube" },
    { icon: SocialIcons.twitter,   href: settings.twitter,   label: "Twitter/X" },
  ];

  const linkClass = "text-[15px] text-muted transition-colors hover:text-navy";
  const headingClass = "mb-4 text-sm font-semibold text-navy";

  return (
    <footer className="border-t border-line bg-mist text-navy">
      <div className="container mx-auto max-w-7xl px-5 py-14 lg:py-20 xl:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr] lg:gap-10">
          {/* Identité + newsletter */}
          <div>
            <Link href="/" aria-label="Kelenix Tech" className="inline-block">
              <Logo size="text-2xl" tone="light" />
            </Link>
            <p className="mt-5 max-w-xs font-display text-[1.35rem] leading-snug tracking-[-0.01em] text-navy">{t("slogan")}</p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{t("description")}</p>

            <form onSubmit={handleSubscribe} className="mt-7 max-w-sm">
              <label htmlFor="footer-newsletter" className="mb-2 block text-sm font-semibold text-navy">
                {t("newsletter.title")}
              </label>
              <div className="flex items-center gap-1.5 rounded-full border border-line bg-white p-1.5 focus-within:border-azure">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  className="min-w-0 flex-1 bg-transparent px-3.5 py-2 text-[15px] text-navy placeholder:text-muted/70 focus:outline-none"
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azure disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Send size={14} />
                  )}
                  {status === "success" ? t("newsletter.success") : status === "exists" ? t("newsletter.alreadySubscribed") : t("newsletter.subscribe")}
                </button>
              </div>
            </form>
          </div>

          {/* Liens : deux colonnes côte à côte sur téléphone */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            <div>
              <h3 className={headingClass}>{t("quickLinks")}</h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href as "/"} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={headingClass}>{t("ourServices")}</h3>
              <ul className="space-y-2.5">
                {serviceLinks.map((link) => (
                  <li key={link.slug}>
                    <Link href={{ pathname: "/services/[slug]", params: { slug: link.slug } }} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                {serviceLinks.length === 0 && (
                  <li>
                    <Link href="/services" className={linkClass}>
                      {tNav("services")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>{t("contactUs")}</h3>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${settings.email}`} className={`flex items-center gap-3 ${linkClass}`}>
                  <Mail size={16} className="shrink-0 text-azure" />
                  <span className="break-all">{settings.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${settings.phone}`} className={`flex items-center gap-3 ${linkClass}`}>
                  <Phone size={16} className="shrink-0 text-azure" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${linkClass}`}>
                  <svg className="h-4 w-4 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-[15px] text-muted">
                <MapPin size={16} className="shrink-0 text-azure" />
                {settings.address}
              </li>
            </ul>

            <div className="mt-6 flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentions */}
      <div className="border-t border-line">
        {/* lg:pr-24 : la bulle WhatsApp flotte en bas à droite, les liens ne doivent pas passer dessous */}
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-[13px] text-muted sm:flex-row lg:pr-24 xl:px-8 xl:pr-28">
          <p>
            &copy; {currentYear} Kelenix Tech. {t("copyright")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/mentions-legales" className="transition-colors hover:text-navy">
              {t("legal.mentions")}
            </Link>
            <Link href="/politique-de-confidentialite" className="transition-colors hover:text-navy">
              {t("legal.privacy")}
            </Link>
            <Link href="/cgu" className="transition-colors hover:text-navy">
              {t("legal.cgu")}
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-navy">
              {t("legal.cookies")}
            </Link>
            <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIES_EVENT))} className="cursor-pointer transition-colors hover:text-navy">
              {t("legal.manage")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
