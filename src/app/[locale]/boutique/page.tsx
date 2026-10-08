import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ShieldCheck, ArrowUpRight, Tag } from "lucide-react";
import ProductGrid from "@/components/home/ProductGrid";
import PageHero from "@/components/site/PageHero";
import { btnDark, container, section } from "@/components/site/styles";
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
      <PageHero eyebrow={t("badge")} title={`${t("pageTitle")} ${t("pageHighlight")}`} lead={t("pageSubtitle")}>
        {/* Promo réelle */}
        <p className="inline-flex items-center gap-2.5 self-center rounded-full bg-gold/20 px-5 py-2.5 text-sm font-semibold text-navy">
          <Tag size={16} className="shrink-0" />
          {t("promoLine", { percent: promo.percent, code: promo.code })}
        </p>
      </PageHero>

      {/* Catalogue */}
      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <ProductGrid products={products} />

          {/* Pied */}
          <div className="mt-12 flex flex-col items-center justify-center gap-5 text-center sm:flex-row">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
              {t("secure")}
            </span>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={`w-full sm:w-auto ${btnDark}`}>
              {t("browseStore")}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
