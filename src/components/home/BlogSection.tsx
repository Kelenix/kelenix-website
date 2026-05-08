"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Post = {
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  coverImage: string | null;
  authorName: string;
  category: string;
  publishedAt: Date | null;
};

export default function BlogSection({ posts, locale }: { posts: Post[]; locale: string }) {
  const t = useTranslations("blog");

  if (!posts.length) return null;

  return (
    <section className="py-24 bg-neutral-light">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={locale === "fr" ? post.titleFr : post.titleEn}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy to-sky/50" />
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-sky text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                    {post.category.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <User size={12} />
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
                  {locale === "fr" ? post.titleFr : post.titleEn}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {locale === "fr" ? post.excerptFr : post.excerptEn}
                </p>
                <div className="flex items-center gap-1 text-sky text-sm font-medium">
                  {t("readMore")} <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-sky transition-colors duration-200"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
