/** L'assistant ne s'affiche que si le serveur a de quoi appeler l'API Claude. */
export const agentConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

// Garde-fous : la route est publique et chaque réponse coûte de l'argent.
export const AGENT_LIMITS = {
  /** Longueur maximale d'un message de visiteur. */
  messageMax: 2000,
  /** Messages du visiteur par conversation. */
  turnsMax: 30,
  /** Nouvelles conversations par jour, toutes origines confondues. */
  dailyConversations: Number(process.env.AGENT_DAILY_CONVERSATIONS) || 300,
} as const;
