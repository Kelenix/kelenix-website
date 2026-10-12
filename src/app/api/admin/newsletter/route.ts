import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// « Supprimer les désabonnés » : efface définitivement les adresses qui ne sont plus abonnées.
export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { count } = await prisma.newsletter.deleteMany({ where: { active: false } });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
