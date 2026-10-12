// Assistant IA du site : il répond aux visiteurs, qualifie leur besoin et transmet la demande à l'équipe.
// Le moteur ne sait rien de Kelenix : chaque entreprise servie (« tenant ») fournit ses connaissances,
// ses choix de qualification et sa façon d'enregistrer une demande.

export type Locale = "fr" | "en";

/** Ce que l'assistant sait d'une entreprise. */
export type CompanyKnowledge = {
  name: string;
  /** Une ou deux phrases : ce que fait l'entreprise. */
  pitch: string;
  /** Faits vérifiés que l'assistant peut citer (année de création, délai de réponse…). */
  facts: string[];
  services: { title: string; summary: string }[];
  faq: { question: string; answer: string }[];
  /** Moyens de joindre l'équipe, déjà rédigés (« WhatsApp : https://… »). */
  contacts: string[];
};

/** Valeurs entre lesquelles l'assistant classe une demande. */
export type LeadOptions = {
  categories: { value: string; label: string }[];
  budgets: string[];
  timelines: string[];
};

/** Demande recueillie par l'assistant. Les champs facultatifs valent "" quand le visiteur ne les a pas donnés. */
export type Lead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  title: string;
  need: string;
  goals: string;
  budget: string;
  timeline: string;
};

export type Tenant = {
  id: string;
  /** Modèle Claude utilisé pour cette entreprise. */
  model: string;
  leadOptions(locale: Locale): LeadOptions;
  loadKnowledge(locale: Locale): Promise<CompanyKnowledge>;
  /** Enregistre la demande, ou met à jour celle déjà créée dans la conversation. Renvoie son identifiant. */
  saveLead(lead: Lead, existingId: string | null): Promise<string>;
};

/** Ce que le serveur envoie à la fenêtre de discussion, une ligne JSON par événement. */
export type AgentEvent =
  | { type: "text"; text: string }
  | { type: "lead" }
  | { type: "done"; conversationId: string }
  | { type: "error"; code: AgentErrorCode };

export type AgentErrorCode = "unavailable" | "busy" | "refused" | "limit" | "expired";

export class AgentError extends Error {
  constructor(public code: AgentErrorCode) {
    super(code);
  }
}
