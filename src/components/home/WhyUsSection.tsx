"use client";

import { useTranslations } from "next-intl";
import { Award, Zap, Headphones, Shield, Globe2, DollarSign } from "lucide-react";

const icons = {
  expertise: Award,
  agile: Zap,
  support: Headphones,
  quality: Shield,
  international: Globe2,
  accessible: DollarSign,
};

// Accent par carte (dégradé de l'icône + halo)
const accents: Record<ItemKey, { from: string; to: string; glow: string; ring: string }> = {
  expertise:     { from: "from-sky",        to: "to-sky-dark",     glow: "bg-sky/25",     ring: "ring-sky/20" },
  agile:         { from: "from-gold",       to: "to-gold-dark",    glow: "bg-gold/25",    ring: "ring-gold/20" },
  support:       { from: "from-sky-light",  to: "to-sky",          glow: "bg-sky/25",     ring: "ring-sky/20" },
  quality:       { from: "from-emerald-400",to: "to-emerald-600",  glow: "bg-emerald-400/25", ring: "ring-emerald-400/20" },
  international: { from: "from-indigo-400",  to: "to-navy",         glow: "bg-indigo-400/25", ring: "ring-indigo-400/20" },
  accessible:    { from: "from-gold-light",  to: "to-gold-dark",   glow: "bg-gold/25",    ring: "ring-gold/20" },
};

type ItemKey = keyof typeof icons;

export default function WhyUsSection() {
  const t = useTranslations("whyUs");
  const items: ItemKey[] = ["expertise", "agile", "support", "quality", "international", "accessible"];

  return (
    <section className="relative py-24 bg-neutral-light overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-sky/5 blur-3xl pointer-events-none" />
      <div className="relative container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((key, i) => {
            const Icon = icons[key];
            const a = accents[key];
            return (
              <div
                key={key}
                className="group relative glass-light glass-hover rounded-3xl p-8 overflow-hidden"
              >
                {/* Halo décoratif */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${a.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Numéro filigrane */}
                <span className="absolute top-4 right-6 font-heading text-6xl font-extrabold text-navy/[0.04] group-hover:text-navy/[0.07] transition-colors select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icône */}
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${a.from} ${a.to} flex items-center justify-center mb-6 shadow-lg ring-4 ${a.ring} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}
                >
                  <Icon size={24} className="text-white" strokeWidth={2.2} />
                </div>

                <h3 className="relative font-heading font-bold text-navy text-lg mb-3">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="relative text-gray-500 text-sm leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>

                {/* Trait animé en bas */}
                <div className={`mt-6 h-1 w-10 rounded-full bg-gradient-to-r ${a.from} ${a.to} group-hover:w-20 transition-all duration-500`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
