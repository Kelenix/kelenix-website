import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pushPublicKey } from "@/lib/push";

// Abonnement d'un appareil aux notifications push de l'admin.
const subscriptionSchema = z.object({
  endpoint: z.string().url().startsWith("https://").max(2000),
  keys: z.object({ p256dh: z.string().min(1).max(300), auth: z.string().min(1).max(100) }),
});

async function currentUserId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

// Clé publique à utiliser pour s'abonner (null : le serveur n'est pas configuré).
export async function GET() {
  if (!(await currentUserId())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ publicKey: pushPublicKey });
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!pushPublicKey) return NextResponse.json({ error: "Notifications non configurées" }, { status: 503 });
  try {
    const { endpoint, keys } = subscriptionSchema.parse(await request.json());
    const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
    // Même appareil réabonné (ou autre compte sur le même navigateur) : on met à jour la ligne.
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { userId, p256dh: keys.p256dh, auth: keys.auth, userAgent },
      create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { endpoint } = z.object({ endpoint: z.string().url().max(2000) }).parse(await request.json());
    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
