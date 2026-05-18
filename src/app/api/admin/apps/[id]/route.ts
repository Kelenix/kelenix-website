import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({
  name:      z.string().min(1).max(50),
  initial:   z.string().min(1).max(2),
  color:     z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  category:  z.string().min(1).max(50),
  order:     z.number().int().min(0),
  published: z.boolean(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = schema.parse(await req.json());
    const app = await prisma.mobileApp.update({ where: { id }, data });
    return NextResponse.json(app);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.mobileApp.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
