import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/motion/Reveal";
import SectionHeading, { MoreLink } from "@/components/home/SectionHeading";

type Project = {
  slug: string;
  titleFr: string;
  titleEn: string;
  category: string;
  coverImage: string;
  client: string;
};

// Réalisations : deux colonnes décalées sur ordinateur (quatre projets), carrousel à faire glisser sur téléphone (tous).
export default async function PortfolioSection({ projects, locale }: { projects: Project[]; locale: string }) {
  const t = await getTranslations("home.work");
  if (!projects.length) return null;

  return (
    <Reveal className="overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-5 xl:px-8">
        <SectionHeading title={t("title")} lead={t("lead")} action={<MoreLink href="/portfolio">{t("viewAll")}</MoreLink>} />

        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0 lg:gap-x-12">
          {projects.slice(0, 6).map((p) => {
            const title = locale === "fr" ? p.titleFr : p.titleEn;
            return (
              <li key={p.slug} data-reveal className="w-[82vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none md:even:mt-20 md:[&:nth-child(n+5)]:hidden">
                <Link href={{ pathname: "/portfolio/[slug]", params: { slug: p.slug } }} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
                    {/* Calque plus haut que le cadre : il peut glisser sans découvrir les bords. */}
                    <div data-parallax="5" className="absolute inset-x-0 -inset-y-[7%]">
                      <Image
                        src={p.coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 82vw, (max-width: 1280px) 46vw, 600px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-navy">
                      {t.has(`categories.${p.category}`) ? t(`categories.${p.category}`) : p.category}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-4 right-4 hidden h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-white text-navy opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex"
                    >
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-azure sm:mt-5 sm:text-xl">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.client}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div data-reveal className="mt-6 md:hidden">
          <MoreLink href="/portfolio" variant="block">
            {t("viewAll")}
          </MoreLink>
        </div>
      </div>
    </Reveal>
  );
}
