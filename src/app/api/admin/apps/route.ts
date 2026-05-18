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
  order:     z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const apps = await prisma.mobileApp.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const count = await prisma.mobileApp.count();
    if (count >= 10) {
      return NextResponse.json({ error: "Maximum 10 applications autorisées." }, { status: 400 });
    }
    const data = schema.parse(await req.json());
    const app = await prisma.mobileApp.create({ data });
    return NextResponse.json(app);
  } catch (e) {
    return handleApiError(e);
  }
}
