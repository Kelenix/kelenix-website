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
  ArrowRight,
  CheckCircle,
  Layers,
  Cpu,
  Wrench,
  Database,
  Cloud,
  ShieldCheck,
} from "lucide-react";

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
  return <Icon size={28} className="text-sky" />;
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

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("services");
  const isEn = locale === "en";

  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
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
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: { slug: string; image: string | null; icon: string; titleFr: string; titleEn: string; shortDescFr: string; shortDescEn: string }) => (
                <Link
                  key={service.slug}
                  href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
                  className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-sky/20 overflow-hidden"
                >
                  {service.image && (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={service.image}
                        alt={isEn ? service.titleEn : service.titleFr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="w-14 h-14 bg-sky/10 rounded-2xl flex items-center justify-center mb-5">
                      <ServiceIcon name={service.icon} />
                    </div>
                    <h2 className="font-heading font-bold text-navy text-xl mb-3 group-hover:text-sky transition-colors">
                      {isEn ? service.titleEn : service.titleFr}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      {isEn ? service.shortDescEn : service.shortDescFr}
                    </p>
                    <div className="flex items-center gap-2 text-sky text-sm font-semibold">
                      {t("learnMore")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(
                [
                  { key: "software", icon: "Code", slug: "developpement-logiciel" },
                  { key: "web", icon: "Globe", slug: "creation-sites-web" },
                  { key: "webapp", icon: "Monitor", slug: "applications-web" },
                  { key: "mobile", icon: "Smartphone", slug: "applications-mobiles" },
                  { key: "ai", icon: "Brain", slug: "intelligence-artificielle" },
                  { key: "consulting", icon: "TrendingUp", slug: "consulting-informatique" },
                  { key: "training", icon: "GraduationCap", slug: "formation-programmation" },
                ] as const
              ).map((svc) => (
                <Link
                  key={svc.key}
                  href={{ pathname: "/services/[slug]", params: { slug: svc.slug } }}
                  className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-sky/20 p-7"
                >
                  <div className="w-14 h-14 bg-sky/10 rounded-2xl flex items-center justify-center mb-5">
                    <ServiceIcon name={svc.icon} />
                  </div>
                  <h2 className="font-heading font-bold text-navy text-lg mb-3 group-hover:text-sky transition-colors">
                    {t(`items.${svc.key}.title`)}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {t(`items.${svc.key}.description`)}
                  </p>
                  <div className="flex items-center gap-2 text-sky text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("learnMore")} <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              {isEn ? "Our " : "Notre "}<span className="text-sky">{isEn ? "process" : "processus"}</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {isEn
                ? "A proven methodology to deliver quality projects on time."
                : "Une méthodologie éprouvée pour livrer des projets de qualité dans les délais."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-card text-center border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-sky to-navy rounded-full flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-5 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-3">{isEn ? step.stepEn : step.stepFr}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{isEn ? step.descEn : step.descFr}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight size={20} className="text-sky" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-6">
                {isEn ? "Why choose " : "Pourquoi choisir "}<span className="text-sky">Kelenix</span>
                {isEn ? " for your project?" : " pour votre projet ?"}
              </h2>
              <div className="space-y-4">
                {[
                  isEn ? "Senior team with 5+ years of experience" : "Équipe senior avec 5+ ans d'expérience",
                  isEn ? "Delivery on time and within budget" : "Livraison dans les délais et le budget",
                  isEn ? "Transparent communication throughout the project" : "Communication transparente tout au long du projet",
                  isEn ? "Ongoing maintenance and dedicated support" : "Maintenance continue et support dédié",
                  isEn ? "Proprietary code, delivered with documentation" : "Code propriétaire, livré avec documentation",
                  isEn ? "Scalable solutions adapted to your growth" : "Solutions évolutives adaptées à votre croissance",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-sky shrink-0 mt-0.5" />
                    <span className="text-gray-600">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="font-heading text-2xl font-extrabold text-white mb-4">
                {isEn ? "Ready to get started?" : "Prêt à démarrer ?"}
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {isEn
                  ? "Get a personalized, commitment-free quote in less than 48 hours."
                  : "Obtenez un devis personnalisé et sans engagement en moins de 48h."}
              </p>
              <Link
                href="/devis"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors duration-200 text-lg"
              >
                {isEn ? "Request a free quote" : "Demander un devis gratuit"} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
