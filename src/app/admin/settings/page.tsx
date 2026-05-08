export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findMany();
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-navy">Paramètres du site</h1>
            <p className="text-gray-500 text-sm mt-1">Informations de l&apos;entreprise et configuration globale</p>
          </div>
          <SettingsClient settings={settingsMap} />
        </div>
      </main>
    </div>
  );
}
