import type { Prisma } from "@prisma/client";

/** Âge, en jours, à partir duquel une conversation de l'assistant restée sans demande peut être supprimée. */
export const STALE_CONVERSATION_DAYS = 30;

// Conversations de l'assistant qui n'ont plus d'utilité : aucune demande de devis n'en est sortie
// et elles n'ont pas bougé depuis un mois. Celles qui ont produit un devis sont gardées avec lui.
export const staleConversations = (): Prisma.AgentConversationWhereInput => ({
  quoteId: null,
  updatedAt: { lt: new Date(Date.now() - STALE_CONVERSATION_DAYS * 86_400_000) },
});
