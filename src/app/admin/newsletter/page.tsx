export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { card } from "@/components/admin/styles";
import NewsletterClient from "./NewsletterClient";

export default async function AdminNewsletterPage() {
  await requireAuth("MODERATOR");
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { subscribedAt: "desc" },
  });
  const active = subscribers.filter((s) => s.active).length;

  const stats = [
    { label: "Inscrits au total", value: subscribers.length, tone: "text-navy" },
    { label: "Actifs", value: active, tone: "text-emerald-600" },
    { label: "Désabonnés", value: subscribers.length - active, tone: "text-muted" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Newsletter" lead={`${active} abonné${active > 1 ? "s" : ""} actif${active > 1 ? "s" : ""}`} />

      <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-4">
        {stats.map(({ label, value, tone }) => (
          <div key={label} className={`${card} px-3 py-4 text-center sm:p-5`}>
            <div className={`font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl ${tone}`}>{value}</div>
            <p className="mt-1 text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      <NewsletterClient subscribers={subscribers} />
    </div>
  );
}
