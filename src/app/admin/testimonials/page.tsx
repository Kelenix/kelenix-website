export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import { AddLink, Avatar, Chip, EditLink, Empty, List, PageHeader, Published, Row } from "@/components/admin/ui";

export default async function AdminTestimonialsPage() {
  await requireAuth("MODERATOR");
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, company: true, position: true, rating: true, showOnHome: true, published: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Témoignages" lead={`${testimonials.length} témoignage${testimonials.length > 1 ? "s" : ""}`}>
        <AddLink href="/admin/testimonials/new">Nouveau témoignage</AddLink>
      </PageHeader>

      {testimonials.length === 0 ? (
        <Empty icon={Star}>Aucun témoignage. Créez votre premier témoignage.</Empty>
      ) : (
        <List>
          {testimonials.map((t) => (
            <Row
              key={t.id}
              media={<Avatar name={t.name} />}
              title={t.name}
              subtitle={[t.position, t.company].filter(Boolean).join(" · ")}
              chips={
                <>
                  <span className="flex items-center gap-0.5" aria-label={`Note : ${t.rating} sur 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < t.rating ? "fill-gold text-gold" : "fill-line text-line"} />
                    ))}
                  </span>
                  {t.showOnHome && <Chip tone="azure">Accueil</Chip>}
                  <Published on={t.published} off="Masqué" />
                </>
              }
              actions={
                <>
                  <EditLink href={`/admin/testimonials/${t.id}`} />
                  <DeleteButton url={`/api/admin/testimonials/${t.id}`} title="Supprimer ce témoignage" name={t.name} />
                </>
              }
            />
          ))}
        </List>
      )}
    </div>
  );
}
