export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import {
  Code,
  Globe,
  Monitor,
  Smartphone,
  Brain,
  TrendingUp,
  GraduationCap,
  ArrowUpRight,
  Check,
  Layers,
  Cpu,
  Wrench,
  Database,
  Cloud,
  ShieldCheck,
} from "lucide-react";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { body, card, container, h2, iconTile, lead, section } from "@/components/site/styles";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Our Services" : "Nos Services",
    description: isEn
      ? "Discover all Kelenix technology services: software development, AI, web & mobile apps, IT consulting and tech training."
      : "Découvrez tous les services technologiques de Kelenix : développement logiciel, IA, applications web & mobile, consulting IT et formation tech.",
  };
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Globe,
  Monitor,
  Smartphone,
  Brain,
  TrendingUp,
  GraduationCap,
  Layers,
  Cpu,
  Wrench,
  Database,
  Cloud,
  ShieldCheck,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Code;
  return <Icon size={22} />;
}

const processSteps = [
  {
    stepFr: "Analyse",
    stepEn: "Analysis",
    descFr: "Nous étudions vos besoins en profondeur pour proposer la solution la plus adaptée.",
    descEn: "We study your needs in depth to propose the most suitable solution.",
  },
  {
    stepFr: "Conception",
    stepEn: "Design",
    descFr: "Architecture, design UX/UI et planification détaillée du projet.",
    descEn: "Architecture, UX/UI design and detailed project planning.",
  },
  {
    stepFr: "Développement",
    stepEn: "Development",
    descFr: "Développement agile avec livraisons régulières et feedback continu.",
    descEn: "Agile development with regular deliveries and continuous feedback.",
  },
  {
    stepFr: "Livraison",
    stepEn: "Delivery",
    descFr: "Tests rigoureux, déploiement et formation de vos équipes.",
    descEn: "Rigorous testing, deployment and training of your teams.",
  },
];

const fallbackServices = [
  { key: "software", icon: "Code", slug: "developpement-logiciel" },
  { key: "web", icon: "Globe", slug: "creation-sites-web" },
  { key: "webapp", icon: "Monitor", slug: "applications-web" },
  { key: "mobile", icon: "Smartphone", slug: "applications-mobiles" },
  { key: "ai", icon: "Brain", slug: "intelligence-artificielle" },
  { key: "consulting", icon: "TrendingUp", slug: "consulting-informatique" },
  { key: "training", icon: "GraduationCap", slug: "formation-programmation" },
] as const;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("services");
  const isEn = locale === "en";

  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  // Sans service en base : la liste par défaut des traductions.
  const cards = services.length
    ? services.map((s) => ({
        slug: s.slug,
        icon: s.icon,
        image: s.image,
        title: isEn ? s.titleEn : s.titleFr,
        text: isEn ? s.shortDescEn : s.shortDescFr,
      }))
    : fallbackServices.map((s) => ({
        slug: s.slug,
        icon: s.icon,
        image: null,
        title: t(`items.${s.key}.title`),
        text: t(`items.${s.key}.description`),
      }));

  const reasons = [
    isEn ? "Senior team with 5+ years of experience" : "Équipe senior avec 5+ ans d'expérience",
    isEn ? "Delivery on time and within budget" : "Livraison dans les délais et le budget",
    isEn ? "Transparent communication throughout the project" : "Communication transparente tout au long du projet",
    isEn ? "Ongoing maintenance and dedicated support" : "Maintenance continue et support dédié",
    isEn ? "Proprietary code, delivered with documentation" : "Code propriétaire, livré avec documentation",
    isEn ? "Scalable solutions adapted to your growth" : "Solutions évolutives adaptées à votre croissance",
  ];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((service) => (
              <Link
                key={service.slug}
                href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
                className={`group relative flex flex-col overflow-hidden transition-colors hover:border-sky/60 ${card}`}
              >
                {service.image && (
                  <div className="relative h-44 overflow-hidden bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element -- image saisie dans l'admin : domaine libre, hors remotePatterns */}
                    <img
                      src={service.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-5 flex items-start justify-between">
                    <span className={`transition-colors group-hover:bg-azure group-hover:text-white ${iconTile}`}>
                      <ServiceIcon name={service.icon} />
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition-colors group-hover:border-navy group-hover:bg-navy group-hover:text-white">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold leading-snug text-navy">{service.title}</h2>
                  <p className={`mt-2 ${body}`}>{service.text}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-azure">{t("learnMore")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`bg-white ${section}`}>
        <div className={container}>
          <div className="mb-10 max-w-2xl sm:mb-14">
            <h2 className={h2}>{isEn ? "Our process" : "Notre processus"}</h2>
            <p className={`mt-4 ${lead}`}>
              {isEn
                ? "A proven methodology to deliver quality projects on time."
                : "Une méthodologie éprouvée pour livrer des projets de qualité dans les délais."}
            </p>
          </div>
          <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.stepFr} className="border-t border-line pt-5">
                <span className="font-display text-4xl font-medium leading-none tracking-[-0.03em] text-azure">{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-navy">{isEn ? step.stepEn : step.stepFr}</h3>
                <p className={`mt-2 ${body}`}>{isEn ? step.descEn : step.descFr}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`bg-mist ${section}`}>
        <div className={`${container} grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}>
          <h2 className={h2}>{isEn ? "Why choose Kelenix for your project?" : "Pourquoi choisir Kelenix pour votre projet ?"}</h2>
          <ul className={`grid gap-x-8 sm:grid-cols-2 ${card} px-6 py-2 sm:px-8`}>
            {reasons.map((point) => (
              <li key={point} className="flex items-start gap-3 border-b border-line py-5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-azure text-white">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-[15px] font-medium leading-snug text-navy sm:text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={isEn ? "Ready to get started?" : "Prêt à démarrer ?"}
        text={
          isEn
            ? "Get a personalized, commitment-free quote in less than 48 hours."
            : "Obtenez un devis personnalisé et sans engagement en moins de 48 h."
        }
        primary={{ href: "/devis", label: isEn ? "Request a free quote" : "Demander un devis gratuit" }}
        secondary={{ href: "/contact", label: isEn ? "Contact us" : "Nous contacter" }}
      />
    </>
  );
}
