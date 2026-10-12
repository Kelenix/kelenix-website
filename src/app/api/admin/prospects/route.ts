import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { DEFAULT_TENANT } from "@/lib/agent/tenants";
import { normalizeEmail, normalizeWebsite, websiteHost } from "@/lib/agent/prospects";

const schema = z.object({
  prospects: z
    .array(
      z.object({
        company: z.string().trim().min(1).max(200),
        website: z.string().max(300).nullish(),
        email: z.string().max(200).nullish(),
        contactName: z.string().trim().max(200).nullish(),
        language: z.enum(["fr", "it", "en"]).default("fr"),
        notes: z.string().trim().max(5000).nullish(),
      })
    )
    .min(1)
    .max(200),
});

// Liste complète : l'écran la relit pendant qu'un brouillon se prépare.
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const prospects = await prisma.prospect.findMany({ where: { tenant: DEFAULT_TENANT }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(prospects);
}

// Ajout d'une ou plusieurs entreprises. Celles déjà présentes (même e-mail, même site, ou même nom
// quand il n'y a ni l'un ni l'autre) sont ignorées et comptées dans `duplicates`.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { prospects } = schema.parse(await request.json());
    const existing = await prisma.prospect.findMany({ where: { tenant: DEFAULT_TENANT }, select: { company: true, website: true, email: true } });
    const key = (p: { company: string; website: string | null; email: string | null }) => p.email ?? websiteHost(p.website) ?? p.company.toLowerCase();
    const known = new Set(existing.map(key));

    const fresh = [];
    for (const input of prospects) {
      const row = {
        tenant: DEFAULT_TENANT,
        company: input.company,
        website: normalizeWebsite(input.website),
        email: normalizeEmail(input.email),
        contactName: input.contactName || null,
        language: input.language,
        notes: input.notes || null,
      };
      if (known.has(key(row))) continue;
      known.add(key(row));
      fresh.push(row);
    }

    if (fresh.length) await prisma.prospect.createMany({ data: fresh });
    return NextResponse.json({ created: fresh.length, duplicates: prospects.length - fresh.length });
  } catch (error) {
    return handleApiError(error);
  }
}
