import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  titleFr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  descFr: z.string().min(1),
  descEn: z.string().min(1),
  location: z.string().min(1).max(200),
  contractType: z.string().min(1).max(50),
  published: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.parse(await request.json());
    const job = await prisma.jobPosting.create({ data: parsed });
    return NextResponse.json(job);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
