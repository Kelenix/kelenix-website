import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { decodeSlug } from "@/lib/utils";
import Image from "next/image";
import { Target, Lightbulb, BarChart3 } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { body, card, chip, container, h2, iconTile, section } from "@/components/site/styles";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const locales = ["fr", "en"];
  return locales.flatMap((locale) =>
    projects.map((p: { slug: string }) => ({ locale, slug: p.slug }))
  );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  const isEn = locale === "en";
  return {
    title: isEn ? project.titleEn : project.titleFr,
    description: isEn
      ? project.descEn.replace(/<[^>]+>/g, "").slice(0, 160)
      : project.descFr.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: {
      images: [{ url: project.coverImage }],
    },
  };
}

function parseTechnologies(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

function parseGallery(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  const t = await getTranslations("common");
  const tWork = await getTranslations("home.work");
  const tNav = await getTranslations("nav");
  const isEn = locale === "en";

  const title = isEn ? project.titleEn : project.titleFr;
  const problem = isEn ? project.problemEn : project.problemFr;
  const solution = isEn ? project.solutionEn : project.solutionFr;
  const results = isEn ? project.resultsEn : project.resultsFr;
  const technologies = parseTechnologies(project.technologies);
  const gallery = parseGallery(project.gallery);
  const category = tWork.has(`categories.${project.category}`) ? tWork(`categories.${project.category}`) : project.category;

  return (
    <>
      <PageHero
        align="left"
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("portfolio"), href: "/portfolio" }, { label: title }]}
        eyebrow={category}
        title={title}
        lead={project.client}
      />

      <section className={`bg-white ${section}`}>
        <div className={container}>
          {project.coverImage && (
            <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-3xl bg-mist sm:mb-14 lg:aspect-[21/9]">
              <Image src={project.coverImage} alt={title} fill sizes="(max-width: 1280px) 100vw, 1240px" className="object-cover" priority />
            </div>
          )}

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            <div className={`bg-mist/70 p-6 sm:p-8 ${card}`}>
              <span className={`mb-5 bg-white ${iconTile}`}>
                <Target size={22} />
              </span>
              <h2 className="text-xl font-semibold text-navy">{isEn ? "The problem" : "La problématique"}</h2>
              <p className={`mt-3 ${body}`}>{problem}</p>
            </div>
            <div className={`p-6 sm:p-8 ${card}`}>
              <span className={`mb-5 ${iconTile}`}>
                <Lightbulb size={22} />
              </span>
              <h2 className="text-xl font-semibold text-navy">{isEn ? "Our solution" : "Notre solution"}</h2>
              <p className={`mt-3 ${body}`}>{solution}</p>
            </div>
            <div className="rounded-3xl bg-linear-to-br from-azure to-[#1580EE] p-6 text-white sm:p-8">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/18">
                <BarChart3 size={22} />
              </span>
              <h2 className="text-xl font-semibold">{isEn ? "Results" : "Résultats"}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/90 sm:text-base">{results}</p>
            </div>
          </div>

          {technologies.length > 0 && (
            <div className="mt-12 border-t border-line pt-10 sm:mt-16 sm:pt-12">
              <h2 className="text-xl font-semibold text-navy">{isEn ? "Technologies used" : "Technologies utilisées"}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <li key={tech} className={chip}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className={`bg-mist ${section}`}>
          <div className={container}>
            <h2 className={`mb-8 sm:mb-12 ${h2}`}>{isEn ? "Project gallery" : "Galerie du projet"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {gallery.map((img, i) => (
                <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-white">
                  <Image
                    src={img}
                    alt={`${title} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={isEn ? "Want a similar project?" : "Vous voulez un projet similaire ?"}
        text={
          isEn
            ? "Contact us for a free quote and let's build your success story together."
            : "Contactez-nous pour un devis gratuit et construisons ensemble votre histoire de succès."
        }
        primary={{ href: "/devis", label: isEn ? "Request a quote" : "Demander un devis" }}
        secondary={{ href: "/portfolio", label: t("backToPortfolio") }}
      />
    </>
  );
}
