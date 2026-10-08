"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useGSAP, useMotion } from "@/lib/gsap";
import { lockScroll } from "@/lib/smooth-scroll";

const LOCALES = ["fr", "en"] as const;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  // Le menu mobile est ouvert « sur une page » : changer de page le referme tout seul.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const mobileOpen = openOn === pathname;
  const setMobileOpen = (open: boolean) => setOpenOn(open ? pathname : null);
  const headerRef = useRef<HTMLElement>(null);
  const menuOpen = useRef(false);

  useEffect(() => {
    menuOpen.current = mobileOpen;
    lockScroll(mobileOpen);
    return () => lockScroll(false);
  }, [mobileOpen]);

  // L'en-tête se range quand on descend et revient dès qu'on remonte
  // (jamais quand le menu est ouvert ou qu'un de ses liens a le focus clavier).
  useMotion(headerRef, () => {
    const el = headerRef.current;
    if (!el) return;
    let hidden = false;
    const toggle = (hide: boolean) => {
      if (hide === hidden) return;
      hidden = hide;
      gsap.to(el, { yPercent: hide ? -100 : 0, duration: 0.45, ease: "power3.out", overwrite: true });
    };
    ScrollTrigger.create({
      start: 140,
      end: "max",
      onUpdate: (self) => toggle(self.direction === 1 && !menuOpen.current && !el.contains(document.activeElement)),
      onLeaveBack: () => toggle(false),
    });
  });

  // Menu mobile : le panneau se déroule, les liens arrivent un par un.
  useGSAP(
    () => {
      const panel = headerRef.current?.querySelector<HTMLElement>("[data-menu]");
      if (!panel) return;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.killTweensOf(panel);
      if (still) {
        gsap.set(panel, { visibility: mobileOpen ? "visible" : "hidden" });
      } else if (mobileOpen) {
        gsap.set(panel, { visibility: "visible" });
        gsap.fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power3.inOut" });
        gsap.fromTo(panel.querySelectorAll("[data-menu-item]"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.045, delay: 0.12 });
      } else {
        gsap.to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.35, ease: "power3.in", onComplete: () => gsap.set(panel, { visibility: "hidden" }) });
      }
    },
    { scope: headerRef, dependencies: [mobileOpen] }
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const navLinks = [
    { href: "/services", label: t("services") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/boutique", label: t("shop") },
    { href: "/a-propos", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const switchLocale = (next: string) => {
    if (next === locale) return;
    // @ts-expect-error -- pathname et params décrivent toujours la route courante, donc ils correspondent.
    router.replace({ pathname, params }, { locale: next });
  };

  const langSwitch = (
    <div role="group" aria-label={t("language")} className="flex items-center rounded-full border border-line bg-white p-0.5 text-xs font-semibold">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLocale(l)}
          aria-pressed={locale === l}
          className={cn("rounded-full px-2.5 py-1 uppercase transition-colors cursor-pointer", locale === l ? "bg-navy text-white" : "text-muted hover:text-navy")}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 border-b transition-[background-color,border-color] duration-300",
        "bg-white/95 lg:bg-white/80 lg:backdrop-blur-md",
        isScrolled || mobileOpen ? "border-line" : "border-transparent"
      )}
    >
      <nav aria-label={t("main")} className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 xl:px-8">
        <Link href="/" aria-label="Kelenix Tech" className="shrink-0">
          <Logo size="text-xl" tone="light" />
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href as "/"}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                  isActive(link.href) ? "bg-mist text-navy" : "text-muted hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {langSwitch}
          <Link href="/devis" className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azure">
            {t("quote")}
          </Link>
        </div>

        {/* Mobile : bouton devis court + menu */}
        <div className="flex lg:hidden items-center gap-1.5">
          <Link href="/devis" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white active:bg-azure">
            {t("quoteShort")}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-navy cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile plein écran */}
      <div
        id="mobile-menu"
        data-menu
        inert={!mobileOpen}
        className="lg:hidden invisible absolute inset-x-0 top-full flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto border-t border-line bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
      >
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.href} data-menu-item className="border-b border-line">
              <Link
                href={link.href as "/"}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn("flex items-center justify-between py-4 font-display text-[1.7rem] leading-none tracking-tight", isActive(link.href) ? "text-azure" : "text-navy")}
              >
                {link.label}
                <ArrowRight size={20} className="text-muted" />
              </Link>
            </li>
          ))}
        </ul>

        <div data-menu-item className="mt-auto flex flex-col gap-4 pt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{t("language")}</span>
            {langSwitch}
          </div>
          <Link href="/devis" className="flex items-center justify-center gap-2 rounded-full bg-azure py-4 text-base font-semibold text-white active:bg-azure-dark">
            {t("quote")} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
