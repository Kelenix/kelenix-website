"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  const t = useTranslations("home.blog");
  const tCommon = useTranslations("common");
  const isEn = locale === "en";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [page, setPage] = useState(1);

  const catLabel = (cat: string) => (cat === "ALL" ? tCommon("all") : t.has(`categories.${cat}`) ? t(`categories.${cat}`) : cat);

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

  const pageButton = "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-center lg:justify-between">
        {/* Catégories : rangée à faire glisser sur téléphone */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              aria-pressed={activeCategory === cat}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeCategory === cat ? "bg-navy text-white" : "border border-line bg-white text-muted hover:text-navy"
              }`}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>

        <div className="relative lg:w-80">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            aria-label={tCommon("search")}
            placeholder={tCommon("search") + "..."}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-[15px] text-navy transition placeholder:text-muted/70 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10"
          />
        </div>
      </div>

      {paginated.length === 0 ? (
        <p className="py-16 text-center text-muted">{isEn ? "No articles match your search." : "Aucun article ne correspond à votre recherche."}</p>
      ) : (
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {paginated.map((post) => {
            const title = isEn ? post.titleEn : post.titleFr;
            return (
              <Link key={post.slug} href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }} className="group flex items-center gap-4 sm:block">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-sky/30 to-azure/40 sm:aspect-[16/10] sm:h-auto sm:w-full sm:rounded-3xl">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="min-w-0 sm:mt-5">
                  <p className="text-[13px] text-muted sm:text-sm">
                    <span className="font-semibold text-azure">{catLabel(post.category)}</span>
                    {post.publishedAt && <span className="hidden before:mx-2 before:content-['·'] sm:inline">{formatDate(post.publishedAt, locale)}</span>}
                  </p>
                  <h2 className="mt-1 line-clamp-3 text-base font-semibold leading-snug text-navy transition-colors group-hover:text-azure sm:mt-2 sm:text-xl">{title}</h2>
                  <p className="mt-2 hidden line-clamp-2 text-[15px] leading-relaxed text-muted sm:[display:-webkit-box]">{isEn ? post.excerptEn : post.excerptFr}</p>
                  <p className="mt-3 hidden text-sm text-muted sm:block">{post.authorName}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label={isEn ? "Previous page" : "Page précédente"}
            className={`${pageButton} border border-line bg-white text-navy hover:bg-mist`}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={page === p ? "page" : undefined}
              className={`${pageButton} ${page === p ? "bg-navy text-white" : "border border-line bg-white text-navy hover:bg-mist"}`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label={isEn ? "Next page" : "Page suivante"}
            className={`${pageButton} border border-line bg-white text-navy hover:bg-mist`}
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </>
  );
}
