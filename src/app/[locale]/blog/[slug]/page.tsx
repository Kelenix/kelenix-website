import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight, Calendar, User, ArrowRight, Link2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const locales = ["fr", "en"];
  return locales.flatMap((locale) =>
    posts.map((p: { slug: string }) => ({ locale, slug: p.slug }))
  );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  const isEn = locale === "en";
  const title = isEn ? post.titleEn : post.titleFr;
  const description = isEn ? post.excerptEn : post.excerptFr;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function ShareButtons({ title, locale }: { title: string; locale: string }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-600">
        {locale === "fr" ? "Partager :" : "Share:"}
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-sky/10 flex items-center justify-center hover:bg-sky/20 transition-colors text-sky font-bold text-xs"
        title="Twitter / X"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center hover:bg-blue-600/20 transition-colors text-blue-600 font-bold text-xs"
        title="LinkedIn"
      >
        in
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors text-blue-500 font-bold text-xs"
        title="Facebook"
      >
        f
      </a>
      <button
        className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        title={locale === "fr" ? "Copier le lien" : "Copy link"}
      >
        <Link2 size={15} className="text-gray-600" />
      </button>
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  const t = await getTranslations("common");
  const tBlog = await getTranslations("blog");
  const isEn = locale === "en";

  const title = isEn ? post.titleEn : post.titleFr;
  const content = isEn ? post.contentEn : post.contentFr;

  const relatedPosts = await prisma.blogPost.findMany({
    where: { published: true, category: post.category, slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      slug: true,
      titleFr: true,
      titleEn: true,
      coverImage: true,
      publishedAt: true,
      authorName: true,
      category: true,
    },
  });

  const catLabel = (cat: string) => {
    const map: Record<string, string> = {
      DEVELOPMENT: isEn ? "Development" : "Développement",
      AI: isEn ? "Artificial Intelligence" : "Intelligence Artificielle",
      DIGITAL: isEn ? "Digital Strategy" : "Stratégie Digitale",
      NEWS: isEn ? "Tech News" : "Actualités Tech",
      GUIDES: "Guides",
    };
    return map[cat] ?? cat;
  };

  return (
    <main>
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-sky transition-colors">
                {isEn ? "Home" : "Accueil"}
              </Link>
            </li>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <li>
              <Link href="/blog" className="hover:text-sky transition-colors">
                Blog
              </Link>
            </li>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <li className="text-navy font-medium truncate max-w-xs">{title}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-navy to-sky/20 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,168,255,0.1)_0%,transparent_60%)]" />
        <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-4xl text-center">
          <span className="inline-block bg-sky text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-6">
            {catLabel(post.category)}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-300 text-sm flex-wrap">
            <span className="flex items-center gap-2">
              {post.authorImage ? (
                <img src={post.authorImage} alt={post.authorName} className="w-7 h-7 rounded-full object-cover border border-white/20" />
              ) : (
                <User size={15} />
              )}
              {post.authorName}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar size={15} />
                {formatDate(post.publishedAt, locale)}
              </span>
            )}
          </div>
        </div>
      </section>

      {post.coverImage && (
        <div className="relative h-72 sm:h-96 overflow-hidden -mt-8">
          <div className="container mx-auto px-4 xl:px-8 max-w-4xl h-full">
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl border border-white">
              <Image
                src={post.coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          <div
            className="prose-kelenix"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-100">
            <ShareButtons title={title} locale={locale} />
          </div>

          {(post.authorName || post.authorBio) && (
            <div className="mt-10 bg-neutral-light rounded-2xl p-8 flex gap-6 items-start border border-gray-100">
              {post.authorImage ? (
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy to-sky flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
                  {post.authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-sky uppercase tracking-wide mb-1">
                  {isEn ? "Written by" : "Écrit par"}
                </p>
                <h3 className="font-heading font-bold text-navy text-xl mb-2">{post.authorName}</h3>
                {post.authorBio && (
                  <p className="text-gray-500 text-sm leading-relaxed">{post.authorBio}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16 bg-neutral-light">
          <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
            <h2 className="font-heading text-2xl font-extrabold text-navy mb-8">
              {isEn ? "Related articles" : "Articles similaires"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((related: { slug: string; titleFr: string; titleEn: string; coverImage: string | null; publishedAt: Date | null; authorName: string; category: string }) => (
                <Link
                  key={related.slug}
                  href={{ pathname: "/blog/[slug]", params: { slug: related.slug } }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="relative h-44 overflow-hidden">
                    {related.coverImage ? (
                      <Image src={related.coverImage} alt={isEn ? related.titleEn : related.titleFr} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy to-sky/30" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-sky font-semibold">{catLabel(related.category)}</span>
                    <h3 className="font-heading font-bold text-navy text-sm mt-1 line-clamp-2 group-hover:text-sky transition-colors">
                      {isEn ? related.titleEn : related.titleFr}
                    </h3>
                    {related.publishedAt && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(related.publishedAt, locale)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sky font-semibold hover:gap-3 transition-all"
          >
            ← {t("backToBlog")}
          </Link>
        </div>
      </section>
    </main>
  );
}
