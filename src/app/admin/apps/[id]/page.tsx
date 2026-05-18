export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AppForm from "../AppForm";

export default async function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth("MODERATOR");
  const { id } = await params;
  const app = await prisma.mobileApp.findUnique({ where: { id } });
  if (!app) notFound();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-2xl font-bold text-navy mb-8">Modifier — {app.name}</h1>
          <AppForm app={app} />
        </div>
      </main>
    </div>
  );
}
