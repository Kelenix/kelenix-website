import { NextResponse, after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { agentConfigured } from "@/lib/agent/config";
import { MAX_FOLLOW_UPS, sentHistory } from "@/lib/agent/followup";
import { DEFAULT_TENANT } from "@/lib/agent/tenants";
import { prepareProspect } from "@/lib/agent/prospects";

// Au-delà de ce délai, une préparation est considérée comme perdue (serveur redémarré) et peut être relancée.
const STALE_AFTER = 5 * 60_000;

type Props = { params: Promise<{ id: string }> };

// Lance la préparation du brouillon et répond tout de suite : le travail (20 à 60 secondes) se poursuit
// après la réponse, et l'écran suit l'état du prospect jusqu'à « brouillon prêt » ou « échec ».
export async function POST(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!agentConfigured()) return NextResponse.json({ error: "Clé d'API Claude absente sur le serveur (ANTHROPIC_API_KEY)." }, { status: 503 });

  const { id } = await params;
  const prospect = await prisma.prospect.findFirst({ where: { id, tenant: DEFAULT_TENANT } });
  if (!prospect) return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });
  if (prospect.status === "DO_NOT_CONTACT") return NextResponse.json({ error: "Cette entreprise ne doit plus être contactée." }, { status: 409 });
  if (prospect.status === "REPLIED" || prospect.status === "DECLINED") return NextResponse.json({ error: "Cette entreprise a déjà répondu : pas de relance." }, { status: 409 });
  if (prospect.status === "PREPARING" && Date.now() - prospect.updatedAt.getTime() < STALE_AFTER) {
    return NextResponse.json(prospect, { status: 202 });
  }
  // Rien d'envoyé : l'agent prépare le premier e-mail. Sinon, une relance, dans la limite prévue.
  const sent = sentHistory(prospect);
  if (sent.length > MAX_FOLLOW_UPS) return NextResponse.json({ error: "Le nombre maximal de relances est atteint pour cette entreprise." }, { status: 409 });

  // L'historique est fixé ici : pour un prospect envoyé avant l'arrivée des relances, il ne vivait que dans le brouillon, que la relance va remplacer.
  const preparing = await prisma.prospect.update({ where: { id }, data: { status: "PREPARING", error: null, sentEmails: sent } });
  // L'e-mail est signé du nom de la personne connectée, qui le relira et l'enverra.
  const senderName = session.user.name || "L'équipe";
  after(() => prepareProspect(id, senderName));
  return NextResponse.json(preparing, { status: 202 });
}
