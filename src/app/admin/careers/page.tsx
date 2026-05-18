export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Briefcase, Edit, Users, MapPin, FileText } from "lucide-react";
import JobDeleteButton from "./JobDeleteButton";
import { formatDate } from "@/lib/utils";

const statusColors: Record<string, string> = {
  NEW: "bg-sky/10 text-sky",
  READ: "bg-blue-100 text-blue-600",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  TREATED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};
const statusLabels: Record<string, string> = {
  NEW: "Nouveau", READ: "Lu", IN_PROGRESS: "En cours", TREATED: "Traité", ARCHIVED: "Archivé",
};

export default async function AdminCareersPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireAuth("MODERATOR");
  const { tab = "jobs" } = await searchParams;

  const [jobs, applications] = await Promise.all([
    prisma.jobPosting.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Carrières</h1>
              <p className="text-gray-500 text-sm mt-1">{jobs.length} offres · {applications.length} candidatures</p>
            </div>
            {tab === "jobs" && (
              <Link href="/admin/careers/new" className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors">
                <Plus size={16} /> Nouvelle offre
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            <Link href="?tab=jobs" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "jobs" ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-navy"}`}>
              <Briefcase size={15} /> Offres ({jobs.length})
            </Link>
            <Link href="?tab=applications" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "applications" ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-navy"}`}>
              <Users size={15} /> Candidatures ({applications.length})
            </Link>
          </div>

          {/* Job Postings */}
          {tab === "jobs" && (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {jobs.length === 0 ? (
                <div className="p-16 text-center">
                  <Briefcase size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400">Aucune offre. Créez votre première offre d&apos;emploi.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Poste</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Lieu</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contrat</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-navy text-sm">{job.titleFr}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1"><MapPin size={13} />{job.location}</td>
                        <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky/10 text-sky">{job.contractType}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{job.published ? "Publié" : "Masqué"}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/admin/careers/${job.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors">
                              <Edit size={13} /> Modifier
                            </Link>
                            <JobDeleteButton id={job.id} title={job.titleFr} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Applications */}
          {tab === "applications" && (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {applications.length === 0 ? (
                <div className="p-16 text-center">
                  <Users size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400">Aucune candidature reçue.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Candidat</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Poste visé</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-navy text-sm">{app.name}</div>
                          <div className="text-xs text-gray-400">{app.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{app.position || "Candidature spontanée"}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(app.createdAt, "fr")}</td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{statusLabels[app.status]}</span></td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/careers/application/${app.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors">
                            <FileText size={13} /> Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
