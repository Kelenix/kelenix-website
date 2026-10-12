// Choix d'une demande de devis, partagés entre l'assistant IA et les e-mails.
// Le formulaire de devis propose les mêmes valeurs, avec ses icônes.
export const QUOTE_SERVICES = [
  { value: "software", fr: "Développement Logiciel", en: "Software Development" },
  { value: "web", fr: "Site Web", en: "Website" },
  { value: "webapp", fr: "Application Web", en: "Web App" },
  { value: "mobile", fr: "App Mobile", en: "Mobile App" },
  { value: "ai", fr: "Intelligence Artificielle", en: "AI Solution" },
  { value: "consulting", fr: "Consulting IT", en: "IT Consulting" },
  { value: "training", fr: "Formation", en: "Training" },
  { value: "other", fr: "Autre", en: "Other" },
] as const;

export const QUOTE_BUDGETS = ["< 1 000€", "1 000€ – 5 000€", "5 000€ – 10 000€", "10 000€ – 50 000€", "> 50 000€"] as const;

export const QUOTE_DEADLINES = {
  fr: ["Urgent (< 1 mois)", "1 – 3 mois", "3 – 6 mois", "6 – 12 mois", "Pas de contrainte"],
  en: ["Urgent (< 1 month)", "1 – 3 months", "3 – 6 months", "6 – 12 months", "No constraint"],
} as const;

/** Intitulé français d'un type de service (« webapp » → « Application Web »). */
export const quoteServiceLabel = (value: string) => QUOTE_SERVICES.find((service) => service.value === value)?.fr ?? value;
