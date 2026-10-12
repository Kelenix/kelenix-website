import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { QUOTE_LIMITS } from "@/lib/quote-limits";
import type { Lead, LeadOptions, Locale } from "./types";

export const LEAD_TOOL = "save_lead";

/** Valeur enregistrée quand le visiteur n'a pas donné de budget ou de délai. */
export const UNSPECIFIED: Record<Locale, string> = { fr: "Non précisé", en: "Not specified" };

// Outil par lequel l'assistant transmet une demande à l'équipe. Sa définition doit rester identique
// pendant toute une conversation : elle ne dépend que des choix fixes de l'entreprise.
export function leadTool(options: LeadOptions, locale: Locale): Anthropic.Beta.BetaTool {
  const text = (description: string) => ({ type: "string", description });
  const choice = (values: string[], description: string) => ({ type: "string", enum: values, description });
  const unspecified = UNSPECIFIED[locale];

  return {
    name: LEAD_TOOL,
    description:
      "Transmet la demande du visiteur à l'équipe pour qu'elle le recontacte. À appeler dès que le besoin, le prénom et l'e-mail sont connus. " +
      "Si le visiteur corrige ou complète une information ensuite, rappeler l'outil avec la fiche complète : la demande existante est mise à jour. " +
      "Les textes se rédigent dans la langue de la conversation, à partir de ce que le visiteur a dit, sans rien inventer.",
    // Entrée diffusée au fil de l'eau : l'API ne la valide plus, parseLead s'en charge.
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        first_name: text("Prénom du visiteur."),
        last_name: text("Nom de famille, ou chaîne vide s'il ne l'a pas donné."),
        email: text("Adresse e-mail du visiteur, telle qu'il l'a écrite."),
        phone: text("Téléphone, ou chaîne vide."),
        company: text("Entreprise ou organisation, ou chaîne vide."),
        category: choice(
          options.categories.map((category) => category.value),
          `Type de prestation. ${options.categories.map((category) => `${category.value} = ${category.label}`).join(" ; ")}.`
        ),
        title: text("Nom court du projet, en trois à huit mots."),
        need: text("Le besoin, rédigé pour l'équipe : contexte, ce qu'il faut réaliser, pour qui, contraintes connues."),
        goals: text("Résultats attendus par le visiteur, ou chaîne vide s'il n'en a pas parlé."),
        budget: choice([...options.budgets, unspecified], `Fourchette de budget, ou « ${unspecified} ».`),
        timeline: choice([...options.timelines, unspecified], `Délai souhaité, ou « ${unspecified} ».`),
      },
      required: ["first_name", "last_name", "email", "phone", "company", "category", "title", "need", "goals", "budget", "timeline"],
      additionalProperties: false,
    },
  };
}

// Contrôle ce que le modèle a transmis. En cas d'erreur, le texte renvoyé lui est redonné pour qu'il corrige
// (une adresse e-mail mal saisie, par exemple, est redemandée au visiteur).
export function parseLead(input: unknown, options: LeadOptions, locale: Locale): { lead: Lead } | { error: string } {
  const oneOf = (values: string[]) => z.string().refine((value) => values.includes(value), { message: `must be one of: ${values.join(" | ")}` });
  const schema = z.object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().max(100),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(30),
    company: z.string().trim().max(200),
    category: oneOf(options.categories.map((category) => category.value)),
    title: z.string().trim().min(1).max(200),
    need: z.string().trim().min(QUOTE_LIMITS.descMin).max(QUOTE_LIMITS.descMax),
    goals: z.string().trim().max(QUOTE_LIMITS.goalsMax),
    budget: oneOf([...options.budgets, UNSPECIFIED[locale]]),
    timeline: oneOf([...options.timelines, UNSPECIFIED[locale]]),
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: `Demande non enregistrée. ${parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" ; ")}` };
  }
  const { first_name, last_name, ...rest } = parsed.data;
  return { lead: { firstName: first_name, lastName: last_name, ...rest } };
}
