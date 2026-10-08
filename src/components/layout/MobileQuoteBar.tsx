"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Barre d'action fixée en bas sur mobile : WhatsApp + « Demander un devis ». Elle apparaît après
// le premier écran et s'efface à l'approche du pied de page. Sa hauteur est publiée dans --quote-bar
// pour que les notifications et le bandeau cookies remontent au-dessus.
export default function MobileQuoteBar({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("nav");
  const tw = useTranslations("whatsapp");
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
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center gap-2.5 bg-white border-t border-line shadow-[0_-10px_30px_-18px_rgba(11,31,58,0.35)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      style={{ transform: "translateY(110%)" }}
    >
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(tw("message"))}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tw("tooltip")}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white active:bg-green-600"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      <Link href="/devis" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-azure text-[15px] font-semibold text-white active:bg-azure-dark">
        {t("quote")} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
