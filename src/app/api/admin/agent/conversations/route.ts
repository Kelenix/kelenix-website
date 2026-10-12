import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { staleConversations } from "@/lib/agent/retention";

// Nettoyage des conversations de l'assistant : efface définitivement celles qui n'ont donné
// aucune demande de devis et qui ont plus d'un mois.
export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { count } = await prisma.agentConversation.deleteMany({ where: staleConversations() });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
