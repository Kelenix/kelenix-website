import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  photo: z.string().max(500).optional(),
  textFr: z.string().min(1),
  textEn: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  showOnHome: z.boolean(),
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
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { ...parsed, photo: parsed.photo ?? null },
    });
    return NextResponse.json(testimonial);
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
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
