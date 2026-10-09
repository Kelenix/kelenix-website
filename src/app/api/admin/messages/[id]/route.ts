import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageStatus } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({
  kind: z.enum(["message", "quote"]),
  status: z.nativeEnum(MessageStatus),
});
type Props = { params: Promise<{ id: string }> };

// Change l'état d'un message de contact ou d'une demande de devis (lu, en cours, traité…).
export async function PUT(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { kind, status } = schema.parse(await request.json());
    const updated =
      kind === "quote"
        ? await prisma.quoteRequest.update({ where: { id }, data: { status }, select: { id: true, status: true } })
        : await prisma.contactMessage.update({ where: { id }, data: { status }, select: { id: true, status: true } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
