export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ChevronLeft, Building2, User, Mail, Phone, Tag, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import PartnerStatusSelect from "./PartnerStatusSelect";

type Props = { params: Promise<{ id: string }> };

export default async function PartnerDetailPage({ params }: Props) {
  const { id } = await params;
  const req = await prisma.partnerRequest.findUnique({ where: { id } });
  if (!req) notFound();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/admin/partners" className="flex items-center gap-1 text-gray-500 hover:text-navy text-sm mb-4">
              <ChevronLeft size={16} /> Retour aux partenaires
            </Link>
            <h1 className="font-heading text-2xl font-bold text-navy">Demande de {req.company}</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-navy">Informations</h2>
              <PartnerStatusSelect id={req.id} current={req.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "Entreprise", value: req.company },
                { icon: User, label: "Contact", value: req.name },
                { icon: Mail, label: "Email", value: req.email },
                { icon: Phone, label: "Téléphone", value: req.phone || "—" },
                { icon: Tag, label: "Type de partenariat", value: req.partnerType },
                { icon: Calendar, label: "Date", value: formatDate(req.createdAt, "fr") },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-sky/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-sky" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-navy">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-navy mb-3">Message</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{req.message}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
