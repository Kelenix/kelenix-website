// Seed dédié FAQ générale — SÛR pour la production.
// Contrairement à `seed.ts`, ce script ne touche QUE la table `faqs` et
// n'insère que si elle est vide (préserve les questions ajoutées via l'admin).
// Lancer : npx tsx prisma/seed-faq.ts   (ou npm run db:seed-faq)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  { category: "services", questionFr: "Quels types de projets développez-vous ?", questionEn: "What types of projects do you develop?", answerFr: "Nous développons tout type de projet numérique : sites web, applications web et mobile, logiciels sur mesure, solutions IA, et nous offrons également du consulting et de la formation.", answerEn: "We develop all types of digital projects: websites, web and mobile applications, custom software, AI solutions, and we also offer consulting and training." },
  { category: "services", questionFr: "Travaillez-vous avec des clients à l'international ?", questionEn: "Do you work with international clients?", answerFr: "Oui, absolument. Nous travaillons avec des clients partout dans le monde. Nos équipes sont multilingues et nous utilisons les meilleures pratiques de travail à distance pour garantir une collaboration fluide.", answerEn: "Yes, absolutely. We work with clients worldwide. Our teams are multilingual and we use best remote working practices to ensure smooth collaboration." },
  { category: "services", questionFr: "Proposez-vous de la maintenance après livraison ?", questionEn: "Do you offer maintenance after delivery?", answerFr: "Oui, nous proposons des contrats de maintenance et de support post-livraison. Cela inclut les corrections de bugs, les mises à jour de sécurité, et les évolutions fonctionnelles.", answerEn: "Yes, we offer maintenance and post-delivery support contracts. This includes bug fixes, security updates, and feature enhancements." },
  { category: "pricing", questionFr: "Comment calculez-vous vos tarifs ?", questionEn: "How do you calculate your rates?", answerFr: "Nos tarifs dépendent de la complexité du projet, des technologies utilisées, et du volume de travail. Nous fournissons toujours un devis détaillé et transparent avant de commencer.", answerEn: "Our rates depend on project complexity, technologies used, and volume of work. We always provide a detailed and transparent quote before starting." },
  { category: "pricing", questionFr: "Proposez-vous des tarifs pour les startups ?", questionEn: "Do you offer rates for startups?", answerFr: "Oui, nous avons des offres adaptées aux startups et PME en phase de lancement. Contactez-nous pour discuter de votre situation et trouver une solution qui correspond à votre budget.", answerEn: "Yes, we have offers adapted to startups and SMEs in their launch phase. Contact us to discuss your situation and find a solution that fits your budget." },
  { category: "pricing", questionFr: "Acceptez-vous le paiement en plusieurs fois ?", questionEn: "Do you accept installment payments?", answerFr: "Oui, nous proposons généralement un paiement en 3 tranches : 30% à la signature, 40% à mi-projet, et 30% à la livraison.", answerEn: "Yes, we generally propose payment in 3 installments: 30% at signing, 40% at mid-project, and 30% at delivery." },
  { category: "process", questionFr: "Comment se déroule un projet type ?", questionEn: "How does a typical project go?", answerFr: "Nos projets suivent 5 phases : 1) Analyse des besoins, 2) Design et architecture, 3) Développement itératif (sprints agiles), 4) Tests et validation, 5) Déploiement et formation.", answerEn: "Our projects follow 5 phases: 1) Needs analysis, 2) Design and architecture, 3) Iterative development (agile sprints), 4) Testing and validation, 5) Deployment and training." },
  { category: "process", questionFr: "Comment suivez-vous l'avancement du projet ?", questionEn: "How do you track project progress?", answerFr: "Nous utilisons des outils de gestion de projet collaboratifs (Jira, Notion, ou équivalent). Vous avez accès en temps réel à l'avancement. Des réunions hebdomadaires de suivi sont organisées.", answerEn: "We use collaborative project management tools (Jira, Notion, or equivalent). You have real-time access to progress. Weekly follow-up meetings are organized." },
  { category: "process", questionFr: "Puis-je modifier les fonctionnalités en cours de développement ?", questionEn: "Can I modify features during development?", answerFr: "Oui, nous travaillons en méthodologie agile, ce qui permet d'adapter les fonctionnalités en cours de route. Des changements majeurs peuvent affecter le délai et le budget, nous vous en informons toujours à l'avance.", answerEn: "Yes, we work in agile methodology, which allows adapting features along the way. Major changes may affect timeline and budget, we always inform you in advance." },
  { category: "delays", questionFr: "Quels sont les délais moyens pour un site web ?", questionEn: "What are the average timelines for a website?", answerFr: "Un site vitrine simple : 2-4 semaines. Un site avec fonctionnalités avancées (blog, e-commerce) : 4-8 semaines. Un site complexe sur mesure : 8-16 semaines.", answerEn: "Simple showcase site: 2-4 weeks. Site with advanced features (blog, e-commerce): 4-8 weeks. Complex custom site: 8-16 weeks." },
  { category: "delays", questionFr: "Quels sont les délais pour une application mobile ?", questionEn: "What are the timelines for a mobile application?", answerFr: "Une application mobile simple : 2-3 mois. Une application avec backend et fonctionnalités complexes : 4-8 mois. Ces délais incluent les phases de design, développement, et tests.", answerEn: "Simple mobile application: 2-3 months. Application with backend and complex features: 4-8 months. These timelines include design, development, and testing phases." },
  { category: "support", questionFr: "Comment puis-je contacter votre support ?", questionEn: "How can I contact your support?", answerFr: "Notre support est disponible par email, téléphone, et WhatsApp. En cas d'urgence (bug critique en production), nous garantissons une réponse en moins de 4 heures.", answerEn: "Our support is available by email, phone, and WhatsApp. In case of emergency (critical production bug), we guarantee a response within 4 hours." },
  { category: "support", questionFr: "Proposez-vous de la formation à l'utilisation des solutions ?", questionEn: "Do you offer training on how to use your solutions?", answerFr: "Oui, toutes nos livraisons incluent une session de formation pour vos équipes. Nous fournissons également une documentation complète et des tutoriels vidéo pour les fonctionnalités clés.", answerEn: "Yes, all our deliveries include a training session for your teams. We also provide complete documentation and video tutorials for key features." },
];

async function main() {
  const count = await prisma.faq.count();
  if (count > 0) {
    console.log(`ℹ️  ${count} FAQ déjà présentes — aucun ajout (table non vide).`);
    return;
  }
  await prisma.faq.createMany({ data: faqs.map((f, i) => ({ ...f, order: i })) });
  console.log(`✅ ${faqs.length} FAQ insérées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
