export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AboutClient from "./AboutClient";

export default async function AdminAboutPage() {
  await requireAuth("MODERATOR");
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: ["about_mission_fr", "about_mission_en", "about_vision_fr", "about_vision_en", "about_values_fr", "about_values_en", "about_story_fr", "about_story_en"] } },
  });

  const data = Object.fromEntries(settings.map(s => [s.key, s.value]));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-navy">Page À propos</h1>
            <p className="text-gray-500 text-sm mt-1">Gérez le contenu de la page À propos</p>
          </div>
          <AboutClient data={data} />
        </div>
      </main>
    </div>
  );
}
