// Limites des champs longs du devis, partagées entre le formulaire et l'API
// pour que le client ne laisse jamais passer ce que le serveur refusera.
export const QUOTE_LIMITS = {
  descMin: 10,
  descMax: 20_000,
  goalsMax: 10_000,
} as const;
