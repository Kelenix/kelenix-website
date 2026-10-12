import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { agentConfigured } from "@/lib/agent/config";
import { normalizeCountry } from "@/lib/agent/countries";
import { findCompanies, type DiscoveryEvent } from "@/lib/agent/discovery";
import { websiteHost } from "@/lib/agent/normalize";
import { failureMessage } from "@/lib/agent/prospects";
import { DEFAULT_TENANT, getTenant } from "@/lib/agent/tenants";

const schema = z.object({
  target: z.string().trim().min(3).max(1000),
  country: z.string().nullish(),
  city: z.string().trim().max(100).nullish(),
  requireEmail: z.boolean().default(false),
  requirePhone: z.boolean().default(false),
  count: z.number().int().min(3).max(15),
});

// Recherche d'entreprises à partir d'une cible. Elle dure de 20 à 90 secondes : la réponse est diffusée
// au fil de l'eau (chaque recherche lancée, puis la liste), ce qui évite aussi qu'un serveur
// intermédiaire coupe une connexion restée muette. Rien n'est ajouté à la liste de prospection ici.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!agentConfigured()) return NextResponse.json({ error: "Clé d'API Claude absente sur le serveur (ANTHROPIC_API_KEY)." }, { status: 503 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Indiquez le type d'entreprise recherché." }, { status: 400 });
  const { target, count, requireEmail, requirePhone } = parsed.data;
  const country = normalizeCountry(parsed.data.country);
  const city = parsed.data.city || null;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: DiscoveryEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {}
      };
      const heartbeat = setInterval(() => emit({ type: "ping" }), 10_000);
      try {
        const tenant = getTenant(DEFAULT_TENANT);
        const [company, existing] = await Promise.all([
          tenant.loadKnowledge("fr"),
          prisma.prospect.findMany({ where: { tenant: tenant.id }, select: { website: true } }),
        ]);
        const knownHosts = existing.map((prospect) => websiteHost(prospect.website)).filter((host): host is string => Boolean(host));
        const discovery = await findCompanies({
          model: tenant.model,
          company,
          target,
          country,
          city,
          requireEmail,
          requirePhone,
          count,
          knownHosts,
          onSearch: (query) => emit({ type: "search", query }),
        });
        emit({ type: "result", ...discovery });
      } catch (error) {
        console.error("[agent] Recherche d'entreprises impossible :", error);
        emit({ type: "error", message: failureMessage(error) });
      }
      clearInterval(heartbeat);
      try {
        controller.close();
      } catch {}
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
