export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  await requireAuth("MODERATOR");
  const settings = await prisma.siteSettings.findMany();
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

  return <SettingsClient settings={settingsMap} />;
}
