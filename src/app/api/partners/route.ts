import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendPartnerNotification } from "@/lib/email";
import { handleApiError } from "@/lib/api-error";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  partnerType: z.string().max(100).optional(),
  message: z.string().min(1).max(3000),
});

export async function POST(request: Request) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`partners:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const partnerData = {
      company: parsed.company,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone ?? null,
      partnerType: parsed.partnerType ?? "",
      message: parsed.message,
    };

    await prisma.partnerRequest.create({ data: partnerData });
    await sendPartnerNotification(partnerData);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
