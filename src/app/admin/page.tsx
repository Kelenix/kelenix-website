export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { MessageStatus } from "@prisma/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Mail, FileText, BookOpen, Users, Star, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireAuth("MODERATOR");

  const [
    newMessages,
    newQuotes,
    totalBlogPosts,
    totalProjects,
    totalTestimonials,
    totalSubscribers,
    recentMessages,
    recentQuotes,
  ] = await Promise.all([
    prisma.contactMessage.count({ where: { status: MessageStatus.NEW } }),
    prisma.quoteRequest.count({ where: { status: MessageStatus.NEW } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.newsletter.count({ where: { active: true } }),
    prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, firstName: true, lastName: true, email: true, service: true, createdAt: true, status: true } }),
    prisma.quoteRequest.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, firstName: true, lastName: true, email: true, serviceType: true, budget: true, createdAt: true, status: true } }),
  ]);

  const stats = [
    { icon: Mail, label: "Nouveaux messages", value: newMessages, href: "/admin/messages", color: "bg-blue-500" },
    { icon: FileText, label: "Demandes de devis", value: newQuotes, href: "/admin/messages?tab=devis", color: "bg-gold" },
    { icon: BookOpen, label: "Articles publiés", value: totalBlogPosts, href: "/admin/blog", color: "bg-sky" },
    { icon: Briefcase, label: "Projets actifs", value: totalProjects, href: "/admin/portfolio", color: "bg-purple-500" },
    { icon: Star, label: "Témoignages", value: totalTestimonials, href: "/admin/testimonials", color: "bg-yellow-500" },
    { icon: Users, label: "Abonnés newsletter", value: totalSubscribers, href: "/admin/newsletter", color: "bg-green-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-navy">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mt-1">Bienvenue sur l&apos;interface d&apos;administration Kelenix</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map(({ icon: Icon, label, value, href, color }) => (
              <Link
                key={label}
                href={href}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="font-heading font-bold text-2xl text-navy">{value}</div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Messages */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="font-heading font-bold text-navy text-base">Messages récents</h2>
                <Link href="/admin/messages" className="text-sky text-sm font-medium hover:underline">Voir tout</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentMessages.length === 0 ? (
                  <p className="text-gray-400 text-sm p-6 text-center">Aucun message</p>
                ) : recentMessages.map(msg => (
                  <div key={msg.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-navy text-sm truncate">{msg.firstName} {msg.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {msg.status === "NEW" && (
                        <span className="w-2 h-2 rounded-full bg-sky" />
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Quotes */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="font-heading font-bold text-navy text-base">Demandes de devis récentes</h2>
                <Link href="/admin/messages?tab=devis" className="text-sky text-sm font-medium hover:underline">Voir tout</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentQuotes.length === 0 ? (
                  <p className="text-gray-400 text-sm p-6 text-center">Aucune demande</p>
                ) : recentQuotes.map(q => (
                  <div key={q.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-navy text-sm truncate">{q.firstName} {q.lastName}</p>
                      <p className="text-xs text-gray-400">{q.serviceType} · {q.budget}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {q.status === "NEW" && (
                        <span className="w-2 h-2 rounded-full bg-gold" />
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(q.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: "/admin/blog/new", label: "Nouvel article", icon: BookOpen },
              { href: "/admin/portfolio/new", label: "Nouveau projet", icon: Briefcase },
              { href: "/admin/services", label: "Gérer services", icon: TrendingUp },
              { href: "/admin/testimonials/new", label: "Témoignage", icon: Star },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all text-center group flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 bg-sky/10 rounded-xl flex items-center justify-center group-hover:bg-sky transition-colors">
                  <Icon size={18} className="text-sky group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-navy">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
