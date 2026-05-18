import { requireAuth } from "@/lib/require-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AppForm from "../AppForm";

export default async function NewAppPage() {
  await requireAuth("MODERATOR");
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-2xl font-bold text-navy mb-8">Nouvelle application</h1>
          <AppForm />
        </div>
      </main>
    </div>
  );
}
