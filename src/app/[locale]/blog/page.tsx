export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import BlogGrid from "./BlogGrid";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Blog — Tech News & Insights" : "Blog — Actualités & Insights Tech",
    description: isEn
      ? "Stay at the forefront of technology with Kelenix expert articles on software development, AI, digital transformation and more."
      : "Restez à la pointe de la technologie avec les articles experts Kelenix sur le développement logiciel, l'IA, la transformation digitale et plus.",
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("blog");
  const isEn = locale === "en";

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      titleFr: true,
      titleEn: true,
      excerptFr: true,
      excerptEn: true,
      coverImage: true,
      authorName: true,
      authorImage: true,
      category: true,
      publishedAt: true,
    },
  });

  const POSTS_PER_PAGE = 9;

  return (
    <main>
      <section className="bg-gradient-to-br from-navy via-navy to-sky/20 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,168,255,0.12)_0%,transparent_60%)]" />
        <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 bg-sky/10 border border-sky/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-sky animate-pulse" />
            <span className="text-sky text-sm font-medium">{t("badge")}</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white mb-6">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-gold">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <BlogGrid posts={posts} locale={locale} postsPerPage={POSTS_PER_PAGE} />
        </div>
      </section>
    </main>
  );
}
