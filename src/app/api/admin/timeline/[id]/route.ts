import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.aboutTimeline.update({
    where: { id },
    data: {
      year: body.year,
      titleFr: body.titleFr,
      titleEn: body.titleEn,
      descFr: body.descFr,
      descEn: body.descEn,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await prisma.aboutTimeline.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
