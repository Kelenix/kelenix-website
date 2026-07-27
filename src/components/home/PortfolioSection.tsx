"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Project = {
  slug: string;
  titleFr: string;
  titleEn: string;
  category: string;
  coverImage: string;
  client: string;
};

// Couleur de badge par catégorie
const categoryColors: Record<string, string> = {
  WEB: "bg-sky",
  MOBILE: "bg-purple-500",
  AI: "bg-gold text-navy",
  SOFTWARE: "bg-emerald-500",
  CONSULTING: "bg-indigo-500",
  TRAINING: "bg-orange-500",
};

export default function PortfolioSection({ projects, locale }: { projects: Project[]; locale: string }) {
  const t = useTranslations("portfolio");

  return (
    <section className="relative py-24 bg-linear-to-b from-white via-neutral-light to-white overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-sky/5 blur-3xl pointer-events-none" />
      <div className="relative container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col gap-4 mb-12 max-w-6xl mx-auto">
          {projects.slice(0, 6).map((p) => {
            const badge = categoryColors[p.category] ?? "bg-sky";
            return (
              <Link
                key={p.slug}
                href={{ pathname: "/portfolio/[slug]", params: { slug: p.slug } }}
                className="group flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 hover:border-sky/30 p-3 sm:p-4"
              >
                <div className="relative w-full sm:w-52 h-44 sm:h-28 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={p.coverImage}
                    alt={locale === "fr" ? p.titleFr : p.titleEn}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                  <span className={`absolute top-3 left-3 ${badge} text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                    {p.category}
                  </span>
                </div>

                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  <p className="text-xs text-gray-400 mb-1.5">{p.client}</p>
                  <h3 className="font-heading font-bold text-navy text-base sm:text-lg mb-3 leading-snug group-hover:text-sky transition-colors line-clamp-2">
                    {locale === "fr" ? p.titleFr : p.titleEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sky text-sm font-semibold">
                    {t("viewProject")}
                    <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-sky transition-colors duration-200 shadow-lg shadow-navy/20"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
