"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, Calendar, User, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Post = {
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  coverImage: string | null;
  authorName: string;
  authorImage: string | null;
  category: string;
  publishedAt: Date | null;
};

const CATEGORIES = ["ALL", "DEVELOPMENT", "AI", "DIGITAL", "NEWS", "GUIDES"];

export default function BlogGrid({
  posts,
  locale,
  postsPerPage = 9,
}: {
  posts: Post[];
  locale: string;
  postsPerPage?: number;
}) {
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const isEn = locale === "en";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [page, setPage] = useState(1);

  const catLabel = (cat: string) => {
    if (cat === "ALL") return tCommon("all");
    const map: Record<string, string> = {
      DEVELOPMENT: isEn ? "Development" : "Développement",
      AI: isEn ? "Artificial Intelligence" : "Intelligence Artificielle",
      DIGITAL: isEn ? "Digital Strategy" : "Stratégie Digitale",
      NEWS: isEn ? "Tech News" : "Actualités Tech",
      GUIDES: "Guides",
    };
    return map[cat] ?? cat;
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const title = isEn ? p.titleEn : p.titleFr;
      const excerpt = isEn ? p.excerptEn : p.excerptFr;
      const matchSearch =
        !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "ALL" || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [posts, search, activeCategory, isEn]);

  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const paginated = filtered.slice((page - 1) * postsPerPage, page * postsPerPage);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={tCommon("search") + "..."}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? "bg-sky text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-sky/40 hover:text-sky"
            }`}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>{isEn ? "No articles match your search." : "Aucun article ne correspond à votre recherche."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginated.map((post) => (
            <Link
              key={post.slug}
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={isEn ? post.titleEn : post.titleFr}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy to-sky/30" />
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-sky text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {catLabel(post.category)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    {post.authorImage ? (
                      <img
                        src={post.authorImage}
                        alt={post.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User size={12} />
                    )}
                    {post.authorName}
                  </span>
                  {post.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {formatDate(post.publishedAt, locale)}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-navy text-base mb-3 line-clamp-2 group-hover:text-sky transition-colors">
                  {isEn ? post.titleEn : post.titleFr}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {isEn ? post.excerptEn : post.excerptFr}
                </p>
                <div className="flex items-center gap-1 text-sky text-sm font-medium">
                  {t("readMore")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-sky hover:text-sky transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                page === p
                  ? "bg-sky text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-sky hover:text-sky"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-sky hover:text-sky transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
