import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import {
  Target,
  Eye,
  Heart,
  CheckCircle,
  Users,
  Award,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Clock,
  Star,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "About Kelenix" : "À propos de Kelenix",
    description: isEn
      ? "Discover Kelenix's story, mission, vision, values and team. A technology company committed to your digital transformation."
      : "Découvrez l'histoire, la mission, la vision, les valeurs et l'équipe de Kelenix. Une entreprise technologique engagée dans votre transformation numérique.",
    openGraph: {
      images: [{ url: "/og-about.jpg" }],
    },
  };
}

const timeline = [
  {
    year: "2019",
    titleFr: "Fondation",
    titleEn: "Foundation",
    descFr: "Kelenix est fondée à Paris par une équipe de développeurs passionnés avec la vision de démocratiser la technologie.",
    descEn: "Kelenix is founded in Paris by a team of passionate developers with the vision of democratizing technology.",
  },
  {
    year: "2020",
    titleFr: "Premiers projets",
    titleEn: "First projects",
    descFr: "Livraison des 20 premiers projets clients incluant applications web et mobiles pour des PME françaises.",
    descEn: "Delivery of the first 20 client projects including web and mobile applications for French SMEs.",
  },
  {
    year: "2021",
    titleFr: "Expansion",
    titleEn: "Expansion",
    descFr: "Croissance de l'équipe à 15 membres, ouverture de nouveaux marchés en Afrique francophone.",
    descEn: "Team growth to 15 members, opening of new markets in French-speaking Africa.",
  },
  {
    year: "2022",
    titleFr: "Innovation IA",
    titleEn: "AI Innovation",
    descFr: "Lancement du département Intelligence Artificielle et livraison des premières solutions ML à grande échelle.",
    descEn: "Launch of the Artificial Intelligence department and delivery of the first large-scale ML solutions.",
  },
  {
    year: "2023",
    titleFr: "International",
    titleEn: "International",
    descFr: "Expansion vers l'Europe et le Moyen-Orient, 80+ clients actifs, certifications AWS et Google Cloud.",
    descEn: "Expansion into Europe and the Middle East, 80+ active clients, AWS and Google Cloud certifications.",
  },
  {
    year: "2024",
    titleFr: "Leader régional",
    titleEn: "Regional leader",
    descFr: "Kelenix s'impose comme leader de la transformation numérique avec 150+ projets livrés et 98% de satisfaction.",
    descEn: "Kelenix establishes itself as a digital transformation leader with 150+ projects delivered and 98% satisfaction.",
  },
];

const teamMembers = [
  {
    name: "Kévin Assou",
    roleFr: "CEO & Fondateur",
    roleEn: "CEO & Founder",
    bioFr: "Ingénieur en informatique avec 10 ans d'expérience, Kévin a fondé Kelenix avec la conviction que la technologie doit être au service de tous.",
    bioEn: "Computer engineer with 10 years of experience, Kevin founded Kelenix with the conviction that technology must serve everyone.",
    avatar: "https://ui-avatars.com/api/?name=Kevin+Assou&background=0B1F3A&color=2FA8FF&size=200&bold=true",
  },
  {
    name: "Léa Martineau",
    roleFr: "CTO — Architecte Logiciel",
    roleEn: "CTO — Software Architect",
    bioFr: "Spécialiste en architecture cloud et systèmes distribués, Léa dirige les choix technologiques et la R&D de Kelenix.",
    bioEn: "Specialist in cloud architecture and distributed systems, Léa leads technology choices and Kelenix's R&D.",
    avatar: "https://ui-avatars.com/api/?name=Lea+Martineau&background=2FA8FF&color=ffffff&size=200&bold=true",
  },
  {
    name: "Amine Toure",
    roleFr: "Lead IA & Data Science",
    roleEn: "Lead AI & Data Science",
    bioFr: "Docteur en machine learning, Amine pilote les projets d'intelligence artificielle et développe nos solutions prédictives.",
    bioEn: "PhD in machine learning, Amine leads AI projects and develops our predictive solutions.",
    avatar: "https://ui-avatars.com/api/?name=Amine+Toure&background=FFC107&color=0B1F3A&size=200&bold=true",
  },
  {
    name: "Sophie Nguyen",
    roleFr: "Head of Design & UX",
    roleEn: "Head of Design & UX",
    bioFr: "Designer product avec 8 ans d'expérience, Sophie garantit que chaque interface est intuitive, accessible et esthétiquement irréprochable.",
    bioEn: "Product designer with 8 years of experience, Sophie ensures every interface is intuitive, accessible and aesthetically flawless.",
    avatar: "https://ui-avatars.com/api/?name=Sophie+Nguyen&background=0B1F3A&color=FFC107&size=200&bold=true",
  },
];

const whyPoints = [
  {
    icon: Award,
    titleFr: "Expertise reconnue",
    titleEn: "Recognized expertise",
    descFr: "Plus de 5 ans d'expérience, des certifications internationales et une équipe de développeurs seniors.",
    descEn: "Over 5 years of experience, international certifications and a team of senior developers.",
  },
  {
    icon: Zap,
    titleFr: "Livraison rapide",
    titleEn: "Fast delivery",
    descFr: "Méthodologie agile garantissant des livraisons itératives rapides et conformes à vos objectifs.",
    descEn: "Agile methodology ensuring fast, iterative deliveries aligned with your objectives.",
  },
  {
    icon: Shield,
    titleFr: "Qualité garantie",
    titleEn: "Quality guaranteed",
    descFr: "Code testé, documenté et maintenu selon les meilleures pratiques de l'industrie.",
    descEn: "Tested, documented and maintained code following industry best practices.",
  },
  {
    icon: Globe,
    titleFr: "Vision internationale",
    titleEn: "International vision",
    descFr: "Une équipe multilingue et multiculturelle capable d'accompagner vos projets à l'échelle mondiale.",
    descEn: "A multilingual and multicultural team capable of supporting your projects on a global scale.",
  },
  {
    icon: TrendingUp,
    titleFr: "Solutions scalables",
    titleEn: "Scalable solutions",
    descFr: "Des architectures conçues pour évoluer avec votre croissance, sans jamais limiter votre expansion.",
    descEn: "Architectures designed to grow with your business, never limiting your expansion.",
  },
  {
    icon: Heart,
    titleFr: "Support dédié",
    titleEn: "Dedicated support",
    descFr: "Un accompagnement continu et un support technique disponible pour garantir la pérennité de vos services.",
    descEn: "Continuous support and technical assistance available to ensure the longevity of your services.",
  },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("about");
  const tCommon = await getTranslations("common");
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
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {isEn ? "Our story" : "Notre histoire"}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-6">
                {isEn ? "Born from a passion for" : "Née d'une passion pour"}{" "}
                <span className="text-sky">{isEn ? "technology" : "la technologie"}</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t("story")}</p>
                <p>
                  {isEn
                    ? "From a small team of 3 passionate engineers, we have grown to become a 20+ person company, delivering complex projects for clients across 3 continents. Our growth is driven by a simple principle: put the client's success at the center of everything we do."
                    : "Partis d'une petite équipe de 3 ingénieurs passionnés, nous sommes devenus une entreprise de plus de 20 personnes, livrant des projets complexes pour des clients sur 3 continents. Notre croissance est portée par un principe simple : placer le succès du client au centre de tout ce que nous faisons."}
                </p>
                <p>
                  {isEn
                    ? "Today, Kelenix is a reference in software development, artificial intelligence and digital transformation, serving SMEs, startups and large companies."
                    : "Aujourd'hui, Kelenix est une référence dans le développement logiciel, l'intelligence artificielle et la transformation numérique, servant PME, startups et grandes entreprises."}
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { value: "150+", label: isEn ? "Projects" : "Projets" },
                  { value: "80+", label: isEn ? "Clients" : "Clients" },
                  { value: "98%", label: isEn ? "Satisfaction" : "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-neutral-light rounded-2xl">
                    <div className="text-3xl font-extrabold text-sky mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-navy to-sky/40 rounded-3xl p-1 shadow-2xl">
                <div className="bg-navy rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Users, label: isEn ? "Expert team" : "Équipe d'experts", value: "20+" },
                      { icon: Globe, label: isEn ? "Countries" : "Pays", value: "3" },
                      { icon: Star, label: isEn ? "Client rating" : "Note clients", value: "4.9/5" },
                      { icon: Clock, label: isEn ? "Response time" : "Délai réponse", value: "< 24h" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                        <item.icon size={28} className="text-sky mx-auto mb-2" />
                        <div className="text-2xl font-extrabold text-white mb-1">{item.value}</div>
                        <div className="text-xs text-gray-400">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              {isEn ? "Our " : "Nos "}<span className="text-sky">{isEn ? "fundamentals" : "fondamentaux"}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy rounded-2xl p-8 text-white shadow-card">
              <div className="w-12 h-12 bg-sky/20 rounded-xl flex items-center justify-center mb-6">
                <Target size={24} className="text-sky" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-4">{t("mission.title")}</h3>
              <p className="text-gray-300 leading-relaxed">{t("mission.description")}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                <Eye size={24} className="text-gold" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-4">{t("vision.title")}</h3>
              <p className="text-gray-600 leading-relaxed">{t("vision.description")}</p>
            </div>
            <div className="bg-sky rounded-2xl p-8 text-white shadow-card">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb size={24} className="text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-4">{t("values.title")}</h3>
              <ul className="space-y-2">
                {(["innovation", "excellence", "reliability", "accessibility", "impact", "ambition"] as const).map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle size={14} className="text-white shrink-0" />
                    {t(`values.${v}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {t("timeline.title")}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              {t("timeline.subtitle")}
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky via-sky/50 to-transparent hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-card border border-gray-100 inline-block max-w-sm ${i % 2 === 0 ? "md:ml-auto" : ""}`}>
                      <h3 className="font-heading text-lg font-bold text-navy mb-2">
                        {isEn ? item.titleEn : item.titleFr}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isEn ? item.descEn : item.descFr}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky to-navy rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-lg border-4 border-white">
                      {item.year.slice(2)}
                    </div>
                    <span className="mt-1 text-xs font-bold text-sky">{item.year}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {t("team.title")}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              {t("team.subtitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-navy to-sky/30 flex items-center justify-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-28 h-28 rounded-full border-4 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-navy text-lg mb-1">{member.name}</h3>
                  <p className="text-sky text-sm font-semibold mb-3">{isEn ? member.roleEn : member.roleFr}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{isEn ? member.bioEn : member.bioFr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {isEn ? "Why choose us?" : "Pourquoi nous choisir ?"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              {isEn ? "6 reasons to trust" : "6 raisons de nous faire confiance"}{" "}
              <span className="text-sky">Kelenix</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyPoints.map((point) => (
              <div key={point.titleFr} className="flex gap-4 p-6 bg-neutral-light rounded-2xl border border-gray-100 hover:border-sky/30 transition-colors">
                <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center shrink-0">
                  <point.icon size={22} className="text-sky" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-navy mb-2">{isEn ? point.titleEn : point.titleFr}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{isEn ? point.descEn : point.descFr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {isEn ? "Ready to work with us?" : "Prêt à travailler avec nous ?"}
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {isEn
              ? "Let's discuss your project and see how Kelenix can help you achieve your goals."
              : "Parlons de votre projet et voyons comment Kelenix peut vous aider à atteindre vos objectifs."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors duration-200"
            >
              {isEn ? "Get a free quote" : "Obtenir un devis gratuit"} <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors duration-200"
            >
              {isEn ? "Contact us" : "Nous contacter"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
