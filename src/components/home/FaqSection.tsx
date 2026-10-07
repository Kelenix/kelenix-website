"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { gsap, useGSAP, useReveal } from "@/lib/gsap";

type Item = { q: string; a: string };

// Quelques questions fréquentes sur la page d'accueil ; la liste complète reste sur /faq.
export default function FaqSection({ items }: { items: Item[] }) {
  const t = useTranslations("faq");
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useReveal(root);

  // La réponse se déplie, l'icône « + » pivote en « × ».
  useGSAP(
    () => {
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.45;
      gsap.utils.toArray<HTMLElement>("[data-faq-panel]").forEach((panel, i) => {
        gsap.to(panel, { height: i === open ? "auto" : 0, duration, ease: "power3.inOut" });
      });
      gsap.utils.toArray<HTMLElement>("[data-faq-icon]").forEach((icon, i) => {
        gsap.to(icon, { rotation: i === open ? 135 : 0, duration, ease: "power3.inOut" });
      });
    },
    { scope: root, dependencies: [open] }
  );

  if (!items.length) return null;

  return (
    <section ref={root} className="py-24 bg-white">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
        <div className="text-center lg:text-left lg:sticky lg:top-28">
          <span data-reveal className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 data-split className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p data-reveal className="text-gray-500 text-lg mb-6">
            {t("subtitle")}
          </p>
          <div data-reveal>
            <Link href="/faq" className="inline-flex items-center gap-2 text-sky hover:text-navy font-semibold transition-colors">
              {t("viewAll")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={item.q} data-reveal>
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    aria-controls={`home-faq-${i}`}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-heading font-semibold text-navy leading-snug">{item.q}</span>
                    <span data-faq-icon className="shrink-0 w-8 h-8 rounded-full bg-sky/10 text-sky flex items-center justify-center">
                      <Plus size={16} />
                    </span>
                  </button>
                </h3>
                <div id={`home-faq-${i}`} data-faq-panel aria-hidden={open !== i} className="overflow-hidden" style={{ height: 0 }}>
                  <p className="px-6 pb-6 text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
