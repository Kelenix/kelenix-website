export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";
import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { container, section } from "@/components/site/styles";
import PortfolioGrid from "./PortfolioGrid";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Portfolio" : "Portfolio",
    description: isEn
      ? "Discover all Kelenix projects: web apps, mobile, AI, custom software and more."
      : "Découvrez tous les projets Kelenix : applications web, mobile, IA, logiciels sur mesure et plus encore.",
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("portfolio");
  const isEn = locale === "en";

  const [projects, stats] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        titleFr: true,
        titleEn: true,
        category: true,
        coverImage: true,
        client: true,
      },
    }),
    getSiteStats(),
  ]);

  const figures = [
    { value: `${projects.length}+`, label: isEn ? "Projects" : "Projets" },
    { value: "6", label: isEn ? "Categories" : "Catégories" },
    { value: stats.satisfaction, label: "Satisfaction" },
  ];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")}>
        <dl className="flex justify-center gap-8 sm:gap-12">
          {figures.map((figure) => (
            <div key={figure.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-muted">{figure.label}</dt>
              <dd className="font-display text-4xl font-medium leading-none tracking-[-0.03em] tabular-nums text-navy">{figure.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <PortfolioGrid projects={projects} locale={locale} />
        </div>
      </section>

      <CtaBand
        title={isEn ? "Want to be our next success story?" : "Vous voulez être notre prochaine réussite ?"}
        text={
          isEn
            ? "Contact us to discuss your project and discover how we can transform your vision into reality."
            : "Contactez-nous pour discuter de votre projet et découvrir comment nous pouvons transformer votre vision en réalité."
        }
        primary={{ href: "/devis", label: isEn ? "Start my project" : "Démarrer mon projet" }}
      />
    </>
  );
}
