"use client";

import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Send } from "lucide-react";

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

export default function Footer({ settings }: { settings: FooterSettings }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tServices = useTranslations("services");
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
      else setStatus("success");
      setEmail("");
    } catch {
      setStatus("success");
    }
  };

  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { slug: "developpement-logiciel", label: tServices("items.software.title") },
    { slug: "creation-sites-web", label: tServices("items.web.title") },
    { slug: "applications-web", label: tServices("items.webapp.title") },
    { slug: "applications-mobiles", label: tServices("items.mobile.title") },
    { slug: "intelligence-artificielle", label: tServices("items.ai.title") },
    { slug: "consulting-informatique", label: tServices("items.consulting.title") },
    { slug: "formation-programmation", label: tServices("items.training.title") },
  ];

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

  return (
    <footer className="bg-navy text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Identity */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo size="text-2xl" />
            </Link>
            <p className="text-sm text-sky font-medium italic mb-3">
              L&apos;intelligence au service de l&apos;innovation mondiale.
            </p>
            <p className="text-sm leading-relaxed mb-6">{t("description")}</p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-sky hover:text-white transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">{t("quickLinks")}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as "/"}
                    className="text-sm hover:text-sky transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-sky/50 group-hover:bg-sky transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">{t("ourServices")}</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={{ pathname: "/services/[slug]", params: { slug: link.slug } }}
                    className="text-sm hover:text-sky transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-sky/50 group-hover:bg-sky transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">{t("contactUs")}</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-3 hover:text-sky transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center shrink-0 group-hover:bg-sky/20">
                    <Mail size={14} className="text-sky" />
                  </div>
                  <span className="text-sm pt-1">{settings.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-start gap-3 hover:text-sky transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center shrink-0 group-hover:bg-sky/20">
                    <Phone size={14} className="text-sky" />
                  </div>
                  <span className="text-sm pt-1">{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-sky transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center shrink-0 group-hover:bg-green-600/30">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="text-sm pt-1">WhatsApp Business</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-sky" />
                </div>
                <span className="text-sm pt-1">{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter + Legal */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full lg:max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-sky"
                disabled={status === "loading" || status === "success"}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="px-5 py-2.5 bg-sky text-white font-medium text-sm rounded-lg hover:bg-sky-dark transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {status === "loading" ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {status === "success"
                  ? t("newsletter.success")
                  : status === "exists"
                  ? t("newsletter.alreadySubscribed")
                  : t("newsletter.subscribe")}
              </button>
            </form>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
              <Link href="/mentions-legales" className="hover:text-sky transition-colors">
                {t("legal.mentions")}
              </Link>
              <Link href="/politique-de-confidentialite" className="hover:text-sky transition-colors">
                {t("legal.privacy")}
              </Link>
              <Link href="/cgu" className="hover:text-sky transition-colors">
                {t("legal.cgu")}
              </Link>
              <Link href="/cookies" className="hover:text-sky transition-colors">
                {t("legal.cookies")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-4">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Kelenix Tech. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
