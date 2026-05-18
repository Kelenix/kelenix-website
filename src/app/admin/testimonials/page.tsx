export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Edit, Star } from "lucide-react";
import TestimonialDeleteButton from "./TestimonialDeleteButton";

export default async function AdminTestimonialsPage() {
  await requireAuth("MODERATOR");
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, company: true, position: true, rating: true, showOnHome: true, published: true },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Témoignages</h1>
              <p className="text-gray-500 text-sm mt-1">{testimonials.length} témoignages</p>
            </div>
            <Link
              href="/admin/testimonials/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors"
            >
              <Plus size={16} /> Nouveau témoignage
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {testimonials.length === 0 ? (
              <div className="p-16 text-center">
                <Star size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Aucun témoignage. Créez votre premier témoignage.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Entreprise</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Note</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {testimonials.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-navy text-sm">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.position}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{t.company}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < t.rating ? "text-gold fill-gold" : "text-gray-200 fill-gray-200"} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {t.published ? "Publié" : "Masqué"}
                          </span>
                          {t.showOnHome && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky/10 text-sky">Accueil</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/testimonials/${t.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-sky hover:text-white transition-colors"
                          >
                            <Edit size={13} /> Modifier
                          </Link>
                          <TestimonialDeleteButton id={t.id} name={t.name} />
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
