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
