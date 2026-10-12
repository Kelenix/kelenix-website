import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { prepareOutreach, type OutreachLanguage } from "./outreach";
import { getTenant } from "./tenants";

// Prospects de l'agent sortant : préparation d'un brouillon et messages d'échec.

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
      data: {
        status: "READY",
        summary: draft.summary,
        angle: draft.angle,
        emailFound: draft.emailFound,
        // Le téléphone lu sur le site complète la fiche, sans remplacer un numéro déjà saisi.
        ...(!prospect.phone && draft.phoneFound && { phone: draft.phoneFound }),
        subject: draft.subject,
        body: draft.body,
        error: null,
      },
    });
  } catch (error) {
    console.error("[agent] Préparation du prospect impossible :", error);
    // Le prospect a pu être supprimé entre-temps : l'échec de cette écriture n'a pas d'importance.
    await prisma.prospect.update({ where: { id }, data: { status: "FAILED", error: failureMessage(error) } }).catch(() => {});
  }
}
