import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Cette valeur existe déjà" }, { status: 409 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[DB] Connexion impossible:", error.message);
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }

  console.error("[API]", error);
  return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
}
