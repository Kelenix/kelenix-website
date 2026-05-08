import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  partnerType: z.string().min(1).max(100),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    await prisma.partnerRequest.create({
      data: {
        company: parsed.company,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone ?? null,
        partnerType: parsed.partnerType,
        message: parsed.message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Partners API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
