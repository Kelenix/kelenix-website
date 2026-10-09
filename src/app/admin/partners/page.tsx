export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Handshake } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Avatar, Chip, Empty, List, PageHeader, Row, StatusChip } from "@/components/admin/ui";

export default async function AdminPartnersPage() {
  await requireAuth("MODERATOR");
  const requests = await prisma.partnerRequest.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = requests.filter((r) => r.status === "NEW").length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Partenaires"
        lead={`${requests.length} demande${requests.length > 1 ? "s" : ""} de partenariat${newCount > 0 ? `, dont ${newCount} à lire` : ""}`}
      />

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
            />
          ))}
        </List>
      )}
    </div>
  );
}
