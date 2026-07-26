import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ShieldCheck, ArrowUpRight, Tag, ShoppingBag } from "lucide-react";
import ProductGrid from "@/components/home/ProductGrid";
import { products, promo, STORE_URL } from "@/data/chariow";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: `${t("pageTitle")} ${t("pageHighlight")}`,
    description: t("pageSubtitle"),
  };
}

export default async function BoutiquePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-28 pb-20 overflow-hidden">
        <div className="aurora-bg opacity-60" />
        <div className="grid-floor opacity-40" />
        <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 glass-pill text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <ShoppingBag size={15} />
            {t("badge")}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight">
            {t("pageTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky to-gold">
              {t("pageHighlight")}
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{t("pageSubtitle")}</p>

          {/* Promo réelle */}
          <div className="inline-flex items-center gap-2.5 glass rounded-2xl px-5 py-3">
            <Tag size={17} className="text-gold" />
            <span className="text-white text-sm font-semibold">
              {t("promoLine", { percent: promo.percent, code: promo.code })}
            </span>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="relative py-20 bg-linear-to-b from-white via-neutral-light to-white overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-sky/10 blur-3xl pointer-events-none" />
        <div className="relative container mx-auto px-4 xl:px-8 max-w-7xl">
          <ProductGrid products={products} />

          {/* Pied */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={16} className="text-emerald-500" />
              {t("secure")}
            </span>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-dark transition-all hover:scale-105"
            >
              {t("browseStore")}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
