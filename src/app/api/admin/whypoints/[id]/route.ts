import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const point = await prisma.whyPoint.update({
    where: { id },
    data: {
      icon: body.icon,
      titleFr: body.titleFr,
      titleEn: body.titleEn,
      descFr: body.descFr,
      descEn: body.descEn,
      order: body.order ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(point);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await prisma.whyPoint.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
