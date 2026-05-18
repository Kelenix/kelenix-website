"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/a-propos", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = typeof params?.slug === "string"
      ? pathname
      : pathname;
    router.push(`/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
    setLangOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-navy shadow-lg py-3"
          : "bg-navy/95 backdrop-blur-sm py-4"
      )}
    >
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="text-2xl" />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as "/"}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-sky bg-sky/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side: Lang switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Change language"
              >
                <Globe size={16} />
                <span className="font-medium uppercase">{locale}</span>
                <ChevronDown size={14} className={cn("transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-navy-light border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[100px]">
                  {["fr", "en"].map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={cn(
                        "w-full px-4 py-2 text-sm text-left transition-colors",
                        locale === l
                          ? "bg-sky/20 text-sky"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {l === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/devis"
              className="px-5 py-2.5 bg-gold text-navy font-semibold text-sm rounded-lg hover:bg-gold-dark transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t("quote")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-navy border-t border-white/10 px-4 py-4">
          <ul className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as "/"}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    pathname === link.href
                      ? "text-sky bg-sky/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <div className="flex gap-2">
              {["fr", "en"].map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    locale === l
                      ? "bg-sky/20 text-sky border border-sky/30"
                      : "text-gray-400 hover:text-white border border-white/20"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              href="/devis"
              className="flex-1 text-center py-2.5 bg-gold text-navy font-semibold text-sm rounded-lg"
            >
              {t("quote")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
