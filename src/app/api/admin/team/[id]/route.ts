import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name: body.name,
      roleFr: body.roleFr,
      roleEn: body.roleEn,
      bioFr: body.bioFr,
      bioEn: body.bioEn,
      avatar: body.avatar || null,
      linkedin: body.linkedin || null,
      order: body.order ?? 0,
      published: body.published ?? true,
    },
  });
  return NextResponse.json(member);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
