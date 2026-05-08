export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
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

  const projects = await prisma.project.findMany({
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
  });

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
          <div className="mt-8 flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-white">{projects.length}+</div>
              <div className="text-sm text-gray-400">{isEn ? "Projects" : "Projets"}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-sky">6</div>
              <div className="text-sm text-gray-400">{isEn ? "Categories" : "Catégories"}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gold">98%</div>
              <div className="text-sm text-gray-400">{isEn ? "Satisfaction" : "Satisfaction"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <PortfolioGrid projects={projects} locale={locale} />
        </div>
      </section>

      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">
            {isEn ? "Want to be our next success story?" : "Vous voulez être notre prochaine réussite ?"}
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {isEn
              ? "Contact us to discuss your project and discover how we can transform your vision into reality."
              : "Contactez-nous pour discuter de votre projet et découvrir comment nous pouvons transformer votre vision en réalité."}
          </p>
          <a
            href={`/${locale}/devis`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            {isEn ? "Start my project" : "Démarrer mon projet"}
          </a>
        </div>
      </section>
    </main>
  );
}
