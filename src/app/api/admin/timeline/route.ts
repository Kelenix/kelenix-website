import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const items = await prisma.aboutTimeline.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const item = await prisma.aboutTimeline.create({
    data: {
      year: body.year,
      titleFr: body.titleFr,
      titleEn: body.titleEn,
      descFr: body.descFr,
      descEn: body.descEn,
      order: body.order ?? 0,
    },
  });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}
