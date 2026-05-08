import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  position: z.string().max(200).optional(),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    await prisma.jobApplication.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone ?? null,
        position: parsed.position ?? null,
        message: parsed.message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Careers API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
