import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  entries: z.array(z.object({ key: z.string(), value: z.string() })),
});

export async function POST(request: Request) {
  try {
    const { entries } = schema.parse(await request.json());
    await Promise.all(
      entries.map(({ key, value }) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
