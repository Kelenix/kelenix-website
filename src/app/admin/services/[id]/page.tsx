export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ServiceForm from "../ServiceForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/admin/services" className="flex items-center gap-1 text-gray-500 hover:text-navy text-sm mb-4">
              <ChevronLeft size={16} /> Retour aux services
            </Link>
            <h1 className="font-heading text-2xl font-bold text-navy">Modifier : {service.titleFr}</h1>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-8">
            <ServiceForm service={{ ...service, image: service.image ?? "", technologies: service.technologies ?? "" }} />
          </div>
        </div>
      </main>
    </div>
  );
}
