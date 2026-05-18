export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Users, Download } from "lucide-react";
import NewsletterClient from "./NewsletterClient";

export default async function AdminNewsletterPage() {
  await requireAuth("MODERATOR");
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-navy">Newsletter</h1>
            <p className="text-gray-500 text-sm mt-1">{subscribers.filter(s => s.active).length} abonnés actifs</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-card text-center">
              <div className="font-heading font-bold text-3xl text-sky mb-1">{subscribers.length}</div>
              <p className="text-xs text-gray-500">Total inscrits</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-card text-center">
              <div className="font-heading font-bold text-3xl text-green-500 mb-1">{subscribers.filter(s => s.active).length}</div>
              <p className="text-xs text-gray-500">Actifs</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-card text-center">
              <div className="font-heading font-bold text-3xl text-gray-400 mb-1">{subscribers.filter(s => !s.active).length}</div>
              <p className="text-xs text-gray-500">Désabonnés</p>
            </div>
          </div>

          <NewsletterClient subscribers={subscribers} />
        </div>
      </main>
    </div>
  );
}
