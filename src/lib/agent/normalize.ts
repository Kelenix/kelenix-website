import { z } from "zod";

// Mise au propre des coordonnées d'un prospect, qu'elles soient saisies par l'équipe ou trouvées par l'agent.

/** « exemple.fr » → « https://exemple.fr ». null si ce n'est pas une adresse de site publique. */
export function normalizeWebsite(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function normalizeEmail(value: string | null | undefined): string | null {
  const parsed = z.string().trim().toLowerCase().email().safeParse(value ?? "");
  return parsed.success ? parsed.data : null;
}

/** Numéro de téléphone tel qu'il est écrit, s'il en a la forme (6 à 16 chiffres) ; null sinon. */
export function normalizePhone(value: string | null | undefined): string | null {
  const raw = value?.trim() ?? "";
  const digits = raw.replace(/\D/g, "").length;
  return /^[+(\d][\d\s()./-]*$/.test(raw) && digits >= 6 && digits <= 16 ? raw : null;
}

/** Nom de domaine sans « www. », pour repérer deux fois la même entreprise. */
export const websiteHost = (website: string | null) => (website ? new URL(website).hostname.replace(/^www\./, "") : null);
