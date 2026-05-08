"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CtaSection() {
  const t = useTranslations("contactCta");

  return (
    <section className="py-24 bg-gradient-to-br from-sky via-sky/80 to-navy relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-4xl text-center">
        <h2 className="font-heading text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight">
          {t("title")}{" "}
          <span className="text-gold">{t("titleHighlight")}</span>
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/devis"
            className="flex items-center gap-2.5 px-8 py-4 bg-gold text-navy font-bold text-base rounded-xl hover:bg-gold-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {t("cta1")} <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2.5 px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold text-base rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            <MessageCircle size={18} />
            {t("cta2")}
          </Link>
        </div>
      </div>
    </section>
  );
}
