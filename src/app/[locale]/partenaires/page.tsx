import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  TrendingUp,
  Globe,
  Handshake,
  Users,
  Zap,
  Award,
  ArrowRight,
} from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { btnPrimary, card, container, h2, iconTile, lead, section } from "@/components/site/styles";
import PartnerForm from "./PartnerForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Partners Program" : "Programme Partenaires",
    description: isEn
      ? "Join the Kelenix partner network. Grow your business with us through our strategic partnership program."
      : "Rejoignez le réseau de partenaires Kelenix. Développez votre activité avec nous grâce à notre programme de partenariat stratégique.",
  };
}

const benefits = [
  {
    icon: TrendingUp,
    titleFr: "Croissance accélérée",
    titleEn: "Accelerated growth",
    descFr: "Accédez à notre réseau de clients et de prospects pour booster votre activité et augmenter votre chiffre d'affaires.",
    descEn: "Access our network of clients and prospects to boost your business and increase your revenue.",
  },
  {
    icon: Award,
    titleFr: "Certification officielle",
    titleEn: "Official certification",
    descFr: "Obtenez une certification partenaire Kelenix reconnue qui renforce votre crédibilité auprès de vos clients.",
    descEn: "Earn a recognized Kelenix partner certification that enhances your credibility with clients.",
  },
  {
    icon: Users,
    titleFr: "Support dédié",
    titleEn: "Dedicated support",
    descFr: "Un responsable partenaire dédié pour vous accompagner, répondre à vos questions et vous aider à réussir.",
    descEn: "A dedicated partner manager to support you, answer your questions and help you succeed.",
  },
  {
    icon: Globe,
    titleFr: "Co-marketing",
    titleEn: "Co-marketing",
    descFr: "Bénéficiez d'actions marketing communes — articles de blog, webinaires, études de cas et visibilité sur notre site.",
    descEn: "Benefit from joint marketing activities — blog posts, webinars, case studies and visibility on our website.",
  },
  {
    icon: Zap,
    titleFr: "Accès prioritaire",
    titleEn: "Priority access",
    descFr: "Accès en avant-première à nos nouvelles solutions, bêtas et innovations pour rester en avance sur votre marché.",
    descEn: "Early access to our new solutions, betas and innovations to stay ahead in your market.",
  },
  {
    icon: Handshake,
    titleFr: "Revenus partagés",
    titleEn: "Revenue sharing",
    descFr: "Un programme de commissions attractif pour chaque client ou projet apporté à travers le réseau partenaire.",
    descEn: "An attractive commission program for every client or project brought through the partner network.",
  },
];

const partnerLogos = [
  { name: "TechCorp" },
  { name: "CloudBase" },
  { name: "DataSync" },
  { name: "NexaDigital" },
  { name: "SmartAI" },
  { name: "BuildSoft" },
  { name: "AgileTeams" },
  { name: "DevPulse" },
];

const partnerTypes = [
  { valueFr: "Revendeur", valueEn: "Reseller" },
  { valueFr: "Intégrateur", valueEn: "Integrator" },
  { valueFr: "Consultant", valueEn: "Consultant" },
  { valueFr: "Éditeur logiciel", valueEn: "Software editor" },
  { valueFr: "Agence digitale", valueEn: "Digital agency" },
  { valueFr: "Autre", valueEn: "Other" },
];

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  const isEn = locale === "en";

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")}>
        <a href="#partner-form" className={`group ${btnPrimary}`}>
          {isEn ? "Become a partner" : "Devenir partenaire"}
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </a>
      </PageHero>

      {/* Avantages */}
      <section className={`bg-white ${section}`}>
        <div className={container}>
          <div className="mb-10 max-w-2xl sm:mb-14">
            <h2 className={h2}>{t("benefits.title")}</h2>
            <p className={`mt-4 ${lead}`}>
              {isEn
                ? "As a Kelenix partner, you benefit from an ecosystem designed to help you grow and deliver more value to your clients."
                : "En tant que partenaire Kelenix, vous bénéficiez d'un écosystème conçu pour vous aider à croître et à apporter plus de valeur à vos clients."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.titleFr} className={`flex gap-4 p-5 sm:block sm:p-7 ${card}`}>
                <span className={`sm:mb-5 ${iconTile}`}>
                  <benefit.icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-navy sm:text-xl">{isEn ? benefit.titleEn : benefit.titleFr}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted sm:mt-2">{isEn ? benefit.descEn : benefit.descFr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires technologiques */}
      <section className="border-y border-line bg-mist py-12 sm:py-16">
        <div className={container}>
          <h2 className="mb-6 text-center text-sm font-semibold text-muted sm:mb-8">{isEn ? "Our technology partners" : "Nos partenaires technologiques"}</h2>
          <ul className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {partnerLogos.map((logo) => (
              <li key={logo.name} className="rounded-full border border-line bg-white px-5 py-2.5 text-[15px] font-semibold text-navy">
                {logo.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Demande de partenariat */}
      <section id="partner-form" className={`scroll-mt-20 bg-white ${section}`}>
        <div className="container mx-auto max-w-3xl px-4 sm:px-5">
          <div className="mb-8 sm:mb-10">
            <h2 className={h2}>{isEn ? "Submit a partnership request" : "Soumettre une demande de partenariat"}</h2>
            <p className={`mt-4 ${lead}`}>
              {isEn
                ? "Fill in the form below and our partner team will contact you within 48 hours."
                : "Remplissez le formulaire ci-dessous et notre équipe partenaires vous contactera sous 48h."}
            </p>
          </div>
          <div className={`p-5 sm:p-8 lg:p-10 ${card}`}>
            <PartnerForm locale={locale} partnerTypes={partnerTypes} />
          </div>
        </div>
      </section>
    </>
  );
}
