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

type ItemKey = keyof typeof icons;

export default function WhyUsSection() {
  const t = useTranslations("whyUs");
  const items: ItemKey[] = ["expertise", "agile", "support", "quality", "international", "accessible"];

  return (
    <section className="py-24 bg-neutral-light">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((key, i) => {
            const Icon = icons[key];
            return (
              <div
                key={key}
                className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-sky/10"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky/10 to-navy/5 flex items-center justify-center mb-5 group-hover:bg-sky group-hover:scale-110 transition-all duration-300">
                  <Icon size={22} className="text-sky group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-3">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
