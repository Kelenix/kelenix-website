import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendApplicationNotification } from "@/lib/email";
import { handleApiError } from "@/lib/api-error";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  position: z.string().max(200).optional(),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`careers:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);

    const appData = {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone ?? null,
      position: parsed.position ?? null,
      message: parsed.message,
    };

    await prisma.jobApplication.create({ data: appData });
    await sendApplicationNotification(appData);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
