export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Handshake, FileText } from "lucide-react";
import Link from "next/link";
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

export default async function AdminPartnersPage() {
  const requests = await prisma.partnerRequest.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = requests.filter(r => r.status === "NEW").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Demandes Partenaires</h1>
              <p className="text-gray-500 text-sm mt-1">
                {requests.length} demandes au total
                {newCount > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky text-white">{newCount} nouvelles</span>}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {requests.length === 0 ? (
              <div className="p-16 text-center">
                <Handshake size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Aucune demande de partenariat reçue.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Entreprise</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-navy text-sm">{req.company}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-navy">{req.name}</div>
                        <div className="text-xs text-gray-400">{req.email}</div>
                      </td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky/10 text-sky">{req.partnerType}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(req.createdAt, "fr")}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[req.status]}`}>{statusLabels[req.status]}</span></td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/partners/${req.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors">
                          <FileText size={13} /> Voir
                        </Link>
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
