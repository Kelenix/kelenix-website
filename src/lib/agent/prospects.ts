import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { MAX_FOLLOW_UPS, sentHistory } from "./followup";
import { prepareFollowUp, prepareOutreach, type OutreachLanguage } from "./outreach";
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
 * Prépare le brouillon d'un prospect et l'enregistre : le premier e-mail (l'agent lit le site) tant que
 * rien n'a été envoyé, une relance ensuite. Lancée après la réponse HTTP (elle dure jusqu'à une minute) :
 * le résultat, ou l'échec, se lit dans l'état du prospect.
 */
export async function prepareProspect(id: string, senderName: string) {
  const prospect = await prisma.prospect.findUnique({ where: { id } });
  if (!prospect) return;
  const sent = sentHistory(prospect);
  try {
    const tenant = getTenant(prospect.tenant);
    const company = await tenant.loadKnowledge("fr");
    const sender = { name: senderName, company: company.name, website: tenant.website };
    const target = {
      company: prospect.company,
      website: prospect.website,
      contactName: prospect.contactName,
      notes: prospect.notes,
      language: prospect.language as OutreachLanguage,
    };

    if (sent.length > 0) {
      const draft = await prepareFollowUp({ model: tenant.model, company, sender, target, summary: prospect.summary, angle: prospect.angle, sent, last: sent.length >= MAX_FOLLOW_UPS });
      await prisma.prospect.update({ where: { id }, data: { status: "READY", subject: draft.subject, body: draft.body, error: null } });
      return;
    }

    const draft = await prepareOutreach({ model: tenant.model, company, sender, target });
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
    // Une relance qui échoue laisse le prospect « envoyé » : son premier e-mail est bien parti.
    // Le prospect a pu être supprimé entre-temps : l'échec de cette écriture n'a pas d'importance.
    await prisma.prospect.update({ where: { id }, data: { status: sent.length > 0 ? "SENT" : "FAILED", error: failureMessage(error) } }).catch(() => {});
  }
}
