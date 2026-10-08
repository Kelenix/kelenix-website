import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { notifyUser } from "@/lib/push";

// Envoie une notification d'essai aux appareils de l'administrateur connecté.
export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const result = await notifyUser(userId, {
      title: "Notifications Kelenix activées",
      body: "Vous serez prévenu ici dès qu'un visiteur vous écrit.",
      url: "/admin/messages",
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
