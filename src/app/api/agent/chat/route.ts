import { headers } from "next/headers";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { AGENT_LIMITS, agentConfigured } from "@/lib/agent/config";
import { runTurn } from "@/lib/agent/engine";
import { DEFAULT_TENANT } from "@/lib/agent/tenants";
import { AgentError, type AgentEvent } from "@/lib/agent/types";

const schema = z.object({
  conversationId: z.string().uuid().nullish(),
  message: z.string().trim().min(1).max(AGENT_LIMITS.messageMax),
  locale: z.enum(["fr", "en"]),
  page: z.string().max(200).nullish(),
});

// Un message du visiteur → la réponse de l'assistant, diffusée au fil de l'eau :
// une ligne JSON par événement (texte, demande enregistrée, fin, erreur).
export async function POST(request: Request) {
  if (!agentConfigured()) return Response.json({ error: "Assistant non configuré" }, { status: 503 });

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`agent:${ip}`, 12, 60_000) || !rateLimit(`agent-hour:${ip}`, 80, 3_600_000)) {
    return Response.json({ error: "Trop de messages" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Données invalides" }, { status: 400 });
  const { conversationId, message, locale, page } = parsed.data;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Si le visiteur ferme la fenêtre, l'envoi échoue mais le tour va au bout et reste enregistré.
      const emit = (event: AgentEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {}
      };
      try {
        await runTurn({ tenantId: DEFAULT_TENANT, conversationId: conversationId ?? null, message, locale, page: page ?? null }, emit);
      } catch (error) {
        if (!(error instanceof AgentError)) console.error("[agent]", error);
        emit({ type: "error", code: error instanceof AgentError ? error.code : "unavailable" });
      }
      try {
        controller.close();
      } catch {}
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      // Demande à nginx de ne pas retenir la réponse : le texte doit arriver au fur et à mesure.
      "X-Accel-Buffering": "no",
    },
  });
}
