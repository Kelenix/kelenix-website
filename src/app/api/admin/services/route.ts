import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const service = await prisma.service.create({
      data: {
        ...parsed,
        image: parsed.image ?? null,
        technologies: parsed.technologies ?? "",
        faqFr: parsed.faqFr ?? "[]",
        faqEn: parsed.faqEn ?? "[]",
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
