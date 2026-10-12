// Relances de prospection : ce qui a déjà été envoyé à une entreprise, et quand la relancer.
// Fichier sans accès à la base, partagé entre le serveur et l'écran.

export type SentEmail = { subject: string; body: string; sentAt: string };

/** Relances possibles après le premier e-mail. Au-delà, insister nuit plus qu'il ne sert. */
export const MAX_FOLLOW_UPS = 2;
/** Jours sans réponse avant de proposer une relance. */
export const FOLLOW_UP_AFTER_DAYS = 4;

type Sendable = { status: string; subject: string | null; body: string | null; sentAt: Date | string | null; sentEmails: unknown };

const AFTER_SENDING = ["SENT", "REPLIED", "DECLINED", "DO_NOT_CONTACT"];

/** Messages déjà envoyés à ce prospect, du plus ancien au plus récent. */
export function sentHistory(prospect: Sendable): SentEmail[] {
  const stored = Array.isArray(prospect.sentEmails) ? (prospect.sentEmails as SentEmail[]).filter((email) => typeof email?.body === "string") : [];
  if (stored.length) return stored;
  // Prospect marqué « envoyé » avant l'arrivée des relances : son brouillon est le message qui est parti.
  const { subject, body, sentAt } = prospect;
  return subject && body && sentAt && AFTER_SENDING.includes(prospect.status) ? [{ subject, body, sentAt: new Date(sentAt).toISOString() }] : [];
}

export const followUpsSent = (prospect: Sendable) => Math.max(sentHistory(prospect).length - 1, 0);

export const daysSince = (date: Date | string) => Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);

/** Envoyé, sans réponse depuis assez longtemps, et il reste une relance possible. */
export const followUpDue = (prospect: Sendable) =>
  prospect.status === "SENT" && prospect.sentAt !== null && daysSince(prospect.sentAt) >= FOLLOW_UP_AFTER_DAYS && followUpsSent(prospect) < MAX_FOLLOW_UPS;
