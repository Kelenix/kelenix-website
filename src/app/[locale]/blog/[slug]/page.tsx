import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { decodeSlug, formatDate } from "@/lib/utils";
import PageHero from "@/components/site/PageHero";
import { card, container, h2, section, textLink } from "@/components/site/styles";

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
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
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

// Liens de partage : chaque réseau reçoit l'adresse publique de l'article.
function ShareButtons({ title, url, locale }: { title: string; url: string; locale: string }) {
  const u = encodeURIComponent(url);
  const networks = [
    { label: "X", name: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${u}` },
    { label: "in", name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "f", name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-navy">{locale === "fr" ? "Partager" : "Share"}</span>
      {networks.map((network) => (
        <a
          key={network.name}
          href={network.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${locale === "fr" ? "Partager sur" : "Share on"} ${network.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          {network.label}
        </a>
      ))}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  const t = await getTranslations("common");
  const tBlog = await getTranslations("home.blog");
  const tNav = await getTranslations("nav");
  const isEn = locale === "en";

  const title = isEn ? post.titleEn : post.titleFr;
  const content = isEn ? post.contentEn : post.contentFr;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://kelenix.com"}/${locale}/blog/${post.slug}`;

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

  const catLabel = (cat: string) => (tBlog.has(`categories.${cat}`) ? tBlog(`categories.${cat}`) : cat);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("blog"), href: "/blog" }, { label: title }]}
        eyebrow={catLabel(post.category)}
        title={title}
        lead={
          <span className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-base">
            {post.authorImage && (
              // eslint-disable-next-line @next/next/no-img-element -- photo saisie dans l'admin : domaine libre, hors remotePatterns
              <img src={post.authorImage} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
            )}
            <span className="font-medium text-navy">{post.authorName}</span>
            {post.publishedAt && <span className="before:mr-2.5 before:content-['·']">{formatDate(post.publishedAt, locale)}</span>}
          </span>
        }
      />

      <article className={`bg-white ${section}`}>
        <div className="container mx-auto max-w-4xl px-5">
          {post.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-mist sm:mb-14">
              <Image src={post.coverImage} alt={title} fill sizes="(max-width: 896px) 100vw, 856px" className="object-cover" priority />
            </div>
          )}

          <div className="prose-kelenix mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="mx-auto mt-12 max-w-3xl border-t border-line pt-8">
            <ShareButtons title={title} url={url} locale={locale} />

            {(post.authorName || post.authorBio) && (
              <div className={`mt-8 flex items-start gap-4 bg-mist/70 p-5 sm:gap-6 sm:p-7 ${card}`}>
                {post.authorImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- photo saisie dans l'admin : domaine libre, hors remotePatterns
                  <img src={post.authorImage} alt="" width={64} height={64} loading="lazy" className="h-14 w-14 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-azure font-display text-2xl text-white sm:h-16 sm:w-16">
                    {post.authorName.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm text-muted">{isEn ? "Written by" : "Écrit par"}</p>
                  <p className="text-lg font-semibold text-navy">{post.authorName}</p>
                  {post.authorBio && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{post.authorBio}</p>}
                </div>
              </div>
            )}

            <Link href="/blog" className={`mt-8 inline-flex items-center gap-2 ${textLink}`}>
              <ArrowLeft size={16} /> {t("backToBlog")}
            </Link>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className={`bg-mist ${section}`}>
          <div className={container}>
            <h2 className={`mb-8 sm:mb-12 ${h2}`}>{isEn ? "Related articles" : "Articles similaires"}</h2>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
              {relatedPosts.map((related) => {
                const relatedTitle = isEn ? related.titleEn : related.titleFr;
                return (
                  <Link key={related.slug} href={{ pathname: "/blog/[slug]", params: { slug: related.slug } }} className="group flex items-center gap-4 sm:block">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-sky/30 to-azure/40 sm:aspect-[16/10] sm:h-auto sm:w-full sm:rounded-3xl">
                      {related.coverImage && (
                        <Image
                          src={related.coverImage}
                          alt={relatedTitle}
                          fill
                          sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <div className="min-w-0 sm:mt-5">
                      <p className="text-[13px] text-muted sm:text-sm">
                        <span className="font-semibold text-azure">{catLabel(related.category)}</span>
                        {related.publishedAt && <span className="hidden before:mx-2 before:content-['·'] sm:inline">{formatDate(related.publishedAt, locale)}</span>}
                      </p>
                      <h3 className="mt-1 line-clamp-3 text-base font-semibold leading-snug text-navy transition-colors group-hover:text-azure sm:mt-2 sm:text-xl">{relatedTitle}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
