import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { sentHistory } from "@/lib/agent/followup";
import { DEFAULT_TENANT } from "@/lib/agent/tenants";

const schema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20_000),
});

type Props = { params: Promise<{ id: string }> };

// « Marquer comme envoyé » : le brouillon relu (premier e-mail ou relance) rejoint l'historique des envois,
// tel qu'il est à l'écran. C'est cet historique qui dit ensuite quand relancer, et que lit l'agent pour rédiger la relance.
export async function POST(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const { subject, body } = schema.parse(await request.json());
    const prospect = await prisma.prospect.findFirst({ where: { id, tenant: DEFAULT_TENANT } });
    if (!prospect) return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });
    if (prospect.status !== "READY") return NextResponse.json({ error: "Aucun brouillon en attente d'envoi pour cette entreprise." }, { status: 409 });

    const now = new Date();
    const sentEmails = [...sentHistory(prospect), { subject, body, sentAt: now.toISOString() }];
    const updated = await prisma.prospect.update({ where: { id }, data: { subject, body, status: "SENT", sentAt: now, sentEmails } });
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
