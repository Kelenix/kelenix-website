export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import { container, section } from "@/components/site/styles";
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
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      <section className={`bg-white ${section}`}>
        <div className={container}>
          <BlogGrid posts={posts} locale={locale} postsPerPage={POSTS_PER_PAGE} />
        </div>
      </section>
    </>
  );
}
