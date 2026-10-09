export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Building2, User, Mail, Phone, Tag, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import MarkAsRead from "@/components/admin/MarkAsRead";
import StatusSelect from "@/components/admin/StatusSelect";
import { Fact, PageHeader } from "@/components/admin/ui";
import { btnGhost, btnPrimary, card, cardTitle } from "@/components/admin/styles";

type Props = { params: Promise<{ id: string }> };

export default async function PartnerDetailPage({ params }: Props) {
  await requireAuth("MODERATOR");
  const { id } = await params;
  const req = await prisma.partnerRequest.findUnique({ where: { id } });
  if (!req) notFound();

  const api = `/api/admin/partners/${req.id}`;
  const isNew = req.status === "NEW";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Ouvrir la fiche vaut lecture : la demande n'est plus « nouvelle ». */}
      {isNew && <MarkAsRead url={api} />}
      <PageHeader title={req.company} lead="Demande de partenariat" back={{ href: "/admin/partners", label: "Partenaires" }} />

      <div className={`${card} space-y-6 p-5 sm:p-7`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={cardTitle}>Informations</h2>
          <StatusSelect url={api} current={isNew ? "READ" : req.status} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Fact icon={Building2} label="Entreprise">{req.company}</Fact>
          <Fact icon={User} label="Contact">{req.name}</Fact>
          <Fact icon={Mail} label="E-mail">{req.email}</Fact>
          <Fact icon={Phone} label="Téléphone">{req.phone || "—"}</Fact>
          <Fact icon={Tag} label="Type de partenariat">{req.partnerType || "—"}</Fact>
          <Fact icon={Calendar} label="Reçue le">{formatDate(req.createdAt, "fr")}</Fact>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-navy">Message</h3>
          <div className="whitespace-pre-wrap rounded-xl bg-mist p-4 text-sm leading-relaxed text-navy/90">{req.message}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${req.email}?subject=${encodeURIComponent("Votre demande de partenariat — Kelenix Tech")}`} className={btnPrimary}>
            <Mail size={15} /> Répondre
          </a>
          {req.phone && (
            <a href={`tel:${req.phone}`} className={btnGhost}>
              <Phone size={15} /> Appeler
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
