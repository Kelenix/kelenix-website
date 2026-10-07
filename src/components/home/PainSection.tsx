"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { TrendingDown, MessageSquareOff, Unplug } from "lucide-react";
import { gsap, useReveal, useMotion } from "@/lib/gsap";

const cards = [
  { icon: TrendingDown, tilt: -4, accent: "text-red-400 bg-red-400/10 border-red-400/25" },
  { icon: MessageSquareOff, tilt: 3, accent: "text-gold bg-gold/10 border-gold/25" },
  { icon: Unplug, tilt: -2, accent: "text-sky bg-sky/10 border-sky/25" },
];

type Item = { title: string; text: string };

// Les problèmes du client, avant de présenter les services qui y répondent.
export default function PainSection() {
  const t = useTranslations("pain");
  const items = t.raw("items") as Item[];
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Les trois cartes tombent en place, inclinées, au rythme du défilement.
  useMotion(root, (q) => {
    q("[data-pain]").forEach((card, i) => {
      const tilt = Number(card.dataset.pain);
      gsap.fromTo(
        card,
        { y: 140 + i * 50, rotation: tilt * 4, opacity: 0 },
        { y: 0, rotation: tilt, opacity: 1, ease: "none", scrollTrigger: { trigger: q("[data-pain-grid]")[0], start: "top 95%", end: "top 45%", scrub: 0.7 } }
      );
    });
  });

  return (
    <section ref={root} className="relative py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-14">
          <span data-reveal className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 data-split className="font-heading text-3xl sm:text-4xl font-extrabold text-navy">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
        </div>

        <ul data-pain-grid className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-14">
          {items.map((item, i) => {
            const { icon: Icon, tilt, accent } = cards[i % cards.length];
            return (
              <li key={item.title} data-pain={tilt} className="rounded-3xl bg-navy p-7 shadow-[0_30px_60px_-30px_rgba(11,31,58,0.6)]">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${accent}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2 leading-snug">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </li>
            );
          })}
        </ul>

        <p data-reveal className="max-w-2xl mx-auto text-center text-lg text-gray-600 leading-relaxed">
          {t("outro")}
        </p>
      </div>
    </section>
  );
}
