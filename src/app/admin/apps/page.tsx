export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Smartphone } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import { AddLink, EditLink, Empty, List, PageHeader, Published, Row } from "@/components/admin/ui";

export default async function AdminAppsPage() {
  await requireAuth("MODERATOR");
  const apps = await prisma.mobileApp.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Applications mobiles" lead={`${apps.length} sur 10 applications`}>
        {apps.length < 10 && <AddLink href="/admin/apps/new">Nouvelle app</AddLink>}
      </PageHeader>

      {apps.length === 0 ? (
        <Empty icon={Smartphone}>Aucune application. Ajoutez jusqu&apos;à 10 apps.</Empty>
      ) : (
        <List>
          {apps.map((app) => (
            <Row
              key={app.id}
              media={
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white" style={{ background: app.color }}>
                  {app.initial}
                </span>
              }
              title={app.name}
              subtitle={`${app.category} · position ${app.order}`}
              chips={<Published on={app.published} off="Masqué" />}
              actions={
                <>
                  <EditLink href={`/admin/apps/${app.id}`} />
                  <DeleteButton url={`/api/admin/apps/${app.id}`} title="Supprimer cette application" name={app.name} />
                </>
              }
            />
          ))}
        </List>
      )}
    </div>
  );
}
