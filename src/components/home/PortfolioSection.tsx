"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";

type Project = {
  slug: string;
  titleFr: string;
  titleEn: string;
  category: string;
  coverImage: string;
  client: string;
};

export default function PortfolioSection({ projects, locale }: { projects: Project[]; locale: string }) {
  const t = useTranslations("portfolio");

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {projects.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={{ pathname: "/portfolio/[slug]", params: { slug: p.slug } }}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={p.coverImage}
                  alt={locale === "fr" ? p.titleFr : p.titleEn}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3">
                  <span className="bg-sky/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{p.client}</p>
                <h3 className="font-heading font-bold text-navy text-sm group-hover:text-sky transition-colors line-clamp-2">
                  {locale === "fr" ? p.titleFr : p.titleEn}
                </h3>
                <div className="mt-3 flex items-center gap-1 text-sky text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("viewProject")} <ExternalLink size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-sky transition-colors duration-200"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
