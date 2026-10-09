export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { MessageStatus } from "@prisma/client";
import { Mail, FileText, BookOpen, Users, Star, Briefcase, Handshake, Newspaper, ArrowUpRight, Plus, CheckCircle2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TrendAreaChart from "@/components/admin/charts/TrendAreaChart";
import CategoryBarChart from "@/components/admin/charts/CategoryBarChart";
import DonutChart from "@/components/admin/charts/DonutChart";
import { Avatar, Chip, StatusChip } from "@/components/admin/ui";
import { card, cardTitle, pageLead, pageTitle } from "@/components/admin/styles";

const SERVICE_LABELS: Record<string, string> = {
  software: "Logiciel sur mesure",
  web: "Sites web",
  webapp: "Applications web",
  mobile: "Applications mobiles",
  ai: "Intelligence artificielle",
  consulting: "Consulting IT",
  training: "Formation",
};

const DONUT_COLORS = ["#0F6FE6", "#FFC107", "#2FA8FF", "#10B981", "#8B5CF6", "#F97316", "#0B1F3A"];

type Inbox = { icon: LucideIcon; label: string; count: number; href: string };
type Recent = { id: string; kind: string; tone: "azure" | "gold" | "navy"; name: string; detail: string; status: string; createdAt: Date; href: string };

export default async function AdminDashboardPage() {
  const session = await requireAuth("MODERATOR");
  const firstName = session.user.name?.trim().split(/\s+/)[0];

  // Fenêtre des 6 derniers mois (début du mois).
  const now = new Date();
  const MONTHS_BACK = 6;
  const trendStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1), 1);
  const isNew = { status: MessageStatus.NEW };
  const latest = { take: 6, orderBy: { createdAt: "desc" as const } };

  const [
    newMessages,
    newQuotes,
    newApplications,
    newPartners,
    totalBlogPosts,
    totalProjects,
    totalTestimonials,
    totalSubscribers,
    recentMessages,
    recentQuotes,
    recentApplications,
    recentPartners,
    msgDates,
    quoteDates,
    quotesByService,
    quotesByBudget,
  ] = await Promise.all([
    prisma.contactMessage.count({ where: isNew }),
    prisma.quoteRequest.count({ where: isNew }),
    prisma.jobApplication.count({ where: isNew }),
    prisma.partnerRequest.count({ where: isNew }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.newsletter.count({ where: { active: true } }),
    prisma.contactMessage.findMany({ ...latest, select: { id: true, firstName: true, lastName: true, service: true, message: true, createdAt: true, status: true } }),
    prisma.quoteRequest.findMany({ ...latest, select: { id: true, firstName: true, lastName: true, projectName: true, budget: true, createdAt: true, status: true } }),
    prisma.jobApplication.findMany({ ...latest, select: { id: true, name: true, position: true, createdAt: true, status: true } }),
    prisma.partnerRequest.findMany({ ...latest, select: { id: true, company: true, name: true, createdAt: true, status: true } }),
    prisma.contactMessage.findMany({ where: { createdAt: { gte: trendStart } }, select: { createdAt: true } }),
    prisma.quoteRequest.findMany({ where: { createdAt: { gte: trendStart } }, select: { createdAt: true } }),
    prisma.quoteRequest.groupBy({ by: ["serviceType"], _count: { _all: true } }),
    prisma.quoteRequest.groupBy({ by: ["budget"], _count: { _all: true } }),
  ]);

  // Buckets mensuels pour le graphique de tendance.
  const months = Array.from({ length: MONTHS_BACK }, (_, i) => {
    const d = new Date(trendStart.getFullYear(), trendStart.getMonth() + i, 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("fr-FR", { month: "short" }) };
  });
  const bucketize = (rows: { createdAt: Date }[]) => {
    const map = Object.fromEntries(months.map((m) => [m.key, 0]));
    for (const { createdAt } of rows) {
      const d = new Date(createdAt);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (k in map) map[k]++;
    }
    return months.map((m) => map[m.key]);
  };

  const trendLabels = months.map((m) => m.label);
  const trendSeries = [
    { name: "Messages", color: "#0F6FE6", data: bucketize(msgDates) },
    { name: "Devis", color: "#FFC107", data: bucketize(quoteDates) },
  ];

  const serviceData = quotesByService
    .map((g) => ({ label: SERVICE_LABELS[g.serviceType] ?? g.serviceType, value: g._count._all }))
    .sort((a, b) => b.value - a.value);

  const budgetData = quotesByBudget
    .map((g, i) => ({ label: g.budget, value: g._count._all, color: DONUT_COLORS[i % DONUT_COLORS.length] }))
    .sort((a, b) => b.value - a.value);

  // Ce qui attend une réponse, par rubrique.
  const inbox: Inbox[] = [
    { icon: Mail, label: "Messages", count: newMessages, href: "/admin/messages" },
    { icon: FileText, label: "Demandes de devis", count: newQuotes, href: "/admin/messages?tab=devis" },
    { icon: Users, label: "Candidatures", count: newApplications, href: "/admin/careers?tab=applications" },
    { icon: Handshake, label: "Partenariats", count: newPartners, href: "/admin/partners" },
  ];
  const waiting = inbox.reduce((sum, item) => sum + item.count, 0);

  const content = [
    { icon: BookOpen, label: "Articles publiés", value: totalBlogPosts, href: "/admin/blog" },
    { icon: Briefcase, label: "Projets en ligne", value: totalProjects, href: "/admin/portfolio" },
    { icon: Star, label: "Témoignages", value: totalTestimonials, href: "/admin/testimonials" },
    { icon: Newspaper, label: "Abonnés newsletter", value: totalSubscribers, href: "/admin/newsletter" },
  ];

  // Dernières demandes, toutes rubriques confondues ; chaque ligne ouvre directement l'élément.
  const recent: Recent[] = [
    ...recentMessages.map((m) => ({ id: m.id, kind: "Message", tone: "azure" as const, name: `${m.firstName} ${m.lastName}`, detail: m.service || m.message, status: m.status, createdAt: m.createdAt, href: `/admin/messages?open=${m.id}` })),
    ...recentQuotes.map((q) => ({ id: q.id, kind: "Devis", tone: "gold" as const, name: `${q.firstName} ${q.lastName}`, detail: `${q.projectName} · ${q.budget}`, status: q.status, createdAt: q.createdAt, href: `/admin/messages?tab=devis&open=${q.id}` })),
    ...recentApplications.map((a) => ({ id: a.id, kind: "Candidature", tone: "navy" as const, name: a.name, detail: a.position || "Candidature spontanée", status: a.status, createdAt: a.createdAt, href: `/admin/careers/application/${a.id}` })),
    ...recentPartners.map((p) => ({ id: p.id, kind: "Partenariat", tone: "navy" as const, name: p.company, detail: p.name, status: p.status, createdAt: p.createdAt, href: `/admin/partners/${p.id}` })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  const shortcuts = [
    { href: "/admin/blog/new", label: "Nouvel article" },
    { href: "/admin/portfolio/new", label: "Nouveau projet" },
    { href: "/admin/testimonials/new", label: "Nouveau témoignage" },
    { href: "/admin/careers/new", label: "Nouvelle offre" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className={pageTitle}>{firstName ? `Bonjour ${firstName}` : "Tableau de bord"}</h1>
        <p className={pageLead}>
          {waiting > 0
            ? `${waiting} demande${waiting > 1 ? "s attendent" : " attend"} d'être lue${waiting > 1 ? "s" : ""}.`
            : "Tout est lu : aucune nouvelle demande pour l'instant."}
        </p>
      </div>

      {/* À traiter */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {inbox.map(({ icon: Icon, label, count, href }) => (
          <Link key={label} href={href} className={cn(card, "group relative p-4 transition-colors hover:border-azure/50 sm:p-5", count > 0 && "border-gold/70")}>
            <div className="flex items-center justify-between">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", count > 0 ? "bg-gold/25 text-navy" : "bg-mist text-muted")}>
                <Icon size={18} />
              </span>
              <ArrowUpRight size={16} className="text-muted/60 transition-colors group-hover:text-azure" />
            </div>
            <div className="mt-4 font-display text-4xl font-medium leading-none tracking-[-0.03em] text-navy">{count}</div>
            <div className="mt-1.5 text-xs font-medium text-muted sm:text-sm">{label}</div>
            <div className={cn("mt-2 text-xs font-medium", count > 0 ? "text-navy" : "text-emerald-700")}>
              {count > 0 ? (
                "À lire"
              ) : (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 size={13} /> À jour
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-5 lg:gap-6">
        {/* Dernières demandes */}
        <div className={cn(card, "min-w-0 overflow-hidden lg:col-span-3")}>
          <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5">
            <h2 className={cardTitle}>Dernières demandes</h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-azure hover:text-azure-dark">
              Tout voir
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted">Aucune demande reçue pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((item) => {
                const unread = item.status === "NEW";
                return (
                  <li key={`${item.kind}-${item.id}`}>
                    <Link href={item.href} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-mist/60 sm:px-5">
                      <Avatar name={item.name} tone={item.tone} unread={unread} />
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate text-sm text-navy", unread ? "font-semibold" : "font-medium")}>{item.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {item.kind} · {item.detail}
                        </span>
                      </span>
                      <span className="hidden sm:block">
                        <StatusChip status={item.status} />
                      </span>
                      <span className="shrink-0 text-xs text-muted">{item.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Contenu du site + raccourcis */}
        <div className="min-w-0 space-y-4 lg:col-span-2 lg:space-y-6">
          <div className={cn(card, "p-4 sm:p-5")}>
            <h2 className={cardTitle}>Contenu du site</h2>
            <ul className="mt-3 divide-y divide-line">
              {content.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <Link href={href} className="group flex items-center gap-3 py-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist text-azure">
                      <Icon size={15} />
                    </span>
                    <span className="flex-1 text-sm text-muted transition-colors group-hover:text-navy">{label}</span>
                    <span className="text-sm font-semibold text-navy">{value}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(card, "p-4 sm:p-5")}>
            <h2 className={cardTitle}>Créer</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {shortcuts.map(({ href, label }) => (
                <Link key={href} href={href} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-navy transition-colors hover:border-azure hover:text-azure">
                  <Plus size={13} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-5 lg:gap-6">
        <div className={cn(card, "min-w-0 p-4 sm:p-6 lg:col-span-3")}>
          <h2 className={cardTitle}>Activité des 6 derniers mois</h2>
          <p className="mb-4 mt-0.5 text-xs text-muted">Messages et demandes de devis reçus par mois</p>
          <TrendAreaChart labels={trendLabels} series={trendSeries} />
        </div>

        <div className={cn(card, "min-w-0 p-4 sm:p-6 lg:col-span-2")}>
          <h2 className={cardTitle}>Devis par budget</h2>
          <p className="mb-4 mt-0.5 text-xs text-muted">Répartition des demandes de devis</p>
          <DonutChart data={budgetData} emptyLabel="Aucune demande de devis" />
        </div>
      </div>

      <div className={cn(card, "mt-4 p-4 sm:p-6 lg:mt-6")}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className={cardTitle}>Services les plus demandés</h2>
            <p className="mb-4 mt-0.5 text-xs text-muted">Nombre de demandes de devis par service</p>
          </div>
          {serviceData.length > 0 && <Chip tone="azure">{serviceData[0].label}</Chip>}
        </div>
        <CategoryBarChart data={serviceData} emptyLabel="Aucune demande de devis" />
      </div>
    </div>
  );
}
