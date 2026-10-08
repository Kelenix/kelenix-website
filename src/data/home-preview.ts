// Contenu d'exemple pour la page d'accueil, repris de prisma/seed.ts.
// Utilisé UNIQUEMENT en développement quand la base de données est injoignable (pas de DATABASE_URL),
// pour voir toutes les sections en local. Jamais affiché en production.

export const previewServices = [
  {
    "slug": "developpement-logiciel",
    "titleFr": "Développement de Logiciels sur Mesure",
    "titleEn": "Custom Software Development",
    "shortDescFr": "Applications sur mesure adaptées à vos besoins métier spécifiques et à vos processus internes.",
    "shortDescEn": "Custom applications tailored to your specific business needs and internal processes.",
    "icon": "Code"
  },
  {
    "slug": "creation-sites-web",
    "titleFr": "Création de Sites Web Professionnels",
    "titleEn": "Professional Website Creation",
    "shortDescFr": "Sites web modernes, rapides et optimisés SEO qui reflètent l'image premium de votre entreprise.",
    "shortDescEn": "Modern, fast and SEO-optimized websites that reflect your company's premium image.",
    "icon": "Globe"
  },
  {
    "slug": "applications-web",
    "titleFr": "Développement d'Applications Web",
    "titleEn": "Web Application Development",
    "shortDescFr": "Applications web modernes, réactives et évolutives pour digitaliser vos processus métier.",
    "shortDescEn": "Modern, reactive and scalable web applications to digitize your business processes.",
    "icon": "Monitor"
  },
  {
    "slug": "applications-mobiles",
    "titleFr": "Développement d'Applications Mobiles",
    "titleEn": "Mobile Application Development",
    "shortDescFr": "Applications iOS et Android natives et cross-platform pour toucher vos clients partout.",
    "shortDescEn": "Native and cross-platform iOS & Android applications to reach your customers everywhere.",
    "icon": "Smartphone"
  },
  {
    "slug": "intelligence-artificielle",
    "titleFr": "Solutions d'Intelligence Artificielle",
    "titleEn": "Artificial Intelligence Solutions",
    "shortDescFr": "Solutions IA et machine learning pour automatiser, innover et prendre de meilleures décisions.",
    "shortDescEn": "AI and machine learning solutions to automate, innovate and make better decisions.",
    "icon": "Brain"
  },
  {
    "slug": "consulting-informatique",
    "titleFr": "Consulting Informatique & Stratégie Digitale",
    "titleEn": "IT Consulting & Digital Strategy",
    "shortDescFr": "Accompagnement stratégique pour optimiser votre infrastructure IT et accélérer votre transformation digitale.",
    "shortDescEn": "Strategic support to optimize your IT infrastructure and accelerate your digital transformation.",
    "icon": "TrendingUp"
  },
  {
    "slug": "formation-programmation",
    "titleFr": "Formation en Programmation & Technologies",
    "titleEn": "Programming & Technology Training",
    "shortDescFr": "Formations pratiques et certifiantes en programmation et nouvelles technologies pour votre équipe.",
    "shortDescEn": "Practical and certifying training in programming and new technologies for your team.",
    "icon": "GraduationCap"
  }
];

export const previewProjects = [
  {
    "slug": "plateforme-ecommerce-afritech",
    "titleFr": "Plateforme E-commerce AfriTech",
    "titleEn": "AfriTech E-commerce Platform",
    "category": "WEB",
    "coverImage": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    "client": "AfriTech Solutions"
  },
  {
    "slug": "app-mobile-sante-medsync",
    "titleFr": "Application Mobile de Santé MedSync",
    "titleEn": "MedSync Health Mobile App",
    "category": "MOBILE",
    "coverImage": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    "client": "MedSync Healthcare"
  },
  {
    "slug": "ia-analyse-fraude-fintech",
    "titleFr": "Système IA de Détection de Fraudes",
    "titleEn": "AI Fraud Detection System",
    "category": "AI",
    "coverImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "client": "FinSecure Bank"
  },
  {
    "slug": "erp-logistique-transafrica",
    "titleFr": "ERP Logistique TransAfrica",
    "titleEn": "TransAfrica Logistics ERP",
    "category": "SOFTWARE",
    "coverImage": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    "client": "TransAfrica Logistics"
  },
  {
    "slug": "plateforme-elearning-edutech",
    "titleFr": "Plateforme E-Learning EduTech Pro",
    "titleEn": "EduTech Pro E-Learning Platform",
    "category": "WEB",
    "coverImage": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    "client": "EduTech Pro"
  },
  {
    "slug": "app-gestion-rh-hrflow",
    "titleFr": "Application RH HRFlow",
    "titleEn": "HRFlow HR Application",
    "category": "SOFTWARE",
    "coverImage": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    "client": "HRFlow Corporate"
  }
];

export const previewTestimonials = [
  {
    "id": "preview-0",
    "name": "Kwame Asante",
    "company": "AfriTech Solutions",
    "position": "Directeur Général",
    "photo": "https://ui-avatars.com/api/?name=Kwame+Asante&background=2FA8FF&color=fff",
    "textFr": "Kelenix a transformé notre présence en ligne avec une plateforme e-commerce exceptionnelle. Leur équipe technique est compétente, réactive et vraiment à l'écoute de nos besoins. Le résultat dépasse toutes nos attentes.",
    "textEn": "Kelenix transformed our online presence with an exceptional e-commerce platform. Their technical team is competent, responsive and truly attentive to our needs. The result exceeds all our expectations.",
    "rating": 5
  },
  {
    "id": "preview-1",
    "name": "Dr. Fatima Benali",
    "company": "MedSync Healthcare",
    "position": "CEO & Co-fondatrice",
    "photo": "https://ui-avatars.com/api/?name=Fatima+Benali&background=0B1F3A&color=fff",
    "textFr": "L'application de télémédecine développée par Kelenix a révolutionné l'accès aux soins dans notre région. La qualité technique est irréprochable et le support post-livraison est excellent.",
    "textEn": "The telemedicine application developed by Kelenix has revolutionized access to healthcare in our region. The technical quality is impeccable and the post-delivery support is excellent.",
    "rating": 5
  },
  {
    "id": "preview-2",
    "name": "Thomas Müller",
    "company": "FinSecure Bank",
    "position": "Directeur Innovation",
    "photo": "https://ui-avatars.com/api/?name=Thomas+Muller&background=FFC107&color=0B1F3A",
    "textFr": "La solution IA de détection de fraudes développée par Kelenix a généré des économies considérables. Leur expertise en machine learning est remarquable et leur approche méthodique inspire confiance.",
    "textEn": "The AI fraud detection solution developed by Kelenix has generated considerable savings. Their machine learning expertise is remarkable and their methodical approach inspires confidence.",
    "rating": 5
  },
  {
    "id": "preview-3",
    "name": "Aminata Coulibaly",
    "company": "EduTech Pro",
    "position": "Directrice Pédagogique",
    "photo": "https://ui-avatars.com/api/?name=Aminata+Coulibaly&background=2FA8FF&color=fff",
    "textFr": "Notre plateforme e-learning est exactement ce dont nous avions besoin. Kelenix a su comprendre nos contraintes pédagogiques et livrer une solution innovante qui plaît à nos étudiants.",
    "textEn": "Our e-learning platform is exactly what we needed. Kelenix understood our pedagogical constraints and delivered an innovative solution that our students love.",
    "rating": 5
  },
  {
    "id": "preview-4",
    "name": "Jean-Pierre Dubois",
    "company": "TransAfrica Logistics",
    "position": "Responsable IT",
    "photo": "https://ui-avatars.com/api/?name=Jean+Dubois&background=0B1F3A&color=fff",
    "textFr": "Kelenix a livré notre ERP logistique dans les délais et le budget prévus. L'outil est robuste, intuitif et a complètement transformé notre gestion opérationnelle. Je les recommande vivement.",
    "textEn": "Kelenix delivered our logistics ERP on time and within budget. The tool is robust, intuitive and has completely transformed our operational management. I highly recommend them.",
    "rating": 4
  }
];

export const previewPosts = [
  {
    "slug": "tendances-ia-2025",
    "titleFr": "Les 10 Tendances de l'IA qui Vont Transformer les Entreprises en 2025",
    "titleEn": "The 10 AI Trends That Will Transform Businesses in 2025",
    "excerptFr": "Découvrez les 10 tendances de l'intelligence artificielle qui vont transformer le paysage des entreprises en 2025 et comment vous y préparer dès maintenant.",
    "excerptEn": "Discover the 10 artificial intelligence trends that will transform the business landscape in 2025 and how to prepare for them now.",
    "coverImage": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    "authorName": "Kelenix Team",
    "category": "AI",
    "publishedAt": "2026-09-15T09:00:00.000Z"
  },
  {
    "slug": "next-js-vs-nuxt-2025",
    "titleFr": "Next.js vs Nuxt.js en 2025 : Quel Framework Choisir pour votre Projet ?",
    "titleEn": "Next.js vs Nuxt.js in 2025: Which Framework to Choose for Your Project?",
    "excerptFr": "Comparaison approfondie entre Next.js et Nuxt.js en 2025 pour vous aider à choisir le meilleur framework pour votre prochain projet web.",
    "excerptEn": "In-depth comparison between Next.js and Nuxt.js in 2025 to help you choose the best framework for your next web project.",
    "coverImage": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "authorName": "Kelenix Team",
    "category": "DEVELOPMENT",
    "publishedAt": "2026-09-15T09:00:00.000Z"
  },
  {
    "slug": "transformation-digitale-pme",
    "titleFr": "Guide Complet de la Transformation Digitale pour les PME",
    "titleEn": "Complete Guide to Digital Transformation for SMEs",
    "excerptFr": "Guide pratique pour accompagner les PME dans leur transformation digitale : stratégie, étapes clés et conseils d'experts pour réussir sa digitalisation.",
    "excerptEn": "Practical guide to support SMEs in their digital transformation: strategy, key steps and expert advice for successful digitalization.",
    "coverImage": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "authorName": "Kelenix Team",
    "category": "DIGITAL",
    "publishedAt": "2026-09-15T09:00:00.000Z"
  }
].map((post) => ({ ...post, publishedAt: new Date(post.publishedAt) }));

export const previewFaqs = [
  {
    "questionFr": "Quels types de projets développez-vous ?",
    "questionEn": "What types of projects do you develop?",
    "answerFr": "Nous développons tout type de projet numérique : sites web, applications web et mobile, logiciels sur mesure, solutions IA, et nous offrons également du consulting et de la formation.",
    "answerEn": "We develop all types of digital projects: websites, web and mobile applications, custom software, AI solutions, and we also offer consulting and training."
  },
  {
    "questionFr": "Travaillez-vous avec des clients à l'international ?",
    "questionEn": "Do you work with international clients?",
    "answerFr": "Oui, absolument. Nous travaillons avec des clients partout dans le monde. Nos équipes sont multilingues et nous utilisons les meilleures pratiques de travail à distance pour garantir une collaboration fluide.",
    "answerEn": "Yes, absolutely. We work with clients worldwide. Our teams are multilingual and we use best remote working practices to ensure smooth collaboration."
  },
  {
    "questionFr": "Proposez-vous de la maintenance après livraison ?",
    "questionEn": "Do you offer maintenance after delivery?",
    "answerFr": "Oui, nous proposons des contrats de maintenance et de support post-livraison. Cela inclut les corrections de bugs, les mises à jour de sécurité, et les évolutions fonctionnelles.",
    "answerEn": "Yes, we offer maintenance and post-delivery support contracts. This includes bug fixes, security updates, and feature enhancements."
  },
  {
    "questionFr": "Comment calculez-vous vos tarifs ?",
    "questionEn": "How do you calculate your rates?",
    "answerFr": "Nos tarifs dépendent de la complexité du projet, des technologies utilisées, et du volume de travail. Nous fournissons toujours un devis détaillé et transparent avant de commencer.",
    "answerEn": "Our rates depend on project complexity, technologies used, and volume of work. We always provide a detailed and transparent quote before starting."
  },
  {
    "questionFr": "Proposez-vous des tarifs pour les startups ?",
    "questionEn": "Do you offer rates for startups?",
    "answerFr": "Oui, nous avons des offres adaptées aux startups et PME en phase de lancement. Contactez-nous pour discuter de votre situation et trouver une solution qui correspond à votre budget.",
    "answerEn": "Yes, we have offers adapted to startups and SMEs in their launch phase. Contact us to discuss your situation and find a solution that fits your budget."
  }
];
