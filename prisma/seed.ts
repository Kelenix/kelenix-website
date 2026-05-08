import { PrismaClient, ProjectCategory, BlogCategory, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash("Kelenix@Admin2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@kelenix.com" },
    update: {},
    create: {
      email: "admin@kelenix.com",
      password: hashedPassword,
      name: "Admin Kelenix",
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Services
  const services = [
    {
      slug: "developpement-logiciel",
      titleFr: "Développement de Logiciels sur Mesure",
      titleEn: "Custom Software Development",
      shortDescFr: "Applications sur mesure adaptées à vos besoins métier spécifiques et à vos processus internes.",
      shortDescEn: "Custom applications tailored to your specific business needs and internal processes.",
      longDescFr: `<h2>Développement Logiciel Sur Mesure</h2><p>Chez Kelenix, nous concevons et développons des logiciels sur mesure qui répondent exactement à vos besoins métier. Contrairement aux solutions prêtes à l'emploi, nos applications sont créées spécifiquement pour votre organisation, ce qui garantit une adéquation parfaite avec vos processus et vos objectifs.</p><h3>Notre Approche</h3><p>Nous suivons une méthodologie agile rigoureuse qui permet de livrer des fonctionnalités de valeur à chaque sprint, d'intégrer vos retours en continu et d'adapter le développement à l'évolution de vos besoins.</p><h3>Technologies Utilisées</h3><p>Nous maîtrisons un large éventail de technologies : Node.js, Python, Java, .NET, React, Vue.js, et bien d'autres. Nous choisissons la stack la plus adaptée à vos besoins spécifiques.</p>`,
      longDescEn: `<h2>Custom Software Development</h2><p>At Kelenix, we design and develop custom software that exactly meets your business needs. Unlike off-the-shelf solutions, our applications are created specifically for your organization, ensuring a perfect fit with your processes and objectives.</p><h3>Our Approach</h3><p>We follow a rigorous agile methodology that delivers valuable features at each sprint, integrates your feedback continuously, and adapts development to the evolution of your needs.</p><h3>Technologies Used</h3><p>We master a wide range of technologies: Node.js, Python, Java, .NET, React, Vue.js, and many more. We choose the stack best suited to your specific needs.</p>`,
      icon: "Code",
      technologies: JSON.stringify(["Node.js", "Python", "Java", ".NET", "React", "Vue.js", "PostgreSQL", "MySQL"]),
      faqFr: JSON.stringify([
        { q: "Combien de temps faut-il pour développer un logiciel sur mesure ?", a: "La durée varie selon la complexité du projet. Un projet simple peut prendre 2-3 mois, tandis qu'une application complexe peut nécessiter 6 à 12 mois. Nous définissons le calendrier précis lors de l'analyse de vos besoins." },
        { q: "Pouvez-vous reprendre un projet existant ?", a: "Oui, nous pouvons analyser, améliorer ou refactoriser un code existant. Nous commençons par un audit technique pour évaluer l'état du code et proposer les meilleures solutions." },
      ]),
      faqEn: JSON.stringify([
        { q: "How long does it take to develop custom software?", a: "The duration varies depending on project complexity. A simple project can take 2-3 months, while a complex application may require 6-12 months. We define the precise timeline during the analysis of your needs." },
        { q: "Can you take over an existing project?", a: "Yes, we can analyze, improve or refactor existing code. We start with a technical audit to assess the state of the code and propose the best solutions." },
      ]),
      order: 1,
    },
    {
      slug: "creation-sites-web",
      titleFr: "Création de Sites Web Professionnels",
      titleEn: "Professional Website Creation",
      shortDescFr: "Sites web modernes, rapides et optimisés SEO qui reflètent l'image premium de votre entreprise.",
      shortDescEn: "Modern, fast and SEO-optimized websites that reflect your company's premium image.",
      longDescFr: `<h2>Création de Sites Web Professionnels</h2><p>Nous créons des sites web qui ne sont pas seulement beaux, mais aussi performants, sécurisés et optimisés pour les moteurs de recherche. Chaque site est conçu pour convertir vos visiteurs en clients.</p><h3>Ce que nous incluons</h3><ul><li>Design responsive adapté à tous les écrans</li><li>Optimisation SEO on-page complète</li><li>Performance maximale (Core Web Vitals)</li><li>Interface d'administration intuitive</li><li>Hébergement et maintenance disponibles</li></ul>`,
      longDescEn: `<h2>Professional Website Creation</h2><p>We create websites that are not only beautiful, but also performant, secure and optimized for search engines. Every site is designed to convert your visitors into customers.</p><h3>What we include</h3><ul><li>Responsive design adapted to all screens</li><li>Complete on-page SEO optimization</li><li>Maximum performance (Core Web Vitals)</li><li>Intuitive admin interface</li><li>Hosting and maintenance available</li></ul>`,
      icon: "Globe",
      technologies: JSON.stringify(["Next.js", "WordPress", "Tailwind CSS", "MySQL", "Vercel", "cPanel"]),
      faqFr: JSON.stringify([
        { q: "Quel est le délai de création d'un site web ?", a: "Un site vitrine simple prend 2-4 semaines. Un site e-commerce ou un site complexe peut prendre 6-12 semaines selon les fonctionnalités requises." },
      ]),
      faqEn: JSON.stringify([
        { q: "What is the timeline for creating a website?", a: "A simple showcase site takes 2-4 weeks. An e-commerce site or complex site can take 6-12 weeks depending on required features." },
      ]),
      order: 2,
    },
    {
      slug: "applications-web",
      titleFr: "Développement d'Applications Web",
      titleEn: "Web Application Development",
      shortDescFr: "Applications web modernes, réactives et évolutives pour digitaliser vos processus métier.",
      shortDescEn: "Modern, reactive and scalable web applications to digitize your business processes.",
      longDescFr: `<h2>Applications Web Sur Mesure</h2><p>Nos applications web combinent performance, sécurité et expérience utilisateur optimale. Nous utilisons les frameworks les plus modernes pour créer des solutions robustes et évolutives.</p>`,
      longDescEn: `<h2>Custom Web Applications</h2><p>Our web applications combine performance, security and optimal user experience. We use the most modern frameworks to create robust and scalable solutions.</p>`,
      icon: "Monitor",
      technologies: JSON.stringify(["React", "Next.js", "Node.js", "Express", "GraphQL", "PostgreSQL", "Redis"]),
      faqFr: JSON.stringify([{ q: "Quelle est la différence entre un site web et une application web ?", a: "Un site web présente de l'information de façon statique ou semi-dynamique. Une application web offre des fonctionnalités interactives complexes, de la gestion de données et des processus métier automatisés." }]),
      faqEn: JSON.stringify([{ q: "What is the difference between a website and a web application?", a: "A website presents information in a static or semi-dynamic way. A web application offers complex interactive features, data management and automated business processes." }]),
      order: 3,
    },
    {
      slug: "applications-mobiles",
      titleFr: "Développement d'Applications Mobiles",
      titleEn: "Mobile Application Development",
      shortDescFr: "Applications iOS et Android natives et cross-platform pour toucher vos clients partout.",
      shortDescEn: "Native and cross-platform iOS & Android applications to reach your customers everywhere.",
      longDescFr: `<h2>Applications Mobiles iOS & Android</h2><p>Nous développons des applications mobiles intuitives et performantes pour iOS et Android. Que vous optiez pour une application native ou cross-platform, nous garantissons une expérience utilisateur exceptionnelle.</p>`,
      longDescEn: `<h2>iOS & Android Mobile Applications</h2><p>We develop intuitive and performant mobile applications for iOS and Android. Whether you opt for a native or cross-platform application, we guarantee an exceptional user experience.</p>`,
      icon: "Smartphone",
      technologies: JSON.stringify(["React Native", "Flutter", "Swift", "Kotlin", "Expo", "Firebase"]),
      faqFr: JSON.stringify([{ q: "Vaut-il mieux développer une application native ou cross-platform ?", a: "Cela dépend de votre budget et de vos besoins. Le cross-platform (React Native, Flutter) est plus économique et maintient une seule codebase. Le natif offre les meilleures performances mais coûte plus cher. Nous vous conseillons selon votre cas." }]),
      faqEn: JSON.stringify([{ q: "Is it better to develop a native or cross-platform application?", a: "It depends on your budget and needs. Cross-platform (React Native, Flutter) is more economical and maintains a single codebase. Native offers the best performance but costs more. We advise you based on your case." }]),
      order: 4,
    },
    {
      slug: "intelligence-artificielle",
      titleFr: "Solutions d'Intelligence Artificielle",
      titleEn: "Artificial Intelligence Solutions",
      shortDescFr: "Solutions IA et machine learning pour automatiser, innover et prendre de meilleures décisions.",
      shortDescEn: "AI and machine learning solutions to automate, innovate and make better decisions.",
      longDescFr: `<h2>Intelligence Artificielle & Machine Learning</h2><p>Nous intégrons l'intelligence artificielle dans vos processus pour vous aider à prendre de meilleures décisions, automatiser des tâches répétitives et créer des expériences personnalisées pour vos clients.</p><h3>Nos Solutions IA</h3><ul><li>Chatbots et assistants virtuels intelligents</li><li>Analyse prédictive et forecasting</li><li>Traitement du langage naturel (NLP)</li><li>Vision par ordinateur</li><li>Systèmes de recommandation</li><li>Détection de fraudes et anomalies</li></ul>`,
      longDescEn: `<h2>Artificial Intelligence & Machine Learning</h2><p>We integrate artificial intelligence into your processes to help you make better decisions, automate repetitive tasks and create personalized experiences for your customers.</p><h3>Our AI Solutions</h3><ul><li>Intelligent chatbots and virtual assistants</li><li>Predictive analytics and forecasting</li><li>Natural language processing (NLP)</li><li>Computer vision</li><li>Recommendation systems</li><li>Fraud and anomaly detection</li></ul>`,
      icon: "Brain",
      technologies: JSON.stringify(["Python", "TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Hugging Face", "FastAPI"]),
      faqFr: JSON.stringify([{ q: "Mon entreprise a-t-elle besoin de grandes quantités de données pour utiliser l'IA ?", a: "Pas nécessairement. Selon la solution IA envisagée, nous pouvons utiliser des modèles pré-entraînés, du transfer learning ou des techniques de few-shot learning qui fonctionnent avec peu de données." }]),
      faqEn: JSON.stringify([{ q: "Does my company need large amounts of data to use AI?", a: "Not necessarily. Depending on the AI solution envisaged, we can use pre-trained models, transfer learning or few-shot learning techniques that work with little data." }]),
      order: 5,
    },
    {
      slug: "consulting-informatique",
      titleFr: "Consulting Informatique & Stratégie Digitale",
      titleEn: "IT Consulting & Digital Strategy",
      shortDescFr: "Accompagnement stratégique pour optimiser votre infrastructure IT et accélérer votre transformation digitale.",
      shortDescEn: "Strategic support to optimize your IT infrastructure and accelerate your digital transformation.",
      longDescFr: `<h2>Consulting IT & Stratégie Digitale</h2><p>Nos consultants expérimentés vous accompagnent dans la définition et l'exécution de votre stratégie digitale. Nous analysons votre situation actuelle, identifions les opportunités d'amélioration et vous proposons une roadmap claire et actionnable.</p>`,
      longDescEn: `<h2>IT Consulting & Digital Strategy</h2><p>Our experienced consultants support you in defining and executing your digital strategy. We analyze your current situation, identify opportunities for improvement and provide you with a clear and actionable roadmap.</p>`,
      icon: "TrendingUp",
      technologies: JSON.stringify(["Architecture Cloud", "AWS", "Azure", "GCP", "DevOps", "CI/CD", "Kubernetes", "Docker"]),
      faqFr: JSON.stringify([{ q: "À qui s'adresse le consulting IT ?", a: "Notre service de consulting s'adresse aux entreprises de toutes tailles qui souhaitent optimiser leur utilisation de la technologie : PME en transformation digitale, startups cherchant à scaler, ou grandes entreprises souhaitant moderniser leur SI." }]),
      faqEn: JSON.stringify([{ q: "Who is IT consulting for?", a: "Our consulting service is aimed at companies of all sizes that want to optimize their use of technology: SMEs in digital transformation, startups looking to scale, or large companies wanting to modernize their information systems." }]),
      order: 6,
    },
    {
      slug: "formation-programmation",
      titleFr: "Formation en Programmation & Technologies",
      titleEn: "Programming & Technology Training",
      shortDescFr: "Formations pratiques et certifiantes en programmation et nouvelles technologies pour votre équipe.",
      shortDescEn: "Practical and certifying training in programming and new technologies for your team.",
      longDescFr: `<h2>Formation Tech & Programmation</h2><p>Nous proposons des formations adaptées à tous les niveaux, du débutant à l'expert. Nos programmes sont conçus par des professionnels actifs qui connaissent les besoins réels du marché.</p><h3>Nos Formations</h3><ul><li>Développement Web (HTML, CSS, JavaScript, React, Next.js)</li><li>Développement Backend (Node.js, Python, PHP)</li><li>Bases de données (MySQL, PostgreSQL, MongoDB)</li><li>Intelligence Artificielle et Machine Learning</li><li>DevOps et Cloud Computing</li><li>Cybersécurité et bonnes pratiques</li></ul>`,
      longDescEn: `<h2>Tech & Programming Training</h2><p>We offer training adapted to all levels, from beginner to expert. Our programs are designed by active professionals who know the real market needs.</p><h3>Our Training Programs</h3><ul><li>Web Development (HTML, CSS, JavaScript, React, Next.js)</li><li>Backend Development (Node.js, Python, PHP)</li><li>Databases (MySQL, PostgreSQL, MongoDB)</li><li>Artificial Intelligence and Machine Learning</li><li>DevOps and Cloud Computing</li><li>Cybersecurity and best practices</li></ul>`,
      icon: "GraduationCap",
      technologies: JSON.stringify(["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Docker", "AWS"]),
      faqFr: JSON.stringify([{ q: "Les formations sont-elles disponibles en ligne ?", a: "Oui, nous proposons des formations en présentiel, en ligne (synchrone avec formateur) et en e-learning (à votre rythme). Nous nous adaptons aux contraintes de votre équipe." }]),
      faqEn: JSON.stringify([{ q: "Are training programs available online?", a: "Yes, we offer in-person, online (synchronous with trainer) and e-learning (at your own pace) training. We adapt to your team's constraints." }]),
      order: 7,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  // Projects
  const projects = [
    {
      slug: "plateforme-ecommerce-afritech",
      titleFr: "Plateforme E-commerce AfriTech",
      titleEn: "AfriTech E-commerce Platform",
      client: "AfriTech Solutions",
      category: ProjectCategory.WEB,
      descFr: "Développement d'une plateforme e-commerce complète pour AfriTech Solutions, incluant gestion des stocks, paiements en ligne, et tableau de bord analytics avancé.",
      descEn: "Development of a complete e-commerce platform for AfriTech Solutions, including inventory management, online payments, and advanced analytics dashboard.",
      problemFr: "AfriTech avait besoin d'une solution e-commerce robuste capable de gérer plusieurs milliers de produits et de traiter des paiements sécurisés pour leurs clients en Afrique et en Europe.",
      problemEn: "AfriTech needed a robust e-commerce solution capable of managing several thousand products and processing secure payments for their customers in Africa and Europe.",
      solutionFr: "Nous avons développé une plateforme Next.js avec intégration Stripe et Orange Money, système de gestion des stocks en temps réel et analytics avancés.",
      solutionEn: "We developed a Next.js platform with Stripe and Orange Money integration, real-time inventory management system and advanced analytics.",
      resultsFr: "Augmentation de 180% des ventes en ligne, réduction de 40% des erreurs de stock, satisfaction client à 97%.",
      resultsEn: "180% increase in online sales, 40% reduction in inventory errors, 97% customer satisfaction.",
      technologies: JSON.stringify(["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis", "AWS"]),
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      ]),
      featured: true,
    },
    {
      slug: "app-mobile-sante-medsync",
      titleFr: "Application Mobile de Santé MedSync",
      titleEn: "MedSync Health Mobile App",
      client: "MedSync Healthcare",
      category: ProjectCategory.MOBILE,
      descFr: "Application mobile de télémédecine permettant aux patients de consulter des médecins en vidéo, gérer leurs ordonnances et suivre leur parcours de soins.",
      descEn: "Telemedicine mobile application allowing patients to consult doctors by video, manage their prescriptions and track their care pathway.",
      problemFr: "Dans les zones rurales, l'accès aux soins médicaux était difficile. MedSync voulait créer une solution numérique pour connecter patients et médecins à distance.",
      problemEn: "In rural areas, access to medical care was difficult. MedSync wanted to create a digital solution to connect patients and doctors remotely.",
      solutionFr: "Application React Native avec vidéo HD via WebRTC, système de gestion des ordonnances électroniques, et intégration avec les systèmes de santé nationaux.",
      solutionEn: "React Native application with HD video via WebRTC, electronic prescription management system, and integration with national health systems.",
      resultsFr: "50,000+ consultations réalisées, 92% de satisfaction patient, disponible dans 12 pays.",
      resultsEn: "50,000+ consultations completed, 92% patient satisfaction, available in 12 countries.",
      technologies: JSON.stringify(["React Native", "Node.js", "WebRTC", "PostgreSQL", "AWS", "Firebase"]),
      coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      ]),
      featured: true,
    },
    {
      slug: "ia-analyse-fraude-fintech",
      titleFr: "Système IA de Détection de Fraudes",
      titleEn: "AI Fraud Detection System",
      client: "FinSecure Bank",
      category: ProjectCategory.AI,
      descFr: "Développement d'un système de détection de fraudes en temps réel utilisant le machine learning pour analyser des millions de transactions bancaires.",
      descEn: "Development of a real-time fraud detection system using machine learning to analyze millions of banking transactions.",
      problemFr: "FinSecure Bank subissait des pertes importantes dues aux fraudes bancaires. Leur système de détection traditionnel présentait un taux de faux positifs trop élevé.",
      problemEn: "FinSecure Bank was suffering significant losses due to banking fraud. Their traditional detection system had too high a false positive rate.",
      solutionFr: "Implémentation d'un modèle d'ensemble combinant Random Forest, Gradient Boosting et un réseau de neurones LSTM pour la détection en temps réel.",
      solutionEn: "Implementation of an ensemble model combining Random Forest, Gradient Boosting and an LSTM neural network for real-time detection.",
      resultsFr: "Réduction de 87% des fraudes, faux positifs réduits de 65%, économies de 2.3M€ en première année.",
      resultsEn: "87% reduction in fraud, false positives reduced by 65%, savings of €2.3M in the first year.",
      technologies: JSON.stringify(["Python", "TensorFlow", "Scikit-learn", "Apache Kafka", "PostgreSQL", "Docker", "Kubernetes"]),
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      ]),
      featured: true,
    },
    {
      slug: "erp-logistique-transafrica",
      titleFr: "ERP Logistique TransAfrica",
      titleEn: "TransAfrica Logistics ERP",
      client: "TransAfrica Logistics",
      category: ProjectCategory.SOFTWARE,
      descFr: "Développement d'un ERP complet pour la gestion logistique, incluant suivi des expéditions en temps réel, gestion de flotte et optimisation des routes.",
      descEn: "Development of a complete ERP for logistics management, including real-time shipment tracking, fleet management and route optimization.",
      problemFr: "TransAfrica gérait manuellement des centaines d'expéditions quotidiennes avec des erreurs fréquentes et un manque de visibilité sur leur flotte.",
      problemEn: "TransAfrica manually managed hundreds of daily shipments with frequent errors and a lack of visibility on their fleet.",
      solutionFr: "ERP sur mesure avec module de tracking GPS, optimisation des routes par algorithmes, tableaux de bord temps réel et intégration API transporteurs.",
      solutionEn: "Custom ERP with GPS tracking module, algorithm-based route optimization, real-time dashboards and carrier API integration.",
      resultsFr: "35% de réduction des coûts opérationnels, livraisons à l'heure améliorées de 28%, gestion de 500+ véhicules.",
      resultsEn: "35% reduction in operating costs, on-time deliveries improved by 28%, management of 500+ vehicles.",
      technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "Google Maps API", "Docker", "Redis"]),
      coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      ]),
      featured: false,
    },
    {
      slug: "plateforme-elearning-edutech",
      titleFr: "Plateforme E-Learning EduTech Pro",
      titleEn: "EduTech Pro E-Learning Platform",
      client: "EduTech Pro",
      category: ProjectCategory.WEB,
      descFr: "Plateforme d'enseignement en ligne complète avec cours vidéo, quiz interactifs, certificats automatiques et suivi des progrès.",
      descEn: "Complete online learning platform with video courses, interactive quizzes, automatic certificates and progress tracking.",
      problemFr: "EduTech voulait digitaliser ses formations présentiel et les rendre accessibles à un public international, avec un système de certification reconnu.",
      problemEn: "EduTech wanted to digitize its in-person training and make them accessible to an international audience, with a recognized certification system.",
      solutionFr: "LMS sur mesure avec lecture vidéo adaptative, gamification, système de certificats blockchain, et analytics d'apprentissage.",
      solutionEn: "Custom LMS with adaptive video playback, gamification, blockchain certificate system, and learning analytics.",
      resultsFr: "15,000 étudiants inscrits, 450+ cours disponibles, présent dans 35 pays.",
      resultsEn: "15,000 enrolled students, 450+ courses available, present in 35 countries.",
      technologies: JSON.stringify(["Next.js", "Node.js", "PostgreSQL", "AWS S3", "WebRTC", "Stripe"]),
      coverImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
      ]),
      featured: false,
    },
    {
      slug: "app-gestion-rh-hrflow",
      titleFr: "Application RH HRFlow",
      titleEn: "HRFlow HR Application",
      client: "HRFlow Corporate",
      category: ProjectCategory.SOFTWARE,
      descFr: "Application web de gestion des ressources humaines incluant recrutement, onboarding, gestion des congés, évaluations et paie.",
      descEn: "Web HR management application including recruitment, onboarding, leave management, evaluations and payroll.",
      problemFr: "HRFlow gérait ses processus RH sur Excel avec des risques d'erreurs importants et un manque d'efficacité dans le recrutement et la gestion quotidienne.",
      problemEn: "HRFlow managed its HR processes on Excel with significant risk of errors and inefficiency in recruitment and daily management.",
      solutionFr: "Application RH complète avec workflow de recrutement, portail employé, calcul automatique des congés et intégration avec les logiciels de paie.",
      solutionEn: "Complete HR application with recruitment workflow, employee portal, automatic leave calculation and integration with payroll software.",
      resultsFr: "60% de gain de temps sur les processus RH, onboarding réduit de 5 jours à 1 jour, 300 employés gérés.",
      resultsEn: "60% time savings on HR processes, onboarding reduced from 5 days to 1 day, 300 employees managed.",
      technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "Redis", "SendGrid", "Docker"]),
      coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      ]),
      featured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  // Testimonials
  const testimonials = [
    {
      name: "Kwame Asante",
      company: "AfriTech Solutions",
      position: "Directeur Général",
      photo: "https://ui-avatars.com/api/?name=Kwame+Asante&background=2FA8FF&color=fff",
      textFr: "Kelenix a transformé notre présence en ligne avec une plateforme e-commerce exceptionnelle. Leur équipe technique est compétente, réactive et vraiment à l'écoute de nos besoins. Le résultat dépasse toutes nos attentes.",
      textEn: "Kelenix transformed our online presence with an exceptional e-commerce platform. Their technical team is competent, responsive and truly attentive to our needs. The result exceeds all our expectations.",
      rating: 5,
      showOnHome: true,
    },
    {
      name: "Dr. Fatima Benali",
      company: "MedSync Healthcare",
      position: "CEO & Co-fondatrice",
      photo: "https://ui-avatars.com/api/?name=Fatima+Benali&background=0B1F3A&color=fff",
      textFr: "L'application de télémédecine développée par Kelenix a révolutionné l'accès aux soins dans notre région. La qualité technique est irréprochable et le support post-livraison est excellent.",
      textEn: "The telemedicine application developed by Kelenix has revolutionized access to healthcare in our region. The technical quality is impeccable and the post-delivery support is excellent.",
      rating: 5,
      showOnHome: true,
    },
    {
      name: "Thomas Müller",
      company: "FinSecure Bank",
      position: "Directeur Innovation",
      photo: "https://ui-avatars.com/api/?name=Thomas+Muller&background=FFC107&color=0B1F3A",
      textFr: "La solution IA de détection de fraudes développée par Kelenix a généré des économies considérables. Leur expertise en machine learning est remarquable et leur approche méthodique inspire confiance.",
      textEn: "The AI fraud detection solution developed by Kelenix has generated considerable savings. Their machine learning expertise is remarkable and their methodical approach inspires confidence.",
      rating: 5,
      showOnHome: true,
    },
    {
      name: "Aminata Coulibaly",
      company: "EduTech Pro",
      position: "Directrice Pédagogique",
      photo: "https://ui-avatars.com/api/?name=Aminata+Coulibaly&background=2FA8FF&color=fff",
      textFr: "Notre plateforme e-learning est exactement ce dont nous avions besoin. Kelenix a su comprendre nos contraintes pédagogiques et livrer une solution innovante qui plaît à nos étudiants.",
      textEn: "Our e-learning platform is exactly what we needed. Kelenix understood our pedagogical constraints and delivered an innovative solution that our students love.",
      rating: 5,
      showOnHome: false,
    },
    {
      name: "Jean-Pierre Dubois",
      company: "TransAfrica Logistics",
      position: "Responsable IT",
      photo: "https://ui-avatars.com/api/?name=Jean+Dubois&background=0B1F3A&color=fff",
      textFr: "Kelenix a livré notre ERP logistique dans les délais et le budget prévus. L'outil est robuste, intuitif et a complètement transformé notre gestion opérationnelle. Je les recommande vivement.",
      textEn: "Kelenix delivered our logistics ERP on time and within budget. The tool is robust, intuitive and has completely transformed our operational management. I highly recommend them.",
      rating: 4,
      showOnHome: false,
    },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // Blog Posts
  const blogPosts = [
    {
      slug: "tendances-ia-2025",
      titleFr: "Les 10 Tendances de l'IA qui Vont Transformer les Entreprises en 2025",
      titleEn: "The 10 AI Trends That Will Transform Businesses in 2025",
      contentFr: `<h2>Introduction</h2><p>L'intelligence artificielle continue d'évoluer à une vitesse vertigineuse. En 2025, plusieurs tendances majeures vont redéfinir la façon dont les entreprises fonctionnent, innovent et créent de la valeur.</p><h2>1. L'IA Générative au Service des Entreprises</h2><p>Les modèles de langage comme GPT-4 et Claude ne sont plus réservés aux chercheurs. Les entreprises de toutes tailles les intègrent dans leurs workflows pour automatiser la création de contenu, le service client et l'analyse de données.</p><h2>2. L'IA Edge pour les Applications Temps Réel</h2><p>Le déploiement de modèles IA directement sur les appareils (edge computing) permet des inférences ultra-rapides sans dépendance au cloud. Cela ouvre des possibilités immenses pour l'IoT industriel, les véhicules autonomes et la robotique.</p><h2>3. L'AutoML Démocratise le Machine Learning</h2><p>Les plateformes AutoML permettent aux équipes sans expertise en data science de créer et déployer des modèles ML performants. Cette démocratisation accélère l'adoption de l'IA dans les PME.</p><h2>4. La IA Explicable (XAI)</h2><p>Avec la réglementation croissante sur l'IA (EU AI Act), l'explicabilité devient un impératif. Les entreprises doivent être en mesure de justifier les décisions prises par leurs algorithmes.</p><h2>5. L'Agent IA Autonome</h2><p>Les agents IA capables d'agir de façon autonome pour accomplir des tâches complexes, comme la navigation web, l'exécution de code ou la gestion de fichiers, révolutionnent la productivité des entreprises.</p><h2>Conclusion</h2><p>Ces tendances confirment que l'IA n'est plus une technologie du futur, mais une réalité présente que chaque entreprise doit embrasser pour rester compétitive. Chez Kelenix, nous aidons nos clients à naviguer dans cet écosystème complexe et à tirer le meilleur parti de l'IA.</p>`,
      contentEn: `<h2>Introduction</h2><p>Artificial intelligence continues to evolve at a dizzying pace. In 2025, several major trends will redefine how businesses operate, innovate and create value.</p><h2>1. Generative AI in the Service of Businesses</h2><p>Language models like GPT-4 and Claude are no longer reserved for researchers. Businesses of all sizes are integrating them into their workflows to automate content creation, customer service and data analysis.</p><h2>2. Edge AI for Real-Time Applications</h2><p>Deploying AI models directly on devices (edge computing) enables ultra-fast inferences without cloud dependency. This opens immense possibilities for industrial IoT, autonomous vehicles and robotics.</p><h2>3. AutoML Democratizes Machine Learning</h2><p>AutoML platforms allow teams without data science expertise to create and deploy performant ML models. This democratization accelerates AI adoption in SMEs.</p><h2>4. Explainable AI (XAI)</h2><p>With increasing AI regulation (EU AI Act), explainability is becoming imperative. Companies must be able to justify decisions made by their algorithms.</p><h2>5. Autonomous AI Agents</h2><p>AI agents capable of acting autonomously to accomplish complex tasks, such as web browsing, code execution or file management, are revolutionizing business productivity.</p><h2>Conclusion</h2><p>These trends confirm that AI is no longer a technology of the future, but a present reality that every company must embrace to remain competitive. At Kelenix, we help our clients navigate this complex ecosystem and make the most of AI.</p>`,
      excerptFr: "Découvrez les 10 tendances de l'intelligence artificielle qui vont transformer le paysage des entreprises en 2025 et comment vous y préparer dès maintenant.",
      excerptEn: "Discover the 10 artificial intelligence trends that will transform the business landscape in 2025 and how to prepare for them now.",
      coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
      authorName: "Kelenix Team",
      authorBio: "L'équipe d'experts techniques de Kelenix",
      category: BlogCategory.AI,
      tags: JSON.stringify(["IA", "Machine Learning", "Innovation", "2025", "Entreprise"]),
      published: true,
      publishedAt: new Date("2025-01-15"),
    },
    {
      slug: "next-js-vs-nuxt-2025",
      titleFr: "Next.js vs Nuxt.js en 2025 : Quel Framework Choisir pour votre Projet ?",
      titleEn: "Next.js vs Nuxt.js in 2025: Which Framework to Choose for Your Project?",
      contentFr: `<h2>Introduction</h2><p>Le choix du framework frontend est une décision cruciale qui impacte la maintenabilité, les performances et la vélocité de développement de votre projet. En 2025, Next.js et Nuxt.js dominent le marché des meta-frameworks JavaScript.</p><h2>Next.js : La Référence React</h2><p>Next.js, développé par Vercel, est le framework le plus populaire pour React. Avec son App Router, les React Server Components et l'intégration native des dernières fonctionnalités React, il offre une expérience de développement inégalée.</p><h3>Points Forts de Next.js</h3><ul><li>Écosystème React gigantesque</li><li>Server Components pour des performances optimales</li><li>Streaming et Suspense natifs</li><li>Edge Runtime pour des latences minimales</li><li>Excellent support Vercel</li></ul><h2>Nuxt.js : La Puissance de Vue</h2><p>Nuxt.js est l'équivalent Vue.js de Next.js. Il offre une DX (Developer Experience) exceptionnelle avec son système de modules, son auto-import et sa configuration intuitive.</p><h3>Points Forts de Nuxt.js</h3><ul><li>DX extraordinaire</li><li>Modules officiels de haute qualité</li><li>Configuration plus intuitive</li><li>Courbe d'apprentissage plus douce</li><li>Nuxt DevTools révolutionnaires</li></ul><h2>Conclusion : Quel Choisir ?</h2><p>Choisissez Next.js si votre équipe est familière avec React et que vous visez un écosystème large. Optez pour Nuxt.js si vous préférez Vue.js ou si vous cherchez une DX optimale avec moins de configuration.</p>`,
      contentEn: `<h2>Introduction</h2><p>The choice of frontend framework is a crucial decision that impacts the maintainability, performance and development velocity of your project. In 2025, Next.js and Nuxt.js dominate the JavaScript meta-framework market.</p><h2>Next.js: The React Reference</h2><p>Next.js, developed by Vercel, is the most popular framework for React. With its App Router, React Server Components and native integration of the latest React features, it offers an unmatched development experience.</p><h2>Nuxt.js: The Power of Vue</h2><p>Nuxt.js is the Vue.js equivalent of Next.js. It offers exceptional DX (Developer Experience) with its module system, auto-import and intuitive configuration.</p><h2>Conclusion: Which to Choose?</h2><p>Choose Next.js if your team is familiar with React and you're targeting a large ecosystem. Opt for Nuxt.js if you prefer Vue.js or are looking for optimal DX with less configuration.</p>`,
      excerptFr: "Comparaison approfondie entre Next.js et Nuxt.js en 2025 pour vous aider à choisir le meilleur framework pour votre prochain projet web.",
      excerptEn: "In-depth comparison between Next.js and Nuxt.js in 2025 to help you choose the best framework for your next web project.",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      authorName: "Kelenix Team",
      authorBio: "L'équipe d'experts techniques de Kelenix",
      category: BlogCategory.DEVELOPMENT,
      tags: JSON.stringify(["Next.js", "Nuxt.js", "React", "Vue.js", "Framework"]),
      published: true,
      publishedAt: new Date("2025-02-10"),
    },
    {
      slug: "transformation-digitale-pme",
      titleFr: "Guide Complet de la Transformation Digitale pour les PME",
      titleEn: "Complete Guide to Digital Transformation for SMEs",
      contentFr: `<h2>Qu'est-ce que la Transformation Digitale ?</h2><p>La transformation digitale ne se résume pas à l'adoption de nouvelles technologies. C'est un changement profond de la culture, des processus et du modèle d'affaires d'une entreprise pour tirer pleinement parti du potentiel numérique.</p><h2>Pourquoi les PME Doivent Se Transformer Maintenant</h2><p>La pandémie a accéléré la transformation digitale de 5 à 7 ans selon McKinsey. Les PME qui n'adoptent pas les outils numériques risquent de perdre leur compétitivité face à des acteurs plus agiles et digitalisés.</p><h2>Les 5 Piliers de la Transformation Digitale</h2><h3>1. L'Expérience Client Digitale</h3><p>Créer des parcours client fluides et omnicanaux : site web performant, application mobile, chatbot, etc.</p><h3>2. La Digitalisation des Processus Internes</h3><p>Automatiser les tâches répétitives, digitaliser les documents, implémenter un ERP adapté à votre activité.</p><h3>3. La Data et l'Analytique</h3><p>Collecter, analyser et exploiter vos données pour prendre des décisions éclairées basées sur des faits.</p><h3>4. La Culture Digitale</h3><p>Former vos équipes aux nouveaux outils et développer une culture d'expérimentation et d'innovation.</p><h3>5. La Cybersécurité</h3><p>Protéger vos actifs numériques et données clients avec une stratégie de sécurité adaptée.</p><h2>Par Où Commencer ?</h2><p>Commencez par un audit digital de votre situation actuelle, définissez vos priorités en fonction de l'impact attendu et du coût, puis procédez par étapes progressives pour minimiser les risques.</p>`,
      contentEn: `<h2>What is Digital Transformation?</h2><p>Digital transformation is not just about adopting new technologies. It is a profound change in a company's culture, processes and business model to fully leverage digital potential.</p><h2>Why SMEs Must Transform Now</h2><p>The pandemic accelerated digital transformation by 5-7 years according to McKinsey. SMEs that don't adopt digital tools risk losing their competitiveness to more agile and digitalized players.</p><h2>The 5 Pillars of Digital Transformation</h2><p>Customer experience, process digitization, data analytics, digital culture, and cybersecurity form the foundation of successful digital transformation.</p><h2>Where to Start?</h2><p>Start with a digital audit of your current situation, define your priorities based on expected impact and cost, then proceed step by step to minimize risks.</p>`,
      excerptFr: "Guide pratique pour accompagner les PME dans leur transformation digitale : stratégie, étapes clés et conseils d'experts pour réussir sa digitalisation.",
      excerptEn: "Practical guide to support SMEs in their digital transformation: strategy, key steps and expert advice for successful digitalization.",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      authorName: "Kelenix Team",
      authorBio: "L'équipe d'experts techniques de Kelenix",
      category: BlogCategory.DIGITAL,
      tags: JSON.stringify(["Transformation Digitale", "PME", "Stratégie", "Innovation"]),
      published: true,
      publishedAt: new Date("2025-03-05"),
    },
    {
      slug: "cybersecurite-bonnes-pratiques-2025",
      titleFr: "Cybersécurité 2025 : Les 15 Bonnes Pratiques Essentielles",
      titleEn: "Cybersecurity 2025: The 15 Essential Best Practices",
      contentFr: `<h2>Pourquoi la Cybersécurité est Critique en 2025</h2><p>Les cyberattaques ont augmenté de 300% depuis 2020. En 2025, une PME sur deux sera ciblée par une cyberattaque. Le coût moyen d'une violation de données atteint 4.45 millions de dollars selon IBM.</p><h2>Les 15 Bonnes Pratiques</h2><h3>1. Authentification Multi-Facteurs (MFA)</h3><p>Activez le MFA sur tous vos comptes critiques. C'est la mesure la plus efficace contre le phishing.</p><h3>2. Mises à Jour Régulières</h3><p>Maintenez vos logiciels, OS et firmware à jour. 60% des breaches exploitent des vulnérabilités connues et corrigées.</p><h3>3. Sauvegardes 3-2-1</h3><p>3 copies de vos données, sur 2 supports différents, dont 1 hors site. Testez régulièrement la restauration.</p><h3>4. Formation des Employés</h3><p>90% des incidents de sécurité impliquent une erreur humaine. Formez régulièrement vos équipes aux bonnes pratiques.</p><h3>5. Segmentation Réseau</h3><p>Isolez les systèmes critiques dans des segments réseau séparés pour limiter la propagation d'une attaque.</p><h2>Conclusion</h2><p>La cybersécurité est un investissement, pas un coût. En appliquant ces bonnes pratiques, vous réduisez significativement votre surface d'attaque et protégez vos actifs les plus précieux.</p>`,
      contentEn: `<h2>Why Cybersecurity is Critical in 2025</h2><p>Cyberattacks have increased by 300% since 2020. In 2025, one in two SMEs will be targeted by a cyberattack. The average cost of a data breach reaches $4.45 million according to IBM.</p><h2>The 15 Best Practices</h2><p>Multi-factor authentication, regular updates, 3-2-1 backups, employee training, and network segmentation are among the most critical security measures every organization should implement.</p><h2>Conclusion</h2><p>Cybersecurity is an investment, not a cost. By applying these best practices, you significantly reduce your attack surface and protect your most valuable assets.</p>`,
      excerptFr: "Les 15 bonnes pratiques de cybersécurité indispensables pour protéger votre entreprise contre les cybermenaces croissantes de 2025.",
      excerptEn: "The 15 essential cybersecurity best practices to protect your business against the growing cyber threats of 2025.",
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      authorName: "Kelenix Team",
      authorBio: "L'équipe d'experts techniques de Kelenix",
      category: BlogCategory.NEWS,
      tags: JSON.stringify(["Cybersécurité", "Sécurité", "Bonnes Pratiques", "Protection"]),
      published: true,
      publishedAt: new Date("2025-04-12"),
    },
    {
      slug: "react-native-flutter-guide",
      titleFr: "React Native vs Flutter : Guide Complet pour Choisir en 2025",
      titleEn: "React Native vs Flutter: Complete Guide to Choosing in 2025",
      contentFr: `<h2>Introduction au Développement Mobile Cross-Platform</h2><p>React Native et Flutter dominent le développement mobile cross-platform. Mais lequel choisir pour votre prochain projet ? Cette comparaison exhaustive vous aidera à prendre la meilleure décision.</p><h2>React Native</h2><p>Créé par Facebook/Meta, React Native utilise JavaScript/TypeScript et des composants natifs. En 2025, avec la New Architecture (Fabric + JSI), les performances se sont considérablement améliorées.</p><h2>Flutter</h2><p>Créé par Google, Flutter utilise le langage Dart et son propre moteur de rendu (Skia/Impeller). Il offre des performances quasi-natives et une cohérence visuelle parfaite entre plateformes.</p><h2>Comparaison Détaillée</h2><h3>Performance</h3><p>Flutter gagne en termes de performances brutes grâce à son moteur de rendu propre. React Native avec la nouvelle architecture se rapproche des performances natives.</p><h3>Communauté et Écosystème</h3><p>React Native bénéficie d'une communauté plus large et d'un meilleur accès aux développeurs JavaScript existants. Flutter a une communauté très active et en forte croissance.</p><h2>Recommandation</h2><p>Choisissez React Native si vous avez une équipe JavaScript, si vous devez réutiliser du code web, ou si l'accès aux modules natifs est critique. Choisissez Flutter pour des applications UI riches avec des animations complexes.</p>`,
      contentEn: `<h2>Introduction to Cross-Platform Mobile Development</h2><p>React Native and Flutter dominate cross-platform mobile development. But which one to choose for your next project? This comprehensive comparison will help you make the best decision.</p><h2>React Native vs Flutter</h2><p>Both frameworks have matured significantly in 2025. React Native's New Architecture has dramatically improved performance, while Flutter's Impeller rendering engine delivers consistent UI across all platforms.</p><h2>Recommendation</h2><p>Choose React Native if you have a JavaScript team or need to share code with web. Choose Flutter for rich UI applications with complex animations and pixel-perfect designs.</p>`,
      excerptFr: "Comparaison complète entre React Native et Flutter en 2025 pour vous aider à choisir la meilleure technologie pour votre application mobile.",
      excerptEn: "Complete comparison between React Native and Flutter in 2025 to help you choose the best technology for your mobile application.",
      coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      authorName: "Kelenix Team",
      authorBio: "L'équipe d'experts techniques de Kelenix",
      category: BlogCategory.GUIDES,
      tags: JSON.stringify(["React Native", "Flutter", "Mobile", "Cross-Platform", "Guide"]),
      published: true,
      publishedAt: new Date("2025-05-01"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // Site Settings
  const settings = [
    { key: "company_name", value: "Kelenix" },
    { key: "company_email", value: "contact@kelenix.com" },
    { key: "company_phone", value: "+33 1 23 45 67 89" },
    { key: "company_whatsapp", value: "+33612345678" },
    { key: "company_address", value: "Paris, France" },
    { key: "company_linkedin", value: "https://linkedin.com/company/kelenix" },
    { key: "company_facebook", value: "https://facebook.com/kelenix" },
    { key: "company_instagram", value: "https://instagram.com/kelenix" },
    { key: "company_tiktok", value: "https://tiktok.com/@kelenix" },
    { key: "company_youtube", value: "https://youtube.com/@kelenix" },
    { key: "company_twitter", value: "https://x.com/kelenix" },
    { key: "google_analytics_id", value: "" },
    { key: "meta_title_fr", value: "Kelenix - L'intelligence au service de l'innovation mondiale" },
    { key: "meta_title_en", value: "Kelenix - Intelligence in service of global innovation" },
    { key: "meta_description_fr", value: "Kelenix accompagne les entreprises dans leur transformation numérique grâce à des solutions technologiques innovantes : développement logiciel, IA, applications web et mobile." },
    { key: "meta_description_en", value: "Kelenix supports businesses in their digital transformation through innovative technology solutions: software development, AI, web and mobile applications." },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // About page settings
  const aboutSettings = [
    { key: "about_story_fr", value: "Kelenix est née en 2019 de la vision d'un groupe de développeurs passionnés souhaitant créer une entreprise tech internationale capable d'accompagner les entreprises dans leur transformation numérique. Depuis notre création, nous avons livré plus de 150 projets dans 20 pays, en aidant des PME, des startups et des grands groupes à tirer parti de la technologie pour croître et innover." },
    { key: "about_story_en", value: "Kelenix was born in 2019 from the vision of a group of passionate developers who wanted to create an international tech company capable of supporting businesses in their digital transformation. Since our founding, we have delivered more than 150 projects in 20 countries, helping SMEs, startups and large corporations leverage technology to grow and innovate." },
    { key: "about_mission_fr", value: "Accompagner les entreprises dans leur transformation numérique en développant des solutions technologiques innovantes, fiables et accessibles qui créent une valeur durable." },
    { key: "about_mission_en", value: "Support businesses in their digital transformation by developing innovative, reliable and accessible technology solutions that create lasting value." },
    { key: "about_vision_fr", value: "Être le partenaire technologique de référence pour les entreprises qui souhaitent innover et se transformer à l'ère du numérique, reconnu pour l'excellence de nos solutions et la qualité de notre accompagnement." },
    { key: "about_vision_en", value: "To be the reference technology partner for companies that want to innovate and transform in the digital era, recognized for the excellence of our solutions and the quality of our support." },
    { key: "about_values_fr", value: "Excellence technique\nInnovation continue\nIntégrité et transparence\nOrientation client\nCollaboration et esprit d'équipe" },
    { key: "about_values_en", value: "Technical excellence\nContinuous innovation\nIntegrity and transparency\nClient focus\nCollaboration and team spirit" },
  ];

  for (const setting of aboutSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Job Postings
  const jobs = [
    {
      titleFr: "Développeur Full Stack Senior",
      titleEn: "Senior Full Stack Developer",
      descFr: "<p>Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe et travailler sur des projets technologiques innovants pour nos clients internationaux.</p><h3>Compétences requises</h3><ul><li>5+ ans d'expérience en développement web</li><li>Maîtrise de React/Next.js et Node.js</li><li>Expertise bases de données (PostgreSQL, MySQL)</li><li>Expérience avec les architectures cloud (AWS, GCP)</li><li>Connaissance des pratiques DevOps</li></ul>",
      descEn: "<p>We are looking for an experienced Full Stack developer to join our team and work on innovative technology projects for our international clients.</p><h3>Required skills</h3><ul><li>5+ years of web development experience</li><li>Proficiency in React/Next.js and Node.js</li><li>Database expertise (PostgreSQL, MySQL)</li><li>Experience with cloud architectures (AWS, GCP)</li><li>Knowledge of DevOps practices</li></ul>",
      location: "Paris (Remote possible)",
      contractType: "CDI",
    },
    {
      titleFr: "Ingénieur IA / Data Scientist",
      titleEn: "AI Engineer / Data Scientist",
      descFr: "<p>Nous cherchons un expert en IA et machine learning pour développer des solutions innovantes basées sur l'intelligence artificielle pour nos clients.</p><h3>Compétences requises</h3><ul><li>3+ ans d'expérience en ML/DL</li><li>Maîtrise de Python, TensorFlow, PyTorch</li><li>Expérience avec les LLM et RAG</li><li>Connaissance du MLOps</li></ul>",
      descEn: "<p>We are looking for an AI and machine learning expert to develop innovative AI-based solutions for our clients.</p><h3>Required skills</h3><ul><li>3+ years of ML/DL experience</li><li>Proficiency in Python, TensorFlow, PyTorch</li><li>Experience with LLMs and RAG</li><li>Knowledge of MLOps</li></ul>",
      location: "Paris (Hybride)",
      contractType: "CDI",
    },
    {
      titleFr: "Développeur Mobile React Native",
      titleEn: "React Native Mobile Developer",
      descFr: "<p>Rejoignez notre équipe mobile pour créer des applications iOS et Android performantes et intuitives.</p><h3>Compétences requises</h3><ul><li>2+ ans d'expérience React Native</li><li>Connaissance Swift/Kotlin est un plus</li><li>Expérience Expo et Firebase</li></ul>",
      descEn: "<p>Join our mobile team to create high-performance and intuitive iOS and Android applications.</p><h3>Required skills</h3><ul><li>2+ years of React Native experience</li><li>Knowledge of Swift/Kotlin is a plus</li><li>Expo and Firebase experience</li></ul>",
      location: "Remote",
      contractType: "Freelance",
    },
  ];

  for (const job of jobs) {
    const existing = await prisma.jobPosting.findFirst({ where: { titleFr: job.titleFr } });
    if (!existing) {
      await prisma.jobPosting.create({ data: job });
    }
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
