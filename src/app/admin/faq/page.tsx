export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Edit, HelpCircle } from "lucide-react";
import FaqDeleteButton from "./FaqDeleteButton";

const CATEGORY_LABELS: Record<string, string> = {
  services: "Services",
  pricing: "Tarification",
  process: "Process",
  delays: "Délais",
  support: "Support",
};

export default async function AdminFaqPage() {
  await requireAuth("MODERATOR");
  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: { id: true, category: true, questionFr: true, order: true, published: true },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">FAQ générale</h1>
              <p className="text-gray-500 text-sm mt-1">{faqs.length} question{faqs.length > 1 ? "s" : ""} — page publique /faq</p>
            </div>
            <Link
              href="/admin/faq/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors"
            >
              <Plus size={16} /> Nouvelle question
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {faqs.length === 0 ? (
              <div className="p-16 text-center">
                <HelpCircle size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Aucune question. Créez votre première question.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Question (FR)</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ordre</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {faqs.map(faq => (
                    <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-navy text-sm max-w-md truncate">{faq.questionFr}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky/10 text-sky">
                          {CATEGORY_LABELS[faq.category] ?? faq.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{faq.order}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${faq.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {faq.published ? "Publié" : "Masqué"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/faq/${faq.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors"
                          >
                            <Edit size={13} /> Modifier
                          </Link>
                          <FaqDeleteButton id={faq.id} title={faq.questionFr} />
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
