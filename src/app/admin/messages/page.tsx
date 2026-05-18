export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { MessageStatus } from "@prisma/client";
import MessagesClient from "./MessagesClient";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  await requireAuth("MODERATOR");
  const { tab } = await searchParams;
  const activeTab = tab === "devis" ? "devis" : "messages";

  const [messages, quotes] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-navy">Messages & Demandes de devis</h1>
            <p className="text-gray-500 text-sm mt-1">Gérez les contacts entrants</p>
          </div>
          <MessagesClient messages={messages} quotes={quotes} activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
}
