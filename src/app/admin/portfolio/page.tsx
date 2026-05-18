export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Edit, Briefcase } from "lucide-react";
import PortfolioDeleteButton from "./PortfolioDeleteButton";

export default async function AdminPortfolioPage() {
  await requireAuth("MODERATOR");
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, titleFr: true, category: true, client: true, featured: true, published: true },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Portfolio</h1>
              <p className="text-gray-500 text-sm mt-1">{projects.length} projets</p>
            </div>
            <Link
              href="/admin/portfolio/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors"
            >
              <Plus size={16} /> Nouveau projet
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {projects.length === 0 ? (
              <div className="p-16 text-center">
                <Briefcase size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Aucun projet. Créez votre premier projet.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Titre</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-navy text-sm">{project.titleFr}</div>
                        {project.featured && <span className="text-xs text-gold font-medium">⭐ À la une</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.client}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky/10 text-sky">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {project.published ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/portfolio/${project.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors"
                          >
                            <Edit size={13} /> Modifier
                          </Link>
                          <PortfolioDeleteButton id={project.id} title={project.titleFr} />
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
