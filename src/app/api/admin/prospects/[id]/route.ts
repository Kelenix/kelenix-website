import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { normalizeCountry } from "@/lib/agent/countries";
import { DEFAULT_TENANT } from "@/lib/agent/tenants";
import { normalizeEmail, normalizePhone, normalizeWebsite } from "@/lib/agent/normalize";

// Tout est facultatif : l'écran n'envoie que le champ qui vient de changer.
const schema = z
  .object({
    company: z.string().trim().min(1).max(200),
    website: z.string().max(300).nullable(),
    email: z.string().max(200).nullable(),
    phone: z.string().max(40).nullable(),
    contactName: z.string().trim().max(200).nullable(),
    country: z.string().max(10).nullable(),
    city: z.string().trim().max(100).nullable(),
    language: z.enum(["fr", "it", "en"]),
    notes: z.string().trim().max(5000).nullable(),
    subject: z.string().trim().max(200),
    body: z.string().max(20_000),
    // États que l'équipe choisit elle-même ; « en préparation » et « échec » viennent de l'agent.
    status: z.enum(["NEW", "READY", "SENT", "REPLIED", "DECLINED", "DO_NOT_CONTACT"]),
  })
  .partial();

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const { website, email, phone, contactName, country, city, notes, status, ...rest } = schema.parse(await request.json());
    const { count } = await prisma.prospect.updateMany({
      where: { id, tenant: DEFAULT_TENANT },
      data: {
        ...rest,
        ...(website !== undefined && { website: normalizeWebsite(website) }),
        ...(email !== undefined && { email: normalizeEmail(email) }),
        ...(phone !== undefined && { phone: normalizePhone(phone) }),
        ...(contactName !== undefined && { contactName: contactName || null }),
        ...(country !== undefined && { country: normalizeCountry(country) }),
        ...(city !== undefined && { city: city || null }),
        ...(notes !== undefined && { notes: notes || null }),
        // Un envoi s'enregistre par la route « sent » (date et historique) ; ici, on corrige seulement l'état.
        ...(status && { status }),
      },
    });
    if (count === 0) return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });
    return NextResponse.json(await prisma.prospect.findUnique({ where: { id } }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.prospect.deleteMany({ where: { id, tenant: DEFAULT_TENANT } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
