export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Edit, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminBlogPage() {
  await requireAuth("MODERATOR");
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, titleFr: true, category: true, published: true, publishedAt: true, createdAt: true },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Blog</h1>
              <p className="text-gray-500 text-sm mt-1">{posts.length} articles</p>
            </div>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors"
            >
              <Plus size={16} /> Nouvel article
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {posts.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Aucun article. Créez votre premier article.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Titre</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-navy text-sm">{post.titleFr}</p>
                        <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-sky/10 text-sky px-2 py-1 rounded-full font-medium">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {post.published ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {formatDate(post.publishedAt || post.createdAt, "fr")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sky border border-sky/30 rounded-lg text-xs font-medium hover:bg-sky hover:text-white transition-colors"
                        >
                          <Edit size={12} /> Modifier
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
