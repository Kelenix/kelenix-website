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

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = schema.parse(body);
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true, published: true } });
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...parsed,
        coverImage: parsed.coverImage || null,
        tags: parsed.tags ?? "",
        publishedAt: parsed.published && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null,
      },
    });
    return NextResponse.json(post);
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
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
