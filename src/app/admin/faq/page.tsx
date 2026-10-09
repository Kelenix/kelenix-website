export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { HelpCircle } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import { AddLink, Chip, EditLink, Empty, List, PageHeader, Published, Row } from "@/components/admin/ui";

const CATEGORY_LABELS: Record<string, string> = {
  services: "Services",
  pricing: "Tarification",
  process: "Process",
  delays: "Délais",
  support: "Support",
};

export default async function AdminFaqPage() {
  await requireAuth("MODERATOR");
  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: { id: true, category: true, questionFr: true, order: true, published: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="FAQ" lead={`${faqs.length} question${faqs.length > 1 ? "s" : ""} sur la page publique /faq`}>
        <AddLink href="/admin/faq/new">Nouvelle question</AddLink>
      </PageHeader>

      {faqs.length === 0 ? (
        <Empty icon={HelpCircle}>Aucune question. Créez votre première question.</Empty>
      ) : (
        <List>
          {faqs.map((faq) => (
            <Row
              key={faq.id}
              media={<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist text-sm font-semibold text-muted">{faq.order}</span>}
              title={faq.questionFr}
              chips={
                <>
                  <Chip tone="azure">{CATEGORY_LABELS[faq.category] ?? faq.category}</Chip>
                  <Published on={faq.published} off="Masqué" />
                </>
              }
              actions={
                <>
                  <EditLink href={`/admin/faq/${faq.id}`} />
                  <DeleteButton url={`/api/admin/faq/${faq.id}`} title="Supprimer cette question" name={faq.questionFr} />
                </>
              }
            />
          ))}
        </List>
      )}
    </div>
  );
}
