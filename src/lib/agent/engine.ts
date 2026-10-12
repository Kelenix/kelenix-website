import { randomUUID } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { anthropic } from "./client";
import { AGENT_LIMITS } from "./config";
import { LEAD_TOOL, leadTool, parseLead } from "./lead";
import { buildSystemPrompt } from "./prompt";
import { getTenant } from "./tenants";
import { AgentError, type AgentEvent, type Locale, type Tenant } from "./types";

type Message = Anthropic.Beta.BetaMessageParam;
type Block = Anthropic.Beta.BetaContentBlock;

// Réponse + réflexion du modèle (la réflexion compte dans la limite même si son texte n'est pas renvoyé).
const MAX_TOKENS = 8000;
// Appels au modèle par message du visiteur : la réponse, plus un appel après chaque enregistrement.
const MAX_STEPS = 4;
// Modèles pour lesquels l'API sait relancer sur un autre modèle une demande refusée par ses filtres.
const SERVER_FALLBACK = new Set(["claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5", "claude-fable-5-1"]);

// Une conversation ne traite qu'un message à la fois (deux onglets, double clic…).
const running = new Set<string>();

type Conversation = { id: string; system: string; messages: Message[]; turns: number; quoteId: string | null; isNew: boolean };

async function openConversation(tenant: Tenant, id: string | null, locale: Locale): Promise<Conversation> {
  if (id) {
    const saved = await prisma.agentConversation.findFirst({ where: { id, tenant: tenant.id } });
    if (!saved) throw new AgentError("expired");
    return { id, system: saved.system, messages: saved.messages as unknown as Message[], turns: saved.turns, quoteId: saved.quoteId, isNew: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const opened = await prisma.agentConversation.count({ where: { tenant: tenant.id, createdAt: { gte: today } } });
  if (opened >= AGENT_LIMITS.dailyConversations) {
    console.error(`[agent] Plafond quotidien atteint (${opened} conversations) : assistant suspendu jusqu'à demain.`);
    throw new AgentError("unavailable");
  }
  // Les consignes sont figées ici pour toute la conversation : l'API refuse qu'un échange déjà
  // commencé soit rejoué avec un début différent (un service modifié dans l'admin, par exemple).
  const system = buildSystemPrompt(await tenant.loadKnowledge(locale), tenant.leadOptions(locale), locale);
  return { id: randomUUID(), system, messages: [], turns: 0, quoteId: null, isNew: true };
}

// Quand l'API a basculé sur un modèle de repli en cours de réponse, elle demande de ne pas lui renvoyer
// la réflexion ni les appels d'outil produits avant le dernier marqueur « fallback ».
function echoable(content: Block[]): Block[] {
  const boundary = content.map((block) => block.type).lastIndexOf("fallback");
  if (boundary === -1) return content;
  return content.filter((block, index) => index > boundary || !["thinking", "redacted_thinking", "tool_use"].includes(block.type));
}

/**
 * Traite un message du visiteur : diffuse la réponse au fil de l'eau, enregistre la demande quand
 * l'assistant la transmet, puis sauvegarde la conversation. Lève AgentError pour les cas prévus.
 */
export async function runTurn(
  input: { tenantId: string; conversationId: string | null; message: string; locale: Locale; page: string | null },
  emit: (event: AgentEvent) => void
) {
  const tenant = getTenant(input.tenantId);
  const conversation = await openConversation(tenant, input.conversationId, input.locale);
  if (conversation.turns >= AGENT_LIMITS.turnsMax) throw new AgentError("limit");
  if (running.has(conversation.id)) throw new AgentError("busy");
  running.add(conversation.id);

  const options = tenant.leadOptions(input.locale);
  const tools = [leadTool(options, input.locale)];
  const messages: Message[] = [...conversation.messages, { role: "user", content: input.message }];
  let quoteId = conversation.quoteId;
  // Vrai dès qu'une réponse du modèle est acquise : la conversation mérite alors d'être sauvegardée,
  // même si un appel suivant échoue (sinon une demande déjà enregistrée serait créée en double).
  let progressed = false;
  let failure: unknown = null;

  try {
    for (let step = 0, jsonRetries = 0; step < MAX_STEPS; step++) {
      let wrote = false;
      const stream = anthropic().beta.messages.stream({
        model: tenant.model,
        max_tokens: MAX_TOKENS,
        // Peu de réflexion : la réponse doit commencer vite dans une fenêtre de discussion.
        output_config: { effort: "low" },
        system: [{ type: "text", text: conversation.system, cache_control: { type: "ephemeral" } }],
        tools,
        messages,
        ...(SERVER_FALLBACK.has(tenant.model) ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      });
      stream.on("text", (text) => {
        wrote = true;
        emit({ type: "text", text });
      });

      let response: Anthropic.Beta.BetaMessage;
      try {
        response = await stream.finalMessage();
      } catch (error) {
        // Une entrée d'outil illisible fait échouer la lecture : on rejoue l'appel, deux fois au plus.
        if (error instanceof Anthropic.APIError || jsonRetries++ >= 2) throw error;
        step--;
        continue;
      }

      if (response.stop_reason === "refusal") throw new AgentError("refused");

      const content = echoable(response.content);
      messages.push({ role: "assistant", content });
      progressed = true;

      const calls = content.filter((block): block is Anthropic.Beta.BetaToolUseBlock => block.type === "tool_use");
      // Un appel d'outil coupé par la limite de longueur peut sembler valide : on ne l'exécute pas.
      if (calls.length === 0 || response.stop_reason !== "tool_use") break;

      const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const call of calls) {
        const parsed = call.name === LEAD_TOOL ? parseLead(call.input, options, input.locale) : { error: `Outil inconnu : ${call.name}` };
        if ("error" in parsed) {
          results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: parsed.error });
          continue;
        }
        try {
          const isUpdate = quoteId !== null;
          quoteId = await tenant.saveLead(parsed.lead, quoteId);
          if (!isUpdate) emit({ type: "lead" });
          results.push({ type: "tool_result", tool_use_id: call.id, content: isUpdate ? "Demande mise à jour." : "Demande enregistrée, l'équipe est prévenue." });
        } catch (error) {
          console.error("[agent] Enregistrement de la demande impossible :", error);
          results.push({
            type: "tool_result",
            tool_use_id: call.id,
            is_error: true,
            content: "Enregistrement impossible pour le moment. Invite le visiteur à utiliser les moyens de contact.",
          });
        }
      }
      messages.push({ role: "user", content: results });
      // Le texte de l'appel suivant ne doit pas se coller à celui-ci.
      if (wrote) emit({ type: "text", text: "\n\n" });
    }
  } catch (error) {
    failure = error;
  }

  try {
    if (progressed) {
      const history = messages as unknown as Prisma.InputJsonValue;
      await prisma.agentConversation.upsert({
        where: { id: conversation.id },
        create: { id: conversation.id, tenant: tenant.id, locale: input.locale, system: conversation.system, messages: history, turns: 1, quoteId, page: input.page },
        update: { messages: history, turns: { increment: 1 }, quoteId },
      });
    }
  } finally {
    running.delete(conversation.id);
  }

  if (failure) {
    // Historique rejeté par l'API sur une conversation en cours : la fenêtre en ouvrira une nouvelle.
    if (failure instanceof Anthropic.BadRequestError && !conversation.isNew) {
      console.error("[agent] Conversation rejetée par l'API :", failure.message);
      throw new AgentError("expired");
    }
    throw failure;
  }
  emit({ type: "done", conversationId: conversation.id });
}
