"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { products } from "@/data/chariow";
import ProductGrid from "./ProductGrid";

export default function ShopSection() {
  const t = useTranslations("shop");

  return (
    <section className="relative py-24 bg-linear-to-b from-white via-neutral-light to-white overflow-hidden">
      <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-sky/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-24 w-[30rem] h-[30rem] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 xl:px-8 max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <ShoppingBag size={15} />
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

        {/* Aperçu : 6 produits */}
        <ProductGrid products={products.slice(0, 6)} />

        {/* Pied : sécurité + lien vers la page boutique */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            {t("secure")}
          </span>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-dark transition-all hover:scale-105"
          >
            {t("viewAll")}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
