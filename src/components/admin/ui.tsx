import Link from "next/link";
import { ChevronLeft, Pencil, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS, backLink, btnPrimary, btnSmall, card, pageLead, pageTitle, pill } from "./styles";

// Briques communes aux écrans de l'admin. Les listes sont des lignes souples plutôt que des tableaux :
// sur téléphone les étiquettes passent sous le titre et les actions se réduisent à leur icône.

export function PageHeader({
  title,
  lead,
  back,
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  back?: { href: string; label: string };
  /** Actions de la page (bouton « Nouveau… »). */
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {back && (
        <Link href={back.href} className={backLink}>
          <ChevronLeft size={16} /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className={pageTitle}>{title}</h1>
          {lead && <p className={pageLead}>{lead}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

export function AddLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={btnPrimary}>
      <Plus size={16} /> {children}
    </Link>
  );
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Modifier" className={btnSmall}>
      <Pencil size={13} />
      <span className="hidden sm:inline">Modifier</span>
    </Link>
  );
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className={cn(card, "divide-y divide-line overflow-hidden")}>{children}</ul>;
}

export function Row({
  media,
  title,
  subtitle,
  chips,
  actions,
  href,
  unread,
}: {
  media?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  chips?: React.ReactNode;
  actions?: React.ReactNode;
  /** Rend le texte cliquable (fiche de détail). */
  href?: string;
  /** Élément pas encore ouvert : titre en gras. */
  unread?: boolean;
}) {
  const text = (
    <>
      <p className={cn("truncate text-sm text-navy", unread ? "font-semibold" : "font-medium")}>{title}</p>
      {subtitle && <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>}
      {chips && <div className="mt-2 flex flex-wrap items-center gap-1.5 md:hidden">{chips}</div>}
    </>
  );
  return (
    <li className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-mist/50 sm:gap-4 sm:px-5">
      {media}
      {href ? (
        <Link href={href} className="min-w-0 flex-1">
          {text}
        </Link>
      ) : (
        <div className="min-w-0 flex-1">{text}</div>
      )}
      {chips && <div className="hidden shrink-0 items-center gap-2 md:flex">{chips}</div>}
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </li>
  );
}

const chipTones = {
  neutral: "bg-mist text-muted",
  azure: "bg-azure/10 text-azure",
  green: "bg-emerald-100 text-emerald-800",
  gold: "bg-gold/25 text-navy",
};

export function Chip({ tone = "neutral", children }: { tone?: keyof typeof chipTones; children: React.ReactNode }) {
  return <span className={cn(pill, chipTones[tone])}>{children}</span>;
}

export function Published({ on, off = "Brouillon" }: { on: boolean; off?: string }) {
  return <Chip tone={on ? "green" : "neutral"}>{on ? "Publié" : off}</Chip>;
}

export function StatusChip({ status }: { status: string }) {
  return <span className={cn(pill, STATUS[status]?.tone)}>{STATUS[status]?.label ?? status}</span>;
}

// Pastille ronde avec une initiale ; le point or signale un élément pas encore ouvert.
export function Avatar({ name, tone = "azure", unread }: { name: string; tone?: "azure" | "gold" | "navy"; unread?: boolean }) {
  const tones = { azure: "bg-azure/10 text-azure", gold: "bg-gold/20 text-navy", navy: "bg-navy text-white" };
  return (
    <span className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase", tones[tone])}>
      {name.trim()[0] ?? "?"}
      {unread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-gold" />}
    </span>
  );
}

export function Empty({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className={cn(card, "px-6 py-14 text-center")}>
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-muted">
        <Icon size={22} />
      </span>
      <p className="text-sm text-muted">{children}</p>
    </div>
  );
}

// Onglets d'une page (chaque onglet est une adresse).
export function Tabs({ items }: { items: { href: string; label: string; icon: LucideIcon; active: boolean; total?: number; unread?: number }[] }) {
  return (
    <div className="mb-5 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
      {items.map(({ href, label, icon: Icon, active, total, unread = 0 }) => (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors", active ? "bg-navy text-white" : "text-muted hover:text-navy")}
        >
          <Icon size={15} />
          {label}
          {total !== undefined && <span className={cn("text-xs font-medium", active ? "text-white/70" : "text-muted")}>{total}</span>}
          {unread > 0 && (
            <span aria-label={`${unread} non lu${unread > 1 ? "s" : ""}`} className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-navy">
              {unread}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// Fiche de détail : une information avec son icône.
export function Fact({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-mist p-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-azure">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="break-words text-sm font-medium text-navy">{children}</p>
      </div>
    </div>
  );
}
