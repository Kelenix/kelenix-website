// Rendue à chaque requête : la page lit la base sans repli, elle ne doit pas être générée au build.
export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";
import { Target, Eye, Check, Award, Lightbulb } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { body, card, container, h2, iconTile, lead, section } from "@/components/site/styles";
import * as Icons from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "About Kelenix Tech" : "À propos de Kelenix Tech",
    description: isEn
      ? "Discover Kelenix's story, mission, vision, values and team. A technology company committed to your digital transformation."
      : "Découvrez l'histoire, la mission, la vision, les valeurs et l'équipe de Kelenix. Une entreprise technologique engagée dans votre transformation numérique.",
    openGraph: { images: [{ url: "/og-about.jpg" }] },
  };
}

// Parcours affiché tant qu'aucune étape n'est saisie dans Admin → À propos. L'entreprise a été fondée en 2024.
const defaultTimeline = [
  { year: "2024", titleFr: "Fondation", titleEn: "Foundation", descFr: "Kelenix Tech est fondée par une équipe de développeurs passionnés, avec une ambition : mettre la technologie au service de la croissance des entreprises.", descEn: "Kelenix Tech is founded by a team of passionate developers with one ambition: putting technology at the service of business growth." },
  { year: "2025", titleFr: "Premiers projets livrés", titleEn: "First projects delivered", descFr: "Sites web, applications web et mobiles, logiciels sur mesure : nos premières réalisations entrent en production chez nos clients.", descEn: "Websites, web and mobile apps, custom software: our first projects go live for our clients." },
  { year: "2026", titleFr: "Une offre qui s'élargit", titleEn: "A broader offering", descFr: "L'équipe s'étoffe et l'offre s'étend à l'intelligence artificielle, à la formation et aux produits numériques de la boutique.", descEn: "The team grows and the offering expands to artificial intelligence, training and the digital products of our store." },
];

const defaultTeam = [
  { name: "Lionel Djouaka", roleFr: "CEO & Fondateur", roleEn: "CEO & Founder", bioFr: "Ingénieur en informatique, Lionel a fondé Kelenix Tech avec la conviction que la technologie doit être au service de tous.", bioEn: "Computer engineer, Lionel founded Kelenix Tech with the conviction that technology must serve everyone.", avatar: "https://ui-avatars.com/api/?name=Lionel+Djouaka&background=0B1F3A&color=2FA8FF&size=200&bold=true" },
  { name: "Léa Martineau", roleFr: "CTO — Architecte Logiciel", roleEn: "CTO — Software Architect", bioFr: "Spécialiste en architecture cloud et systèmes distribués, Léa dirige les choix technologiques et la R&D de Kelenix.", bioEn: "Specialist in cloud architecture and distributed systems, Léa leads technology choices and Kelenix's R&D.", avatar: "https://ui-avatars.com/api/?name=Lea+Martineau&background=2FA8FF&color=ffffff&size=200&bold=true" },
  { name: "Amine Toure", roleFr: "Lead IA & Data Science", roleEn: "Lead AI & Data Science", bioFr: "Docteur en machine learning, Amine pilote les projets d'intelligence artificielle et développe nos solutions prédictives.", bioEn: "PhD in machine learning, Amine leads AI projects and develops our predictive solutions.", avatar: "https://ui-avatars.com/api/?name=Amine+Toure&background=FFC107&color=0B1F3A&size=200&bold=true" },
  { name: "Sophie Nguyen", roleFr: "Head of Design & UX", roleEn: "Head of Design & UX", bioFr: "Designer product avec 8 ans d'expérience, Sophie garantit que chaque interface est intuitive, accessible et esthétiquement irréprochable.", bioEn: "Product designer with 8 years of experience, Sophie ensures every interface is intuitive, accessible and aesthetically flawless.", avatar: "https://ui-avatars.com/api/?name=Sophie+Nguyen&background=0B1F3A&color=FFC107&size=200&bold=true" },
];

const defaultWhyPoints = [
  { icon: "Award", titleFr: "Expertise reconnue", titleEn: "Recognized expertise", descFr: "Une équipe de développeurs seniors, des certifications internationales et la même exigence de qualité sur chaque projet.", descEn: "A team of senior developers, international certifications and the same quality bar on every project." },
  { icon: "Zap", titleFr: "Livraison rapide", titleEn: "Fast delivery", descFr: "Méthodologie agile garantissant des livraisons itératives rapides et conformes à vos objectifs.", descEn: "Agile methodology ensuring fast, iterative deliveries aligned with your objectives." },
  { icon: "Shield", titleFr: "Qualité garantie", titleEn: "Quality guaranteed", descFr: "Code testé, documenté et maintenu selon les meilleures pratiques de l'industrie.", descEn: "Tested, documented and maintained code following industry best practices." },
  { icon: "Globe", titleFr: "Vision internationale", titleEn: "International vision", descFr: "Une équipe multilingue et multiculturelle capable d'accompagner vos projets à l'échelle mondiale.", descEn: "A multilingual and multicultural team capable of supporting your projects on a global scale." },
  { icon: "TrendingUp", titleFr: "Solutions scalables", titleEn: "Scalable solutions", descFr: "Des architectures conçues pour évoluer avec votre croissance, sans jamais limiter votre expansion.", descEn: "Architectures designed to grow with your business, never limiting your expansion." },
  { icon: "Heart", titleFr: "Support dédié", titleEn: "Dedicated support", descFr: "Un accompagnement continu et un support technique disponible pour garantir la pérennité de vos services.", descEn: "Continuous support and technical assistance available to ensure the longevity of your services." },
];

function DynIcon({ name, size = 22, className = "" }: { name: string; size?: number; className?: string }) {
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];
  if (!IconComp) return <Award size={size} className={className} />;
  return <IconComp size={size} className={className} />;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("about");
  const isEn = locale === "en";

  const [dbTeam, dbTimeline, dbWhyPoints, settings, stats] = await Promise.all([
    prisma.teamMember.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.aboutTimeline.findMany({ orderBy: { order: "asc" } }),
    prisma.whyPoint.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.siteSettings.findMany({ where: { key: { in: ["about_story_fr", "about_story_en"] } } }),
    getSiteStats(),
  ]);

  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const timeline = dbTimeline.length > 0 ? dbTimeline : defaultTimeline;
  const teamMembers = dbTeam.length > 0 ? dbTeam : defaultTeam;
  const whyPoints = dbWhyPoints.length > 0 ? dbWhyPoints : defaultWhyPoints;
  const storyFr = settingsMap["about_story_fr"] || "Née en 2024, Kelenix accompagne des PME, des startups et de grandes organisations qui veulent tirer parti de la technologie pour croître et innover.";
  const storyEn = settingsMap["about_story_en"] || "Born in 2024, Kelenix supports SMEs, startups and large organisations that want to leverage technology to grow and innovate.";

  const figures = [
    { value: stats.projects, label: isEn ? "Projects delivered" : "Projets livrés" },
    { value: stats.clients, label: isEn ? "Clients" : "Clients" },
    { value: stats.founded, label: isEn ? "Year founded" : "Année de création" },
    { value: stats.satisfaction, label: "Satisfaction" },
    { value: stats.team, label: isEn ? "Team members" : "Experts dans l'équipe" },
    { value: stats.countries, label: isEn ? "Countries" : "Pays" },
    { value: stats.rating, label: isEn ? "Client rating" : "Note clients" },
    { value: stats.response, label: isEn ? "Response time" : "Délai de réponse" },
  ];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      {/* Histoire + chiffres */}
      <section className={`bg-white ${section}`}>
        <div className={`${container} grid gap-10 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <h2 className={h2}>{isEn ? "Born from a passion for technology" : "Née d'une passion pour la technologie"}</h2>
            <div className={`mt-6 space-y-4 ${body}`}>
              <p>{t("story")}</p>
              <p>{isEn ? storyEn : storyFr}</p>
              <p>
                {isEn
                  ? "Today, Kelenix is a reference in software development, artificial intelligence and digital transformation, serving SMEs, startups and large companies."
                  : "Aujourd'hui, Kelenix est une référence dans le développement logiciel, l'intelligence artificielle et la transformation numérique, servant PME, startups et grandes entreprises."}
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 self-start overflow-hidden rounded-3xl border border-line">
            {figures.map((figure, i) => (
              <div key={figure.label} className={`flex flex-col-reverse border-line p-5 sm:p-7 ${i % 2 === 0 ? "border-r" : ""} ${i < figures.length - 2 ? "border-b" : ""}`}>
                <dt className="mt-1.5 text-sm text-muted">{figure.label}</dt>
                <dd className="font-display text-4xl font-medium leading-none tracking-[-0.03em] tabular-nums text-navy sm:text-5xl">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Mission, vision, valeurs */}
      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <h2 className={`mb-10 sm:mb-14 ${h2}`}>{isEn ? "Our fundamentals" : "Nos fondamentaux"}</h2>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            <div className={`p-6 sm:p-8 ${card}`}>
              <span className={`mb-5 ${iconTile}`}>
                <Target size={22} />
              </span>
              <h3 className="text-xl font-semibold text-navy">{t("mission.title")}</h3>
              <p className={`mt-3 ${body}`}>{t("mission.description")}</p>
            </div>
            <div className={`p-6 sm:p-8 ${card}`}>
              <span className={`mb-5 ${iconTile}`}>
                <Eye size={22} />
              </span>
              <h3 className="text-xl font-semibold text-navy">{t("vision.title")}</h3>
              <p className={`mt-3 ${body}`}>{t("vision.description")}</p>
            </div>
            <div className="rounded-3xl bg-linear-to-br from-azure to-[#1580EE] p-6 text-white sm:p-8">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/18">
                <Lightbulb size={22} />
              </span>
              <h3 className="text-xl font-semibold">{t("values.title")}</h3>
              <ul className="mt-4 space-y-2.5">
                {(["innovation", "excellence", "reliability", "accessibility", "impact", "ambition"] as const).map((v) => (
                  <li key={v} className="flex items-center gap-2.5 text-[15px] text-white/95">
                    <Check size={16} strokeWidth={3} className="shrink-0" />
                    {t(`values.${v}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section className={`bg-white ${section}`}>
        <div className={`${container} grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20`}>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={h2}>{t("timeline.title")}</h2>
            <p className={`mt-4 ${lead}`}>{t("timeline.subtitle")}</p>
          </div>
          <ol className="border-t border-line">
            {timeline.map((item) => (
              <li key={item.year} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-8">
                <span className="font-display text-3xl font-medium leading-none tracking-[-0.03em] text-azure sm:text-4xl">{item.year}</span>
                <div>
                  <h3 className="text-xl font-semibold text-navy">{isEn ? item.titleEn : item.titleFr}</h3>
                  <p className={`mt-2 ${body}`}>{isEn ? item.descEn : item.descFr}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Équipe */}
      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <div className="mb-10 max-w-2xl sm:mb-14">
            <h2 className={h2}>{t("team.title")}</h2>
            <p className={`mt-4 ${lead}`}>{t("team.subtitle")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className={`flex gap-4 p-5 sm:block sm:p-7 ${card}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- photo saisie dans l'admin : domaine libre, hors remotePatterns */}
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0B1F3A&color=2FA8FF&size=200&bold=true`}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:mb-5 sm:h-20 sm:w-20"
                />
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-navy">{member.name}</h3>
                  <p className="mt-0.5 text-sm font-medium text-azure">{isEn ? member.roleEn : member.roleFr}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{isEn ? member.bioEn : member.bioFr}</p>
                  {"linkedin" in member && member.linkedin && (
                    <a href={member.linkedin as string} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-navy underline decoration-line decoration-2 underline-offset-4 hover:decoration-azure">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous */}
      <section className={`bg-white ${section}`}>
        <div className={container}>
          <h2 className={`mb-10 max-w-3xl sm:mb-14 ${h2}`}>
            {isEn ? `${whyPoints.length} reasons to trust Kelenix` : `${whyPoints.length} raisons de nous faire confiance`}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {whyPoints.map((point) => (
              <div key={point.titleFr} className={`flex gap-4 p-5 sm:p-7 ${card}`}>
                <span className={iconTile}>
                  <DynIcon name={point.icon} size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-navy">{isEn ? point.titleEn : point.titleFr}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{isEn ? point.descEn : point.descFr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={isEn ? "Ready to work with us?" : "Prêt à travailler avec nous ?"}
        text={
          isEn
            ? "Let's discuss your project and see how Kelenix can help you achieve your goals."
            : "Parlons de votre projet et voyons comment Kelenix peut vous aider à atteindre vos objectifs."
        }
        primary={{ href: "/devis", label: isEn ? "Get a free quote" : "Obtenir un devis gratuit" }}
        secondary={{ href: "/contact", label: isEn ? "Contact us" : "Nous contacter" }}
      />
    </>
  );
}
