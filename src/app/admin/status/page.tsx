export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatusClient from "./StatusClient";

export default async function AdminStatusPage() {
  await requireAuth("MODERATOR");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-navy">État du système</h1>
            <p className="text-gray-500 text-sm mt-1">Santé de l&apos;application, de la base de données et du serveur en temps réel</p>
          </div>
          <StatusClient />
        </div>
      </main>
    </div>
  );
}
