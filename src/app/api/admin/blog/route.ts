import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BlogCategory } from "@prisma/client";

const schema = z.object({
  slug: z.string().min(1).max(100),
  titleFr: z.string().min(1).max(300),
  titleEn: z.string().min(1).max(300),
  excerptFr: z.string().min(1).max(500),
  excerptEn: z.string().min(1).max(500),
  contentFr: z.string(),
  contentEn: z.string(),
  coverImage: z.string().max(500).optional(),
  authorName: z.string().min(1).max(100),
  category: z.nativeEnum(BlogCategory),
  tags: z.string().optional(),
  published: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const post = await prisma.blogPost.create({
      data: {
        ...parsed,
        coverImage: parsed.coverImage || null,
        tags: parsed.tags ?? "",
        publishedAt: parsed.published ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
