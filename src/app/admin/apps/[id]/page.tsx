export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppForm from "../AppForm";

export default async function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth("MODERATOR");
  const { id } = await params;
  const app = await prisma.mobileApp.findUnique({ where: { id } });
  if (!app) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem] mb-8">Modifier — {app.name}</h1>
      <AppForm app={app} />
    </div>
  );
}
