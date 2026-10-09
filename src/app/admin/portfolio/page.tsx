export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Briefcase } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import { AddLink, Chip, EditLink, Empty, List, PageHeader, Published, Row } from "@/components/admin/ui";

export default async function AdminPortfolioPage() {
  await requireAuth("MODERATOR");
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, titleFr: true, category: true, client: true, featured: true, published: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Portfolio" lead={`${projects.length} projet${projects.length > 1 ? "s" : ""}`}>
        <AddLink href="/admin/portfolio/new">Nouveau projet</AddLink>
      </PageHeader>

      {projects.length === 0 ? (
        <Empty icon={Briefcase}>Aucun projet. Créez votre premier projet.</Empty>
      ) : (
        <List>
          {projects.map((project) => (
            <Row
              key={project.id}
              title={project.titleFr}
              subtitle={project.client || project.slug}
              chips={
                <>
                  {project.featured && <Chip tone="gold">À la une</Chip>}
                  <Chip tone="azure">{project.category}</Chip>
                  <Published on={project.published} />
                </>
              }
              actions={
                <>
                  <EditLink href={`/admin/portfolio/${project.id}`} />
                  <DeleteButton url={`/api/admin/portfolio/${project.id}`} title="Supprimer ce projet" name={project.titleFr} />
                </>
              }
            />
          ))}
        </List>
      )}
    </div>
  );
}
