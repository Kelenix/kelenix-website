import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import FaqAccordion from "./FaqAccordion";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "FAQ | Kelenix" : "FAQ | Kelenix",
    description: locale === "fr"
      ? "Trouvez les réponses à vos questions sur les services Kelenix."
      : "Find answers to your questions about Kelenix services.",
  };
}

const faqData = {
  services: {
    fr: [
      { q: "Quels types de projets développez-vous ?", a: "Nous développons tout type de projet numérique : sites web, applications web et mobile, logiciels sur mesure, solutions IA, et nous offrons également du consulting et de la formation." },
      { q: "Travaillez-vous avec des clients à l'international ?", a: "Oui, absolument. Nous travaillons avec des clients partout dans le monde. Nos équipes sont multilingues et nous utilisons les meilleures pratiques de travail à distance pour garantir une collaboration fluide." },
      { q: "Proposez-vous de la maintenance après livraison ?", a: "Oui, nous proposons des contrats de maintenance et de support post-livraison. Cela inclut les corrections de bugs, les mises à jour de sécurité, et les évolutions fonctionnelles." },
    ],
    en: [
      { q: "What types of projects do you develop?", a: "We develop all types of digital projects: websites, web and mobile applications, custom software, AI solutions, and we also offer consulting and training." },
      { q: "Do you work with international clients?", a: "Yes, absolutely. We work with clients worldwide. Our teams are multilingual and we use best remote working practices to ensure smooth collaboration." },
      { q: "Do you offer maintenance after delivery?", a: "Yes, we offer maintenance and post-delivery support contracts. This includes bug fixes, security updates, and feature enhancements." },
    ],
  },
  pricing: {
    fr: [
      { q: "Comment calculez-vous vos tarifs ?", a: "Nos tarifs dépendent de la complexité du projet, des technologies utilisées, et du volume de travail. Nous fournissons toujours un devis détaillé et transparent avant de commencer." },
      { q: "Proposez-vous des tarifs pour les startups ?", a: "Oui, nous avons des offres adaptées aux startups et PME en phase de lancement. Contactez-nous pour discuter de votre situation et trouver une solution qui correspond à votre budget." },
      { q: "Acceptez-vous le paiement en plusieurs fois ?", a: "Oui, nous proposons généralement un paiement en 3 tranches : 30% à la signature, 40% à mi-projet, et 30% à la livraison." },
    ],
    en: [
      { q: "How do you calculate your rates?", a: "Our rates depend on project complexity, technologies used, and volume of work. We always provide a detailed and transparent quote before starting." },
      { q: "Do you offer rates for startups?", a: "Yes, we have offers adapted to startups and SMEs in their launch phase. Contact us to discuss your situation and find a solution that fits your budget." },
      { q: "Do you accept installment payments?", a: "Yes, we generally propose payment in 3 installments: 30% at signing, 40% at mid-project, and 30% at delivery." },
    ],
  },
  process: {
    fr: [
      { q: "Comment se déroule un projet type ?", a: "Nos projets suivent 5 phases : 1) Analyse des besoins, 2) Design et architecture, 3) Développement itératif (sprints agiles), 4) Tests et validation, 5) Déploiement et formation." },
      { q: "Comment suivez-vous l'avancement du projet ?", a: "Nous utilisons des outils de gestion de projet collaboratifs (Jira, Notion, ou équivalent). Vous avez accès en temps réel à l'avancement. Des réunions hebdomadaires de suivi sont organisées." },
      { q: "Puis-je modifier les fonctionnalités en cours de développement ?", a: "Oui, nous travaillons en méthodologie agile, ce qui permet d'adapter les fonctionnalités en cours de route. Des changements majeurs peuvent affecter le délai et le budget, nous vous en informons toujours à l'avance." },
    ],
    en: [
      { q: "How does a typical project go?", a: "Our projects follow 5 phases: 1) Needs analysis, 2) Design and architecture, 3) Iterative development (agile sprints), 4) Testing and validation, 5) Deployment and training." },
      { q: "How do you track project progress?", a: "We use collaborative project management tools (Jira, Notion, or equivalent). You have real-time access to progress. Weekly follow-up meetings are organized." },
      { q: "Can I modify features during development?", a: "Yes, we work in agile methodology, which allows adapting features along the way. Major changes may affect timeline and budget, we always inform you in advance." },
    ],
  },
  delays: {
    fr: [
      { q: "Quels sont les délais moyens pour un site web ?", a: "Un site vitrine simple : 2-4 semaines. Un site avec fonctionnalités avancées (blog, e-commerce) : 4-8 semaines. Un site complexe sur mesure : 8-16 semaines." },
      { q: "Quels sont les délais pour une application mobile ?", a: "Une application mobile simple : 2-3 mois. Une application avec backend et fonctionnalités complexes : 4-8 mois. Ces délais incluent les phases de design, développement, et tests." },
    ],
    en: [
      { q: "What are the average timelines for a website?", a: "Simple showcase site: 2-4 weeks. Site with advanced features (blog, e-commerce): 4-8 weeks. Complex custom site: 8-16 weeks." },
      { q: "What are the timelines for a mobile application?", a: "Simple mobile application: 2-3 months. Application with backend and complex features: 4-8 months. These timelines include design, development, and testing phases." },
    ],
  },
  support: {
    fr: [
      { q: "Comment puis-je contacter votre support ?", a: "Notre support est disponible par email, téléphone, et WhatsApp. En cas d'urgence (bug critique en production), nous garantissons une réponse en moins de 4 heures." },
      { q: "Proposez-vous de la formation à l'utilisation des solutions ?", a: "Oui, toutes nos livraisons incluent une session de formation pour vos équipes. Nous fournissons également une documentation complète et des tutoriels vidéo pour les fonctionnalités clés." },
    ],
    en: [
      { q: "How can I contact your support?", a: "Our support is available by email, phone, and WhatsApp. In case of emergency (critical production bug), we guarantee a response within 4 hours." },
      { q: "Do you offer training on how to use your solutions?", a: "Yes, all our deliveries include a training session for your teams. We also provide complete documentation and video tutorials for key features." },
    ],
  },
};

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const categories = [
    { key: "services", label: t("categories.services") },
    { key: "pricing", label: t("categories.pricing") },
    { key: "process", label: t("categories.process") },
    { key: "delays", label: t("categories.delays") },
    { key: "support", label: t("categories.support") },
  ];

  const faqByCategory = categories.map(cat => ({
    ...cat,
    items: (faqData[cat.key as keyof typeof faqData] as Record<string, { q: string; a: string }[]>)[locale as "fr" | "en"],
  }));

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          <FaqAccordion categories={faqByCategory} locale={locale} />

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-navy rounded-3xl p-10">
            <MessageCircle size={40} className="text-sky mx-auto mb-4" />
            <p className="text-white font-medium text-lg mb-2">{t("contactUs")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky text-white rounded-xl font-semibold text-sm hover:bg-sky-dark transition-colors mt-4"
            >
              {t("contactLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
