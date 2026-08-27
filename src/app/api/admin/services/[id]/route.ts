import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({
  slug: z.string().min(1).max(100),
  titleFr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  shortDescFr: z.string().min(1),
  shortDescEn: z.string().min(1),
  longDescFr: z.string().min(1),
  longDescEn: z.string().min(1),
  icon: z.string().min(1).max(50),
  image: z.string().max(500).optional(),
  technologies: z.string().max(500).optional(),
  faqFr: z.string().optional(),
  faqEn: z.string().optional(),
  order: z.number().int().min(0),
  published: z.boolean(),
});

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = schema.parse(body);
    const service = await prisma.service.update({ where: { id }, data: parsed });
    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
