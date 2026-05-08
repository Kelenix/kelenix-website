import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ProjectCategory } from "@prisma/client";

const schema = z.object({
  slug: z.string().min(1).max(100),
  titleFr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  client: z.string().min(1).max(200),
  category: z.nativeEnum(ProjectCategory),
  descFr: z.string().min(1),
  descEn: z.string().min(1),
  problemFr: z.string().optional(),
  problemEn: z.string().optional(),
  solutionFr: z.string().optional(),
  solutionEn: z.string().optional(),
  resultsFr: z.string().optional(),
  resultsEn: z.string().optional(),
  technologies: z.string().optional(),
  coverImage: z.string().min(1),
  link: z.string().max(500).optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = schema.parse(body);
    const project = await prisma.project.update({
      where: { id },
      data: { ...parsed, link: parsed.link ?? null },
    });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
