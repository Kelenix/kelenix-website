import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const CATEGORIES = ["services", "pricing", "process", "delays", "support"] as const;

const schema = z.object({
  category: z.enum(CATEGORIES),
  questionFr: z.string().min(1),
  questionEn: z.string().min(1),
  answerFr: z.string().min(1),
  answerEn: z.string().min(1),
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
    const faq = await prisma.faq.update({ where: { id }, data: parsed });
    return NextResponse.json(faq);
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
    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
