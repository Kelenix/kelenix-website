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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const faq = await prisma.faq.create({ data: parsed });
    return NextResponse.json(faq);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
