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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const project = await prisma.project.create({
      data: {
        ...parsed,
        problemFr: parsed.problemFr ?? "",
        problemEn: parsed.problemEn ?? "",
        solutionFr: parsed.solutionFr ?? "",
        solutionEn: parsed.solutionEn ?? "",
        resultsFr: parsed.resultsFr ?? "",
        resultsEn: parsed.resultsEn ?? "",
        technologies: parsed.technologies ?? "",
        gallery: "[]",
        link: parsed.link ?? null,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
