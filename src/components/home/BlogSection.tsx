import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
import SectionHeading, { MoreLink } from "@/components/home/SectionHeading";

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

function Cover({ post, title, sizes, className }: { post: Post; title: string; sizes: string; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-linear-to-br from-sky/30 to-azure/40 ${className}`}>
      {post.coverImage && (
        <Image src={post.coverImage} alt={title} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      )}
    </div>
  );
}

// Blog : un article à la une et deux articles en ligne. Sur téléphone, les suivants sont des lignes compactes.
export default async function BlogSection({ posts, locale }: { posts: Post[]; locale: string }) {
  const t = await getTranslations("home.blog");
  if (!posts.length) return null;

  const [first, ...rest] = posts.slice(0, 3);
  const text = (post: Post) => ({
    title: locale === "fr" ? post.titleFr : post.titleEn,
    excerpt: locale === "fr" ? post.excerptFr : post.excerptEn,
    category: t.has(`categories.${post.category}`) ? t(`categories.${post.category}`) : post.category,
    date: post.publishedAt ? formatDate(post.publishedAt, locale) : null,
  });
  const lead = text(first);

  return (
    <Reveal className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-5 xl:px-8">
        <SectionHeading title={t("title")} action={<MoreLink href="/blog">{t("viewAll")}</MoreLink>} />

        <div className={`grid gap-8 lg:gap-12 ${rest.length ? "lg:grid-cols-[1.2fr_1fr]" : ""}`}>
          <article data-reveal>
            <Link href={{ pathname: "/blog/[slug]", params: { slug: first.slug } }} className="group block">
              <Cover post={first} title={lead.title} sizes="(max-width: 1024px) 100vw, 660px" className="aspect-[16/10] rounded-3xl" />
              <p className="mt-5 text-sm text-muted">
                <span className="font-semibold text-azure">{lead.category}</span>
                {lead.date && <span className="before:mx-2 before:content-['·']">{lead.date}</span>}
              </p>
              <h3 className="mt-2 text-balance font-display text-2xl font-medium leading-tight tracking-[-0.02em] text-navy transition-colors group-hover:text-azure sm:text-[2rem]">
                {lead.title}
              </h3>
              <p className="mt-3 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">{lead.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy">
                {t("read")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </article>

          {rest.length > 0 && (
            <div className="flex flex-col divide-y divide-line border-t border-line lg:border-t-0">
              {rest.map((post) => {
                const item = text(post);
                return (
                  <article key={post.slug} data-reveal className="py-5 first:lg:pt-0 sm:py-7">
                    <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }} className="group flex items-center gap-4 sm:gap-6">
                      <Cover post={post} title={item.title} sizes="(max-width: 640px) 96px, 176px" className="h-24 w-24 rounded-2xl sm:h-36 sm:w-44" />
                      <div className="min-w-0">
                        <p className="text-[13px] text-muted sm:text-sm">
                          <span className="font-semibold text-azure">{item.category}</span>
                          {item.date && <span className="hidden before:mx-2 before:content-['·'] sm:inline">{item.date}</span>}
                        </p>
                        <h3 className="mt-1 line-clamp-3 text-base font-semibold leading-snug text-navy transition-colors group-hover:text-azure sm:text-xl">{item.title}</h3>
                        <p className="mt-2 hidden line-clamp-2 text-[15px] leading-relaxed text-muted lg:[display:-webkit-box]">{item.excerpt}</p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div data-reveal className="mt-6 md:hidden">
          <MoreLink href="/blog" variant="block">
            {t("viewAll")}
          </MoreLink>
        </div>
      </div>
    </Reveal>
  );
}
