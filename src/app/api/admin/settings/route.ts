import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await request.json();
    // Le numéro WhatsApp sert à construire un lien wa.me, qui n'accepte que des chiffres.
    const updates = Object.entries(body as Record<string, string>).map(([key, value]) => [key, key === "company_whatsapp" ? value.replace(/\D/g, "") : value] as const);

    await Promise.all(
      updates.map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
