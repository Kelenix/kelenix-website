import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const member = await prisma.teamMember.create({
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
