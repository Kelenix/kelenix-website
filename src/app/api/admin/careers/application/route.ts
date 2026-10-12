import { NextResponse } from "next/server";
import { MessageStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// « Supprimer les archivées » : efface définitivement les candidatures classées « archivé ».
export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { count } = await prisma.jobApplication.deleteMany({ where: { status: MessageStatus.ARCHIVED } });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
