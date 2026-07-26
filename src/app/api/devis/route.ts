import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendQuoteNotification } from "@/lib/email";
import { handleApiError } from "@/lib/api-error";
import { rateLimit } from "@/lib/rate-limit";
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
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`devis:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const saved = {
      ...parsed,
      deadline: parsed.deadline ?? "",
      projectGoals: parsed.projectGoals ?? "",
      phone: parsed.phone ?? "",
      company: parsed.company ?? "",
    };

    await prisma.quoteRequest.create({ data: saved });
    await sendQuoteNotification(saved);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
