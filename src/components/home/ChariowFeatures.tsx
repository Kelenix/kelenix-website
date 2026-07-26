"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BadgePercent,
  MessageSquareText,
  LayoutTemplate,
  Zap,
  ThumbsUp,
  Megaphone,
  Target,
  ArrowRight,
} from "lucide-react";

// Boutique Chariow (eBookDev). Modifiez ce lien, ou le champ `href` d'un
// élément, pour pointer vers une destination spécifique.
const STORE_URL = "https://ebookdev.mychariow.shop";

const items = [
  { key: "reductions", icon: BadgePercent, tint: "from-amber-200/70 to-yellow-100/50", ring: "text-amber-500", isNew: false, href: STORE_URL },
  { key: "popups", icon: MessageSquareText, tint: "from-teal-200/70 to-cyan-100/50", ring: "text-teal-500", isNew: false, href: STORE_URL },
  { key: "makeups", icon: LayoutTemplate, tint: "from-violet-200/70 to-indigo-100/50", ring: "text-violet-500", isNew: true, href: STORE_URL },
  { key: "snap", icon: Zap, tint: "from-indigo-200/70 to-sky-100/50", ring: "text-indigo-500", isNew: true, href: STORE_URL },
  { key: "proof", icon: ThumbsUp, tint: "from-emerald-200/70 to-teal-100/50", ring: "text-emerald-500", isNew: true, href: STORE_URL },
  { key: "banners", icon: Megaphone, tint: "from-green-200/70 to-lime-100/50", ring: "text-green-500", isNew: false, href: STORE_URL },
  { key: "campaigns", icon: Target, tint: "from-sky-200/70 to-blue-100/50", ring: "text-sky-500", isNew: false, href: STORE_URL },
] as const;

export default function ChariowFeatures() {
  const t = useTranslations("chariow");

  return (
    <section className="relative py-24 bg-linear-to-b from-white via-neutral-light to-white overflow-hidden">
      <div className="absolute -top-24 left-1/3 w-[36rem] h-[36rem] rounded-full bg-sky/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 xl:px-8 max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4 tracking-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky to-gold">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        {/* Grille des outils */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group glass-light glass-hover relative rounded-2xl p-6 flex items-start gap-5"
              >
                {/* Badge Nouveau */}
                {item.isNew && (
                  <span className="absolute -top-2.5 right-5 bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                    {t("new")}
                  </span>
                )}

                {/* Icône */}
                <div
                  className={`shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${item.tint} flex items-center justify-center border border-white/60 shadow-sm`}
                >
                  <Icon size={24} className={item.ring} strokeWidth={2} />
                </div>

                {/* Texte */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-navy text-lg mb-1.5 group-hover:text-sky transition-colors">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t(`items.${item.key}.description`)}
                  </p>
                </div>

                {/* Flèche */}
                <ArrowRight
                  size={20}
                  className="shrink-0 mt-1 text-gray-400 group-hover:text-sky group-hover:translate-x-1 transition-all"
                />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
