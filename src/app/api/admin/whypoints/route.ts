import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const points = await prisma.whyPoint.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(points);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const point = await prisma.whyPoint.create({
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
