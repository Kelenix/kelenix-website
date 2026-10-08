export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
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
  Laptop,
  GraduationCap,
  Shield,
  Coffee,
} from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { btnDark, btnPrimary, card, container, h2, iconTile, lead, section } from "@/components/site/styles";
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
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")}>
        <a href="#apply" className={`group ${btnPrimary}`}>
          {isEn ? "Apply" : "Postuler"}
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </a>
      </PageHero>

      {/* Culture */}
      <section className={`bg-white ${section}`}>
        <div className={container}>
          <div className="mb-10 max-w-2xl sm:mb-14">
            <h2 className={h2}>{t("culture.title")}</h2>
            <p className={`mt-4 ${lead}`}>{t("culture.description")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {culturePoints.map((point) => (
              <div key={point.titleFr} className={`flex gap-4 p-5 sm:block sm:p-7 ${card}`}>
                <span className={`sm:mb-5 ${iconTile}`}>
                  <point.icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-navy sm:text-xl">{isEn ? point.titleEn : point.titleFr}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted sm:mt-2">{isEn ? point.descEn : point.descFr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Postes ouverts */}
      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <h2 className={`mb-8 sm:mb-12 ${h2}`}>{t("openPositions")}</h2>
          {jobs.length === 0 ? (
            <div className={`p-8 text-center sm:p-12 ${card}`}>
              <Briefcase size={36} className="mx-auto mb-4 text-muted/60" />
              <p className="text-lg font-semibold text-navy">{isEn ? "No open positions at the moment." : "Aucun poste ouvert pour le moment."}</p>
              <p className="mt-2 text-[15px] text-muted">
                {isEn ? "Feel free to send a spontaneous application below." : "N'hésitez pas à envoyer une candidature spontanée ci-dessous."}
              </p>
            </div>
          ) : (
            <ul className={`divide-y divide-line overflow-hidden ${card}`}>
              {jobs.map((job: { id: string; titleFr: string; titleEn: string; descFr: string; descEn: string; location: string; contractType: string }) => (
                <li key={job.id} className="p-5 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-medium tracking-[-0.02em] text-navy sm:text-[1.75rem]">{isEn ? job.titleEn : job.titleFr}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-azure" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-azure" />
                          {job.contractType}
                        </span>
                      </div>
                    </div>
                    <a href="#apply" className={`group shrink-0 px-6 py-3 text-[15px] ${btnDark}`}>
                      {isEn ? "Apply" : "Postuler"}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                  <div className="mt-4 line-clamp-3 max-w-3xl text-[15px] leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: isEn ? job.descEn : job.descFr }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Avantages */}
      <section className={`bg-white ${section}`}>
        <div className={`${container} grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <h2 className={h2}>{isEn ? "Employee benefits" : "Avantages employé"}</h2>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit.labelFr} className="flex items-center gap-4 border-b border-line py-4 text-[15px] font-medium text-navy sm:text-base">
                <span className={iconTile}>
                  <benefit.icon size={20} />
                </span>
                {isEn ? benefit.labelEn : benefit.labelFr}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Candidature */}
      <section id="apply" className={`scroll-mt-20 bg-mist ${section}`}>
        <div className="container mx-auto max-w-3xl px-4 sm:px-5">
          <div className="mb-8 sm:mb-10">
            <h2 className={h2}>{t("spontaneous.title")}</h2>
            <p className={`mt-4 ${lead}`}>{t("spontaneous.description")}</p>
          </div>
          <div className={`p-5 sm:p-8 lg:p-10 ${card}`}>
            <CareersForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
