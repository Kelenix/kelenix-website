import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { prepareOutreach, type OutreachLanguage } from "./outreach";
import { getTenant } from "./tenants";

// Prospects de l'agent sortant : mise au propre de ce que l'équipe saisit, et préparation d'un brouillon.

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

/** Nom de domaine sans « www. », pour repérer deux fois la même entreprise. */
export const websiteHost = (website: string | null) => (website ? new URL(website).hostname.replace(/^www\./, "") : null);

// Message montré dans l'admin quand l'agent échoue (préparation d'un brouillon, recherche d'entreprises).
export function failureMessage(error: unknown) {
  if (error instanceof Anthropic.AuthenticationError) return "Clé d'API Claude refusée : vérifiez ANTHROPIC_API_KEY.";
  if (error instanceof Anthropic.RateLimitError) return "Trop de demandes à la fois : réessayez dans une minute.";
  if (error instanceof Anthropic.APIConnectionError) return "Claude n'a pas répondu à temps : réessayez.";
  if (error instanceof Anthropic.APIError) return `Erreur de l'API Claude (${error.status}) : ${error.message}`.slice(0, 400);
  return error instanceof Error ? error.message.slice(0, 400) : "Erreur inconnue.";
}

/**
 * Fait lire le site du prospect à l'agent et enregistre le brouillon. Lancée après la réponse HTTP
 * (elle dure de 20 à 60 secondes) : le résultat, ou l'échec, se lit dans l'état du prospect.
 */
export async function prepareProspect(id: string, senderName: string) {
  const prospect = await prisma.prospect.findUnique({ where: { id } });
  if (!prospect) return;
  try {
    const tenant = getTenant(prospect.tenant);
    const company = await tenant.loadKnowledge("fr");
    const draft = await prepareOutreach({
      model: tenant.model,
      company,
      sender: { name: senderName, company: company.name, website: tenant.website },
      target: {
        company: prospect.company,
        website: prospect.website,
        contactName: prospect.contactName,
        notes: prospect.notes,
        language: prospect.language as OutreachLanguage,
      },
    });
    await prisma.prospect.update({
      where: { id },
      data: { status: "READY", summary: draft.summary, angle: draft.angle, emailFound: draft.emailFound, subject: draft.subject, body: draft.body, error: null },
    });
  } catch (error) {
    console.error("[agent] Préparation du prospect impossible :", error);
    // Le prospect a pu être supprimé entre-temps : l'échec de cette écriture n'a pas d'importance.
    await prisma.prospect.update({ where: { id }, data: { status: "FAILED", error: failureMessage(error) } }).catch(() => {});
  }
}
