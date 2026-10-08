"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MoreLink } from "@/components/home/SectionHeading";
import { gsap, useGSAP, useReveal } from "@/lib/gsap";

type Item = { q: string; a: string };

// Quelques questions fréquentes sur la page d'accueil ; la liste complète reste sur /faq.
export default function FaqSection({ items }: { items: Item[] }) {
  const t = useTranslations("home.faq");
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
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
    <section ref={root} className="bg-mist py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 xl:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 data-lines className="text-balance font-display text-[2.1rem] font-medium leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl lg:text-[3.4rem]">
            {t("title")}
          </h2>
          <p data-reveal className="mt-5 hidden text-lg text-muted lg:block">
            {t("lead")}{" "}
            <Link href="/contact" className="font-semibold text-navy underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-azure">
              {t("contact")}
            </Link>
          </p>
          <div data-reveal className="mt-6 hidden lg:block">
            <MoreLink href="/faq">{t("viewAll")}</MoreLink>
          </div>
        </div>

        <div>
          <div data-reveal className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
            {items.map((item, i) => (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    aria-controls={`home-faq-${i}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <span className="text-[1.02rem] font-semibold leading-snug text-navy sm:text-lg">{item.q}</span>
                    <span data-faq-icon className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <div id={`home-faq-${i}`} data-faq-panel aria-hidden={open !== i} className="overflow-hidden" style={{ height: i === 0 ? "auto" : 0 }}>
                  <p className="max-w-2xl px-5 pb-6 text-[15px] leading-relaxed text-muted sm:px-7 sm:text-base">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:hidden">
            <MoreLink href="/faq" variant="block">
              {t("viewAll")}
            </MoreLink>
            <p className="text-center text-[15px] text-muted">
              {t("lead")}{" "}
              <Link href="/contact" className="font-semibold text-navy underline decoration-line decoration-2 underline-offset-4">
                {t("contact")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
