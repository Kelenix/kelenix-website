// =============================================================================
// Données Chariow — boutique eBookDev
// Instantané réel récupéré depuis l'API Chariow (produits, avis, ventes, promo).
// Pour un affichage 100 % live, ces données peuvent être servies par une route
// API branchée sur la clé API Chariow du store. Ici : snapshot statique fiable.
// =============================================================================

export const STORE_URL = "https://ebookdev.mychariow.shop";

export const productUrl = (slug: string) => `${STORE_URL}/${slug}`;

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number; // prix normal ($)
  sale: number; // prix effectif ($)
  image: string;
  popular?: boolean;
};

// Produits phares (vrais produits, prix et visuels réels)
export const products: Product[] = [
  {
    slug: "masterclass-java",
    name: "Masterclass Java — De zéro à Développeur Sénior",
    category: "Formation",
    price: 18,
    sale: 5,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50/https://assets.chariowcdn.com/assets/store_2karn31h55qs/s2V8GbYJx4BxRhSmBdwbcGNNcnvjXyxMd0jbqUsw.png",
    popular: true,
  },
  {
    slug: "prompt-ingegnering",
    name: "Prompt Engineering — La Formation Complète 2026",
    category: "IA",
    price: 17,
    sale: 6,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50/https://assets.chariowcdn.com/assets/store_2karn31h55qs/FRhspT11xoooFKs3yPaXpO0eW567dnY6H14Wst4c.png",
    popular: true,
  },
  {
    slug: "formation-html-complet",
    name: "Formation complète en HTML — De Débutant à Autonome",
    category: "Web",
    price: 15,
    sale: 14,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50,width=600,height=600/https://assets.chariowcdn.com/thumbnail_pictures/vwsmp1prFSp0FYEpFN36s1EvKsskG9Lm4QaZP46b.png",
  },
  {
    slug: "expert-en-base-de-donne",
    name: "Créer et Gérer ses Bases de Données avec SQL",
    category: "Data",
    price: 9,
    sale: 8,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50/https://assets.chariowcdn.com/assets/store_2karn31h55qs/finMisLx43bAt3XqjxOQisDUOHq1IfJrLyJkjC9z.png",
  },
  {
    slug: "git-pour-les-developpeurs",
    name: "Git pour les développeurs : Versionner comme un pro",
    category: "DevOps",
    price: 10,
    sale: 9,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50,width=600,height=600/https://assets.chariowcdn.com/thumbnail_pictures/Nx5YIy9m4TMiJgLskFuITfrfzvi8Eeh80bXiDIal.png",
  },
  {
    slug: "python-pour-les-developpeurs-juniors",
    name: "Python pour les développeurs juniors",
    category: "Python",
    price: 5,
    sale: 5,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50,width=600,height=600/https://assets.chariowcdn.com/thumbnail_pictures/mADqJz5OZc0IXwzJ3QvD4pS1VKLjmVyYDws7SRmW.png",
  },
  {
    slug: "affiliation",
    name: "L'Affiliation sur Chariow — Gagner de l'argent en recommandant",
    category: "Business",
    price: 20,
    sale: 6,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50/https://assets.chariowcdn.com/assets/store_2karn31h55qs/j5BE0FL6DvZ6JzpvZkePRqwuGB2y4MzuZ5VkXivj.png",
  },
  {
    slug: "objectif-mention",
    name: "Oubliez l'Échec : Flashcards & Répétition Espacée",
    category: "Productivité",
    price: 17,
    sale: 6,
    image:
      "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50/https://assets.chariowcdn.com/assets/store_2karn31h55qs/IGmxyslEaT1BVz7s5hbxkvxFRKXmM1E700IbgmcX.png",
  },
];

// Promo active réelle : 10 % sur toute la boutique
export const promo = {
  code: "BIENVENUE10",
  percent: 10,
};

// Preuve sociale : vrais achats & avis (prénom + pays seulement = respect vie privée)
export type ProofItem =
  | { type: "purchase"; name: string; country: string; flag: string; product: string; when: string }
  | { type: "review"; name: string; country: string; flag: string; product: string; comment: string; when: string };

export const proofItems: ProofItem[] = [
  { type: "purchase", name: "Leo", country: "Italie", flag: "🇮🇹", product: "Masterclass Java", when: "il y a 2 h" },
  {
    type: "review",
    name: "Hugues",
    country: "Burkina Faso",
    flag: "🇧🇫",
    product: "Bases de Données SQL",
    comment: "Un livre très riche et très bien expliqué, je le recommande aux débutants.",
    when: "il y a 1 j",
  },
  { type: "purchase", name: "Gregory", country: "Madagascar", flag: "🇲🇬", product: "Masterclass Java", when: "il y a 5 h" },
  {
    type: "review",
    name: "Leo",
    country: "Italie",
    flag: "🇮🇹",
    product: "Masterclass Java",
    comment: "Très instructif. Merci !",
    when: "il y a 3 j",
  },
  { type: "purchase", name: "Sam", country: "Bénin", flag: "🇧🇯", product: "Masterclass Java", when: "il y a 8 h" },
];
