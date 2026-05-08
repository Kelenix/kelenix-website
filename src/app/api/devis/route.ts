import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  serviceType: z.string().min(1).max(100),
  projectName: z.string().min(1).max(200),
  projectDesc: z.string().min(10).max(5000),
  projectGoals: z.string().max(2000).optional(),
  budget: z.string().max(100),
  deadline: z.string().max(100).optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  company: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    await prisma.quoteRequest.create({
      data: {
        ...parsed,
        deadline: parsed.deadline ?? "",
        projectGoals: parsed.projectGoals ?? "",
        phone: parsed.phone ?? "",
        company: parsed.company ?? "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Devis API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
