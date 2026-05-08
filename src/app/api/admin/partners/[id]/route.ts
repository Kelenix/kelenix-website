import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageStatus } from "@prisma/client";
import { z } from "zod";

const schema = z.object({ status: z.nativeEnum(MessageStatus) });
type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const { status } = schema.parse(await request.json());
    const req = await prisma.partnerRequest.update({ where: { id }, data: { status } });
    return NextResponse.json(req);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
