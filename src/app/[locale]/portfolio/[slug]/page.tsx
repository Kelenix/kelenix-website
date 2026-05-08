import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ChevronRight, Target, Lightbulb, BarChart3 } from "lucide-react";

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
  const { locale, slug } = await params;
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
  const { locale, slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  const t = await getTranslations("common");
  const isEn = locale === "en";

  const title = isEn ? project.titleEn : project.titleFr;
  const problem = isEn ? project.problemEn : project.problemFr;
  const solution = isEn ? project.solutionEn : project.solutionFr;
  const results = isEn ? project.resultsEn : project.resultsFr;
  const technologies = parseTechnologies(project.technologies);
  const gallery = parseGallery(project.gallery);

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
              <Link href="/portfolio" className="hover:text-sky transition-colors">
                Portfolio
              </Link>
            </li>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <li className="text-navy font-medium truncate max-w-xs">{title}</li>
          </ol>
        </div>
      </nav>

      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy to-sky/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto px-4 xl:px-8 max-w-7xl">
          <span className="inline-block bg-sky text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            {project.category}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-gray-300 text-lg">{project.client}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-light rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center mb-5">
                <Target size={22} className="text-sky" />
              </div>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                {isEn ? "The problem" : "La problématique"}
              </h2>
              <p className="text-gray-600 leading-relaxed">{problem}</p>
            </div>
            <div className="bg-navy rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-sky/20 rounded-xl flex items-center justify-center mb-5">
                <Lightbulb size={22} className="text-sky" />
              </div>
              <h2 className="font-heading font-bold text-xl mb-4">
                {isEn ? "Our solution" : "Notre solution"}
              </h2>
              <p className="text-gray-300 leading-relaxed">{solution}</p>
            </div>
            <div className="bg-sky rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <BarChart3 size={22} className="text-white" />
              </div>
              <h2 className="font-heading font-bold text-xl mb-4">
                {isEn ? "Results" : "Résultats"}
              </h2>
              <p className="text-white/90 leading-relaxed">{results}</p>
            </div>
          </div>
        </div>
      </section>

      {technologies.length > 0 && (
        <section className="py-16 bg-neutral-light">
          <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
            <h2 className="font-heading text-2xl font-extrabold text-navy mb-8 text-center">
              {isEn ? "Technologies used" : "Technologies utilisées"}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-navy font-semibold text-sm shadow-sm hover:border-sky/40 hover:text-sky transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
            <h2 className="font-heading text-2xl font-extrabold text-navy mb-8">
              {isEn ? "Project gallery" : "Galerie du projet"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img, i) => (
                <div key={i} className="relative h-56 rounded-2xl overflow-hidden shadow-card group">
                  <Image
                    src={img}
                    alt={`${title} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">
            {isEn ? "Want a similar project?" : "Vous voulez un projet similaire ?"}
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {isEn
              ? "Contact us for a free quote and let's build your success story together."
              : "Contactez-nous pour un devis gratuit et construisons ensemble votre histoire de succès."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              {isEn ? "Request a quote" : "Demander un devis"} <ArrowRight size={16} />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              {t("backToPortfolio")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
