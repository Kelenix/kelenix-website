import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Nombre d'éléments encore « nouveaux » (non lus), pour les pastilles du menu de l'admin.
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const status = "NEW" as const;
    const [messages, quotes, applications, partners] = await Promise.all([
      prisma.contactMessage.count({ where: { status } }),
      prisma.quoteRequest.count({ where: { status } }),
      prisma.jobApplication.count({ where: { status } }),
      prisma.partnerRequest.count({ where: { status } }),
    ]);
    return NextResponse.json({ messages, quotes, applications, partners });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
