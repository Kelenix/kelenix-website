import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageStatus } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({ kind: z.enum(["message", "quote"]) });

// « Tout marquer comme lu » : passe à « lu » tous les messages (ou tous les devis) encore « nouveaux ».
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { kind } = schema.parse(await request.json());
    const where = { status: MessageStatus.NEW };
    const data = { status: MessageStatus.READ };
    const { count } = kind === "quote" ? await prisma.quoteRequest.updateMany({ where, data }) : await prisma.contactMessage.updateMany({ where, data });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// « Supprimer les archivés » : efface définitivement les messages (?kind=message) ou les devis
// (?kind=quote) classés « archivé ». Les autres états ne sont pas touchés.
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const kind = new URL(request.url).searchParams.get("kind");
    const where = { status: MessageStatus.ARCHIVED };
    if (kind === "quote") {
      const ids = (await prisma.quoteRequest.findMany({ where, select: { id: true } })).map((quote) => quote.id);
      // Les conversations de l'assistant liées à ces devis partent avec eux.
      const [, { count }] = await prisma.$transaction([
        prisma.agentConversation.deleteMany({ where: { quoteId: { in: ids } } }),
        prisma.quoteRequest.deleteMany({ where: { id: { in: ids } } }),
      ]);
      return NextResponse.json({ count });
    }
    if (kind === "message") {
      const { count } = await prisma.contactMessage.deleteMany({ where });
      return NextResponse.json({ count });
    }
    return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
