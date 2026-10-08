"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
  const t = useTranslations("home.work");
  const tCommon = useTranslations("common");
  const isEn = locale === "en";
  const [active, setActive] = useState("ALL");

  const visible = active === "ALL" ? projects : projects.filter((p) => p.category === active);
  const catLabel = (cat: string) => (cat === "ALL" ? tCommon("all") : t.has(`categories.${cat}`) ? t(`categories.${cat}`) : cat);

  return (
    <>
      {/* Filtres : rangée à faire glisser sur téléphone */}
      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:mb-12 sm:flex-wrap sm:justify-center sm:px-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              active === cat ? "bg-navy text-white" : "border border-line bg-white text-muted hover:text-navy"
            }`}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">{isEn ? "No projects in this category." : "Aucun projet dans cette catégorie."}</p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {visible.map((p) => {
            const title = isEn ? p.titleEn : p.titleFr;
            return (
              <Link key={p.slug} href={{ pathname: "/portfolio/[slug]", params: { slug: p.slug } }} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white">
                  {p.coverImage && (
                    <Image
                      src={p.coverImage}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-navy">{catLabel(p.category)}</span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-4 right-4 hidden h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-white text-navy opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex"
                  >
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-azure">{title}</h3>
                <p className="mt-1 text-sm text-muted">{p.client}</p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
