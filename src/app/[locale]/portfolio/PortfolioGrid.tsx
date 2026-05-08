"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ExternalLink, Filter } from "lucide-react";

type Project = {
  slug: string;
  titleFr: string;
  titleEn: string;
  category: string;
  coverImage: string;
  client: string;
};

const CATEGORIES = ["ALL", "WEB", "MOBILE", "AI", "SOFTWARE", "CONSULTING", "TRAINING"];

export default function PortfolioGrid({ projects, locale }: { projects: Project[]; locale: string }) {
  const t = useTranslations("portfolio");
  const tCommon = useTranslations("common");
  const isEn = locale === "en";
  const [active, setActive] = useState("ALL");

  const visible = active === "ALL" ? projects : projects.filter((p) => p.category === active);

  const catLabel = (cat: string) => {
    if (cat === "ALL") return tCommon("all");
    const map: Record<string, string> = {
      WEB: "Web",
      MOBILE: "Mobile",
      AI: isEn ? "AI" : "IA",
      SOFTWARE: isEn ? "Software" : "Logiciel",
      CONSULTING: "Consulting",
      TRAINING: isEn ? "Training" : "Formation",
    };
    return map[cat] ?? cat;
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
        <Filter size={16} className="text-gray-400 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active === cat
                ? "bg-sky text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-sky/40 hover:text-sky"
            }`}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>{isEn ? "No projects in this category." : "Aucun projet dans cette catégorie."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((p) => (
            <Link
              key={p.slug}
              href={{ pathname: "/portfolio/[slug]", params: { slug: p.slug } }}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-navy to-sky/30">
                {p.coverImage && (
                  <Image
                    src={p.coverImage}
                    alt={isEn ? p.titleEn : p.titleFr}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3">
                  <span className="bg-sky/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-1">{p.client}</p>
                <h3 className="font-heading font-bold text-navy text-base group-hover:text-sky transition-colors line-clamp-2">
                  {isEn ? p.titleEn : p.titleFr}
                </h3>
                <div className="mt-4 flex items-center gap-1 text-sky text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("viewProject")} <ExternalLink size={13} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
