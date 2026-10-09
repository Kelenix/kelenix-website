"use client";

import { useEffect, useState } from "react";
import { Mail, FileText, ChevronDown, Download, Phone, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTS_EVENT } from "@/components/admin/useAdminNotifications";
import { STATUS, STATUS_OPTIONS, btnGhost, btnPrimary, card, empty, input, pill } from "@/components/admin/styles";

type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

type Quote = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceType: string;
  projectName: string;
  projectDesc: string;
  projectGoals?: string | null;
  budget: string;
  deadline: string | null;
  status: string;
  createdAt: Date;
};

type Kind = "message" | "quote";

// Un message et un devis s'affichent de la même façon : on les ramène à une même forme.
type Row = {
  id: string;
  kind: Kind;
  title: string;
  subtitle: string;
  initial: string;
  email: string;
  phone: string | null;
  subject: string;
  details: [string, string][];
  blocks: [string | null, string][];
  status: string;
  createdAt: Date;
};

// Date courte dans les lignes (« 9 oct. ») : la place est comptée sur téléphone.
const shortDate = (date: Date) => new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

const filled = (pairs: [string, string | null | undefined][]) => pairs.filter((pair): pair is [string, string] => Boolean(pair[1]));

const fromMessage = (m: Message): Row => ({
  id: m.id,
  kind: "message",
  title: `${m.firstName} ${m.lastName}`,
  subtitle: [m.email, m.company].filter(Boolean).join(" · "),
  initial: m.firstName[0] ?? "?",
  email: m.email,
  phone: m.phone,
  subject: "Votre message à Kelenix Tech",
  details: filled([["E-mail", m.email], ["Téléphone", m.phone], ["Entreprise", m.company], ["Service", m.service], ["Budget", m.budget]]),
  blocks: [[null, m.message]],
  status: m.status,
  createdAt: m.createdAt,
});

const fromQuote = (q: Quote): Row => ({
  id: q.id,
  kind: "quote",
  title: `${q.firstName} ${q.lastName} — ${q.projectName}`,
  subtitle: `${q.serviceType} · ${q.budget}`,
  initial: q.firstName[0] ?? "?",
  email: q.email,
  phone: q.phone,
  subject: `Votre demande de devis — ${q.projectName}`,
  details: filled([["E-mail", q.email], ["Téléphone", q.phone], ["Entreprise", q.company], ["Service", q.serviceType], ["Budget", q.budget], ["Délai", q.deadline]]),
  blocks: filled([["Description du projet", q.projectDesc], ["Objectifs", q.projectGoals]]),
  status: q.status,
  createdAt: q.createdAt,
});

// Enregistre le nouvel état, puis prévient le menu pour que ses pastilles se mettent à jour.
const saveStatus = (row: Row, status: string) =>
  fetch(`/api/admin/messages/${row.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: row.kind, status }),
  })
    .then(() => window.dispatchEvent(new Event(COUNTS_EVENT)))
    .catch(() => {});

export default function MessagesClient({
  messages,
  quotes,
  activeTab,
  openId,
}: {
  messages: Message[];
  quotes: Quote[];
  activeTab: string;
  /** Élément à ouvrir d'entrée (clic sur une notification). */
  openId?: string;
}) {
  const lists: Record<Kind, Row[]> = { message: messages.map(fromMessage), quote: quotes.map(fromQuote) };
  const opened = openId ? [...lists.message, ...lists.quote].find((row) => row.id === openId) : undefined;

  const [kind, setKind] = useState<Kind>(opened?.kind ?? (activeTab === "devis" ? "quote" : "message"));
  const [expanded, setExpanded] = useState<string | null>(opened?.id ?? null);
  // États changés depuis l'arrivée sur la page : ouvrir un élément « nouveau » le passe à « lu ».
  const [changes, setChanges] = useState<Record<string, string>>(() => (opened?.status === "NEW" ? { [opened.id]: "READ" } : {}));
  const statusOf = (row: Row) => changes[row.id] ?? row.status;

  // Arrivée depuis une notification : l'élément est déjà déplié, on l'enregistre comme lu et on l'amène à l'écran.
  useEffect(() => {
    if (!opened) return;
    if (opened.status === "NEW") saveStatus(opened, "READ");
    document.getElementById(`item-${opened.id}`)?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = (row: Row, status: string) => {
    setChanges((current) => ({ ...current, [row.id]: status }));
    saveStatus(row, status);
  };

  const toggle = (row: Row) => {
    const opening = expanded !== row.id;
    setExpanded(opening ? row.id : null);
    if (opening && statusOf(row) === "NEW") changeStatus(row, "READ");
  };

  const exportCSV = () => {
    const data: (Message | Quote)[] = kind === "message" ? messages : quotes;
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const lines = data.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[headers, ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = kind === "message" ? "messages.csv" : "devis.csv";
    a.click();
  };

  const rows = lists[kind];
  const unreadRows = rows.filter((row) => statusOf(row) === "NEW");

  // Vide d'un coup les « nouveaux » de l'onglet affiché (utile quand beaucoup se sont accumulés).
  const markAllRead = () => {
    setChanges((current) => ({ ...current, ...Object.fromEntries(unreadRows.map((row) => [row.id, "READ"])) }));
    fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind }) })
      .then(() => window.dispatchEvent(new Event(COUNTS_EVENT)))
      .catch(() => {});
  };
  const tabs: { kind: Kind; label: string; icon: typeof Mail }[] = [
    { kind: "message", label: "Messages", icon: Mail },
    { kind: "quote", label: "Devis", icon: FileText },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex gap-1 rounded-full border border-line bg-white p-1">
          {tabs.map(({ kind: value, label, icon: Icon }) => {
            const unread = lists[value].filter((row) => statusOf(row) === "NEW").length;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={kind === value}
                onClick={() => setKind(value)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  kind === value ? "bg-navy text-white" : "text-muted hover:text-navy"
                )}
              >
                <Icon size={15} />
                {label}
                <span className={cn("text-xs font-medium", kind === value ? "text-white/70" : "text-muted")}>{lists[value].length}</span>
                {unread > 0 && (
                  <span aria-label={`${unread} non lu${unread > 1 ? "s" : ""}`} className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-navy">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadRows.length > 0 && (
            <button onClick={markAllRead} className={btnGhost}>
              <CheckCheck size={15} /> Tout marquer comme lu
            </button>
          )}
          <button onClick={exportCSV} disabled={rows.length === 0} className={btnGhost}>
            <Download size={15} /> Exporter en CSV
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={cn(card, empty)}>{kind === "message" ? "Aucun message pour l'instant." : "Aucune demande de devis pour l'instant."}</div>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((row) => {
            const status = statusOf(row);
            const open = expanded === row.id;
            const unread = status === "NEW";
            return (
              <li key={row.id} id={`item-${row.id}`} className={cn(card, "overflow-hidden", unread && "border-gold/70")}>
                <button
                  type="button"
                  onClick={() => toggle(row)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-mist/60 sm:gap-4 sm:px-5"
                >
                  <span className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase", row.kind === "quote" ? "bg-gold/20 text-navy" : "bg-azure/10 text-azure")}>
                    {row.initial}
                    {unread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-gold" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm text-navy", unread ? "font-semibold" : "font-medium")}>{row.title}</span>
                    <span className="block truncate text-xs text-muted">{row.subtitle}</span>
                  </span>
                  <span className={cn(pill, STATUS[status]?.tone, "hidden shrink-0 sm:inline-flex")}>{STATUS[status]?.label}</span>
                  <span className="shrink-0 text-xs text-muted">{shortDate(row.createdAt)}</span>
                  <ChevronDown size={16} className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")} />
                </button>

                {open && (
                  <div className="border-t border-line px-4 pb-5 pt-4 sm:px-5">
                    <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      {row.details.map(([label, value]) => (
                        <div key={label} className="flex gap-2">
                          <dt className="shrink-0 text-muted">{label}</dt>
                          <dd className="min-w-0 break-words font-medium text-navy">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {row.blocks.map(([label, text]) => (
                      <div key={label ?? "message"} className="mt-4 rounded-xl bg-mist p-4">
                        {label && <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy/90">{text}</p>
                      </div>
                    ))}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <a href={`mailto:${row.email}?subject=${encodeURIComponent(row.subject)}`} className={btnPrimary}>
                        <Mail size={15} /> {row.kind === "quote" ? "Envoyer le devis" : "Répondre"}
                      </a>
                      {row.phone && (
                        <a href={`tel:${row.phone}`} className={btnGhost}>
                          <Phone size={15} /> Appeler
                        </a>
                      )}
                      <label className="ml-auto flex items-center gap-2 text-xs font-medium text-muted">
                        État
                        <select value={status} onChange={(e) => changeStatus(row, e.target.value)} className={cn(input, "w-auto py-2")}>
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
