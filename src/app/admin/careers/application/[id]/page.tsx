export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Phone, Briefcase, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import MarkAsRead from "@/components/admin/MarkAsRead";
import StatusSelect from "@/components/admin/StatusSelect";
import { Fact, PageHeader } from "@/components/admin/ui";
import { btnGhost, btnPrimary, card, cardTitle } from "@/components/admin/styles";

type Props = { params: Promise<{ id: string }> };

export default async function ApplicationDetailPage({ params }: Props) {
  await requireAuth("MODERATOR");
  const { id } = await params;
  const app = await prisma.jobApplication.findUnique({ where: { id } });
  if (!app) notFound();

  const api = `/api/admin/careers/application/${app.id}`;
  const isNew = app.status === "NEW";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Ouvrir la fiche vaut lecture : la candidature n'est plus « nouvelle ». */}
      {isNew && <MarkAsRead url={api} />}
      <PageHeader title={app.name} lead={app.position || "Candidature spontanée"} back={{ href: "/admin/careers?tab=applications", label: "Candidatures" }} />

      <div className={`${card} space-y-6 p-5 sm:p-7`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={cardTitle}>Informations du candidat</h2>
          <StatusSelect url={api} current={isNew ? "READ" : app.status} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Fact icon={User} label="Nom">{app.name}</Fact>
          <Fact icon={Mail} label="E-mail">{app.email}</Fact>
          <Fact icon={Phone} label="Téléphone">{app.phone || "—"}</Fact>
          <Fact icon={Briefcase} label="Poste visé">{app.position || "Candidature spontanée"}</Fact>
          <Fact icon={Calendar} label="Reçue le">{formatDate(app.createdAt, "fr")}</Fact>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-navy">Message de motivation</h3>
          <div className="whitespace-pre-wrap rounded-xl bg-mist p-4 text-sm leading-relaxed text-navy/90">{app.message}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${app.email}?subject=${encodeURIComponent("Votre candidature chez Kelenix Tech")}`} className={btnPrimary}>
            <Mail size={15} /> Répondre
          </a>
          {app.phone && (
            <a href={`tel:${app.phone}`} className={btnGhost}>
              <Phone size={15} /> Appeler
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
