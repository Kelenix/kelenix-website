// Pays proposés dans la prospection (codes ISO 3166-1 à deux lettres) : France et Italie d'abord,
// puis l'Europe francophone, l'Afrique francophone et quelques grands marchés.
// Les noms sont écrits ici plutôt que calculés, pour être identiques sur le serveur et dans le navigateur.
export const COUNTRIES: Record<string, string> = {
  FR: "France",
  IT: "Italie",
  BE: "Belgique",
  CH: "Suisse",
  LU: "Luxembourg",
  MC: "Monaco",
  CA: "Canada",
  CM: "Cameroun",
  CI: "Côte d'Ivoire",
  SN: "Sénégal",
  GA: "Gabon",
  CG: "Congo-Brazzaville",
  CD: "RD Congo",
  BJ: "Bénin",
  TG: "Togo",
  BF: "Burkina Faso",
  ML: "Mali",
  NE: "Niger",
  TD: "Tchad",
  GN: "Guinée",
  MG: "Madagascar",
  MA: "Maroc",
  TN: "Tunisie",
  DZ: "Algérie",
  GB: "Royaume-Uni",
  US: "États-Unis",
  DE: "Allemagne",
  ES: "Espagne",
  PT: "Portugal",
  NL: "Pays-Bas",
};

/** Nom du pays, ou le code lui-même pour un pays hors de la liste (trouvé par l'agent, par exemple). */
export const countryName = (code: string) => COUNTRIES[code] ?? code;

/** « Turin, Italie » : ce qu'on affiche pour situer une entreprise. */
export const placeLabel = (city: string | null, country: string | null) => [city, country && countryName(country)].filter(Boolean).join(", ");

const ENGLISH = ["GB", "US", "DE", "ES", "PT", "NL"];

/** Langue dans laquelle on écrit par défaut à une entreprise de ce pays. */
export const countryLanguage = (code: string): "fr" | "it" | "en" => (code === "IT" ? "it" : ENGLISH.includes(code) ? "en" : "fr");

/** Code pays valide (deux lettres majuscules), ou null. */
export const normalizeCountry = (value: string | null | undefined) => {
  const code = value?.trim().toUpperCase() ?? "";
  return /^[A-Z]{2}$/.test(code) ? code : null;
};
