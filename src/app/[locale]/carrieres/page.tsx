export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import {
  Heart,
  Zap,
  Globe,
  TrendingUp,
  Users,
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Laptop,
  GraduationCap,
  Shield,
  Coffee,
} from "lucide-react";
import CareersForm from "./CareersForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Careers at Kelenix Tech" : "Carrières chez Kelenix Tech",
    description: isEn
      ? "Join the Kelenix team and build the future of technology. Discover our open positions and submit your spontaneous application."
      : "Rejoignez l'équipe Kelenix et construisons ensemble l'avenir de la technologie. Découvrez nos postes ouverts et soumettez votre candidature spontanée.",
  };
}

const culturePoints = [
  {
    icon: Zap,
    titleFr: "Innovation constante",
    titleEn: "Constant innovation",
    descFr: "Nous encourageons l'expérimentation, les nouvelles idées et les approches créatives pour résoudre des problèmes complexes.",
    descEn: "We encourage experimentation, new ideas and creative approaches to solving complex problems.",
  },
  {
    icon: Users,
    titleFr: "Esprit d'équipe",
    titleEn: "Team spirit",
    descFr: "Un environnement collaboratif et bienveillant où chaque voix compte et chaque contribution est valorisée.",
    descEn: "A collaborative and caring environment where every voice counts and every contribution is valued.",
  },
  {
    icon: TrendingUp,
    titleFr: "Croissance continue",
    titleEn: "Continuous growth",
    descFr: "Formation continue, conférences, certifications — nous investissons dans votre développement professionnel.",
    descEn: "Ongoing training, conferences, certifications — we invest in your professional development.",
  },
  {
    icon: Globe,
    titleFr: "Impact mondial",
    titleEn: "Global impact",
    descFr: "Travaillez sur des projets qui touchent des milliers d'utilisateurs à travers le monde.",
    descEn: "Work on projects that impact thousands of users around the world.",
  },
  {
    icon: Heart,
    titleFr: "Bien-être au travail",
    titleEn: "Work-life balance",
    descFr: "Un équilibre sain entre vie professionnelle et personnelle avec des horaires flexibles et un environnement positif.",
    descEn: "A healthy work-life balance with flexible hours and a positive environment.",
  },
];

const benefits = [
  { icon: Laptop, labelFr: "Télétravail possible", labelEn: "Remote work available" },
  { icon: GraduationCap, labelFr: "Formation continue offerte", labelEn: "Ongoing training provided" },
  { icon: Shield, labelFr: "Mutuelle d'entreprise", labelEn: "Company health insurance" },
  { icon: Coffee, labelFr: "Environnement inspirant", labelEn: "Inspiring environment" },
  { icon: TrendingUp, labelFr: "Plan de carrière clair", labelEn: "Clear career path" },
  { icon: Globe, labelFr: "Projets internationaux", labelEn: "International projects" },
];

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("careers");
  const isEn = locale === "en";

  const jobs = await prisma.jobPosting.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
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
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-4">
              {t("culture.title")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t("culture.description")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturePoints.map((point) => (
              <div
                key={point.titleFr}
                className="bg-neutral-light rounded-2xl p-7 border border-gray-100 hover:border-sky/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sky/20 transition-colors">
                  <point.icon size={22} className="text-sky" />
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-3">
                  {isEn ? point.titleEn : point.titleFr}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{isEn ? point.descEn : point.descFr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-4">
              {t("openPositions")}
            </h2>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card">
              <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isEn ? "No open positions at the moment." : "Aucun poste ouvert pour le moment."}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isEn
                  ? "Feel free to send a spontaneous application below."
                  : "N'hésitez pas à envoyer une candidature spontanée ci-dessous."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job: { id: string; titleFr: string; titleEn: string; descFr: string; descEn: string; location: string; contractType: string }) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover:border-sky/20 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-navy text-xl mb-2">
                        {isEn ? job.titleEn : job.titleFr}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-sky" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-sky" />
                          {job.contractType}
                        </span>
                      </div>
                    </div>
                    <a
                      href="#apply"
                      className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors text-sm"
                    >
                      {isEn ? "Apply" : "Postuler"} <ArrowRight size={14} />
                    </a>
                  </div>
                  <div
                    className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: isEn ? job.descEn : job.descFr }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-4">
              {isEn ? "Employee benefits" : "Avantages employé"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.labelFr} className="text-center p-5 bg-neutral-light rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <benefit.icon size={20} className="text-sky" />
                </div>
                <p className="text-xs font-semibold text-navy leading-tight">
                  {isEn ? benefit.labelEn : benefit.labelFr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-4">
              {t("spontaneous.title")}
            </h2>
            <p className="text-gray-500">{t("spontaneous.description")}</p>
          </div>
          <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
            <CareersForm locale={locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
