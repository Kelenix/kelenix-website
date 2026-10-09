export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Briefcase, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import { AddLink, Avatar, Chip, EditLink, Empty, List, PageHeader, Published, Row, StatusChip, Tabs } from "@/components/admin/ui";

export default async function AdminCareersPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireAuth("MODERATOR");
  const { tab } = await searchParams;
  const showApplications = tab === "applications";

  const [jobs, applications] = await Promise.all([
    prisma.jobPosting.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const openJobs = jobs.filter((job) => job.published).length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Carrières"
        lead={
          openJobs > 0
            ? `${openJobs} offre${openJobs > 1 ? "s" : ""} en ligne sur la page Carrières`
            : "Aucune offre en ligne pour l'instant"
        }
      >
        {!showApplications && <AddLink href="/admin/careers/new">Nouvelle offre</AddLink>}
      </PageHeader>

      <Tabs
        items={[
          { href: "/admin/careers", label: "Offres", icon: Briefcase, active: !showApplications, total: jobs.length },
          {
            href: "/admin/careers?tab=applications",
            label: "Candidatures",
            icon: Users,
            active: showApplications,
            total: applications.length,
            unread: applications.filter((app) => app.status === "NEW").length,
          },
        ]}
      />

      {!showApplications &&
        (jobs.length === 0 ? (
          <Empty icon={Briefcase}>Aucune offre. Créez votre première offre d&apos;emploi.</Empty>
        ) : (
          <List>
            {jobs.map((job) => (
              <Row
                key={job.id}
                title={job.titleFr}
                subtitle={job.location}
                chips={
                  <>
                    <Chip tone="azure">{job.contractType}</Chip>
                    <Published on={job.published} off="Masqué" />
                  </>
                }
                actions={
                  <>
                    <EditLink href={`/admin/careers/${job.id}`} />
                    <DeleteButton url={`/api/admin/careers/${job.id}`} title="Supprimer cette offre" name={job.titleFr} />
                  </>
                }
              />
            ))}
          </List>
        ))}

      {showApplications &&
        (applications.length === 0 ? (
          <Empty icon={Users}>Aucune candidature reçue.</Empty>
        ) : (
          <List>
            {applications.map((app) => (
              <Row
                key={app.id}
                href={`/admin/careers/application/${app.id}`}
                unread={app.status === "NEW"}
                media={<Avatar name={app.name} unread={app.status === "NEW"} />}
                title={app.name}
                subtitle={`${app.position || "Candidature spontanée"} · ${formatDate(app.createdAt, "fr")}`}
                chips={<StatusChip status={app.status} />}
              />
            ))}
          </List>
        ))}
    </div>
  );
}
