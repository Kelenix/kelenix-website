export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Smartphone, Edit } from "lucide-react";
import AppDeleteButton from "./AppDeleteButton";

export default async function AdminAppsPage() {
  await requireAuth("MODERATOR");
  const apps = await prisma.mobileApp.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Applications mobiles</h1>
              <p className="text-gray-500 text-sm mt-1">{apps.length}/10 applications</p>
            </div>
            {apps.length < 10 && (
              <Link href="/admin/apps/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors">
                <Plus size={16} /> Nouvelle app
              </Link>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {apps.length === 0 ? (
              <div className="p-16 text-center">
                <Smartphone size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Aucune application. Ajoutez jusqu'à 10 apps.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">App</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ordre</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {apps.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: app.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#fff", fontFamily: "Montserrat, sans-serif", flexShrink: 0 }}>
                            {app.initial}
                          </div>
                          <span className="font-medium text-navy text-sm">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.order}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {app.published ? "Publié" : "Masqué"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/apps/${app.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors">
                            <Edit size={13} /> Modifier
                          </Link>
                          <AppDeleteButton id={app.id} name={app.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
