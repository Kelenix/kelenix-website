export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Handshake } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import PurgeButton from "@/components/admin/PurgeButton";
import { Avatar, Chip, Empty, List, PageHeader, Row, StatusChip } from "@/components/admin/ui";

export default async function AdminPartnersPage() {
  await requireAuth("MODERATOR");
  const requests = await prisma.partnerRequest.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = requests.filter((r) => r.status === "NEW").length;
  const archived = requests.filter((r) => r.status === "ARCHIVED").length;

  return (
    <div>
      <PageHeader
        title="Partenaires"
        lead={`${requests.length} demande${requests.length > 1 ? "s" : ""} de partenariat${newCount > 0 ? `, dont ${newCount} à lire` : ""}`}
      >
        <PurgeButton
          url="/api/admin/partners"
          count={archived}
          label="Supprimer les archivées"
          message={archived > 1 ? `Les ${archived} demandes archivées seront supprimées.` : "La demande archivée sera supprimée."}
        />
      </PageHeader>

      {requests.length === 0 ? (
        <Empty icon={Handshake}>Aucune demande de partenariat reçue.</Empty>
      ) : (
        <List>
          {requests.map((req) => (
            <Row
              key={req.id}
              href={`/admin/partners/${req.id}`}
              unread={req.status === "NEW"}
              media={<Avatar name={req.company} tone="gold" unread={req.status === "NEW"} />}
              title={req.company}
              subtitle={`${req.name} · ${formatDate(req.createdAt, "fr")}`}
              chips={
                <>
                  {req.partnerType && <Chip tone="azure">{req.partnerType}</Chip>}
                  <StatusChip status={req.status} />
                </>
              }
              actions={<DeleteButton url={`/api/admin/partners/${req.id}`} title="Supprimer cette demande" name={req.company} />}
            />
          ))}
        </List>
      )}
    </div>
  );
}
