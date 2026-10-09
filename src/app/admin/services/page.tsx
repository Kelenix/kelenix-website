export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Code } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import { AddLink, EditLink, Empty, List, PageHeader, Published, Row } from "@/components/admin/ui";

export default async function AdminServicesPage() {
  await requireAuth("MODERATOR");
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    select: { id: true, slug: true, titleFr: true, icon: true, order: true, published: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Services" lead={`${services.length} service${services.length > 1 ? "s" : ""}, dans l'ordre d'affichage du site`}>
        <AddLink href="/admin/services/new">Nouveau service</AddLink>
      </PageHeader>

      {services.length === 0 ? (
        <Empty icon={Code}>Aucun service. Créez votre premier service.</Empty>
      ) : (
        <List>
          {services.map((service) => (
            <Row
              key={service.id}
              media={<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist text-sm font-semibold text-muted">{service.order}</span>}
              title={service.titleFr}
              subtitle={`/services/${service.slug}`}
              chips={<Published on={service.published} />}
              actions={
                <>
                  <EditLink href={`/admin/services/${service.id}`} />
                  <DeleteButton url={`/api/admin/services/${service.id}`} title="Supprimer ce service" name={service.titleFr} />
                </>
              }
            />
          ))}
        </List>
      )}
    </div>
  );
}
