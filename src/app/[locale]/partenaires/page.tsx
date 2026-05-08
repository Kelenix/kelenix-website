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
  { name: "TechCorp", bg: "bg-blue-50", text: "text-blue-600" },
  { name: "CloudBase", bg: "bg-purple-50", text: "text-purple-600" },
  { name: "DataSync", bg: "bg-green-50", text: "text-green-600" },
  { name: "NexaDigital", bg: "bg-orange-50", text: "text-orange-600" },
  { name: "SmartAI", bg: "bg-sky/10", text: "text-sky" },
  { name: "BuildSoft", bg: "bg-red-50", text: "text-red-500" },
  { name: "AgileTeams", bg: "bg-yellow-50", text: "text-yellow-600" },
  { name: "DevPulse", bg: "bg-indigo-50", text: "text-indigo-600" },
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
          <div className="mt-8">
            <a
              href="#partner-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              {isEn ? "Become a partner" : "Devenir partenaire"} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-4">
              {t("benefits.title")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {isEn
                ? "As a Kelenix partner, you benefit from an ecosystem designed to help you grow and deliver more value to your clients."
                : "En tant que partenaire Kelenix, vous bénéficiez d'un écosystème conçu pour vous aider à croître et à apporter plus de valeur à vos clients."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.titleFr}
                className="bg-neutral-light rounded-2xl p-8 border border-gray-100 hover:border-sky/30 transition-colors group"
              >
                <div className="w-14 h-14 bg-sky/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky/20 transition-colors">
                  <benefit.icon size={26} className="text-sky" />
                </div>
                <h3 className="font-heading font-bold text-navy text-xl mb-3">
                  {isEn ? benefit.titleEn : benefit.titleFr}
                </h3>
                <p className="text-gray-500 leading-relaxed">{isEn ? benefit.descEn : benefit.descFr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-extrabold text-navy mb-4">
              {isEn ? "Our technology partners" : "Nos partenaires technologiques"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {partnerLogos.map((logo) => (
              <div
                key={logo.name}
                className={`${logo.bg} rounded-2xl p-4 flex items-center justify-center h-16 border border-gray-100`}
              >
                <span className={`font-heading font-extrabold text-sm ${logo.text}`}>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner-form" className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-4">
              {isEn ? "Submit a partnership request" : "Soumettre une demande de partenariat"}
            </h2>
            <p className="text-gray-500">
              {isEn
                ? "Fill in the form below and our partner team will contact you within 48 hours."
                : "Remplissez le formulaire ci-dessous et notre équipe partenaires vous contactera sous 48h."}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
            <PartnerForm locale={locale} partnerTypes={partnerTypes} />
          </div>
        </div>
      </section>
    </main>
  );
}
