export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  await requireAuth("MODERATOR");
  const settings = await prisma.siteSettings.findMany();
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">Paramètres du site</h1>
        <p className="mt-1.5 text-sm text-muted">Informations de l&apos;entreprise et configuration globale</p>
      </div>
      <SettingsClient settings={settingsMap} />
    </div>
  );
}
