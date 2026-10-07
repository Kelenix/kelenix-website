"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Barre « Demander un devis » fixée en bas sur mobile. Elle apparaît après le premier écran
// et s'efface à l'approche du pied de page. Sa hauteur est publiée dans --quote-bar pour que
// WhatsApp, « retour en haut », les notifications et le bandeau cookies remontent au-dessus.
export default function MobileQuoteBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const onQuotePage = pathname === "/devis";

  useGSAP(
    () => {
      const el = bar.current;
      if (!el) return;
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.4;
      let scrolled = false;
      let atFooter = false;
      let shown = false;
      const apply = () => {
        const show = scrolled && !atFooter;
        if (show === shown) return;
        shown = show;
        el.toggleAttribute("inert", !show);
        // y: 0 annule le décalage en pixels que GSAP lit dans le style initial (translateY(110%)).
        gsap.to(el, { y: 0, yPercent: show ? 0 : 110, duration, ease: "power3.out", overwrite: true });
        gsap.to(document.documentElement, { "--quote-bar": show ? `${el.offsetHeight}px` : "0px", duration, ease: "power3.out", overwrite: true });
      };
      ScrollTrigger.create({
        start: 500,
        end: "max",
        onToggle: (self) => {
          scrolled = self.isActive;
          apply();
        },
      });
      ScrollTrigger.create({
        trigger: "footer",
        start: "top bottom",
        onToggle: (self) => {
          atFooter = self.isActive;
          apply();
        },
      });
      return () => el.setAttribute("inert", "");
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  if (onQuotePage) return null;

  return (
    <div
      ref={bar}
      inert
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 bg-navy/95 backdrop-blur border-t border-white/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      style={{ transform: "translateY(110%)" }}
    >
      <p className="text-sm font-semibold text-white leading-tight">{t("quoteBar")}</p>
      <Link
        href="/devis"
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-bold text-sm rounded-xl shadow-md active:bg-gold-dark"
      >
        {t("quote")} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
