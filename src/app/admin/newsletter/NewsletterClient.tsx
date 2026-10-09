"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnGhost, card, input } from "@/components/admin/styles";

type Subscriber = { id: string; email: string; active: boolean; subscribedAt: Date };

export default function NewsletterClient({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => {
    const rows = subscribers.map((s) => `"${s.email}","${s.active}","${new Date(s.subscribedAt).toISOString()}"`);
    const csv = ["email,active,subscribedAt", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "newsletter_subscribers.csv";
    a.click();
  };

  return (
    <div className={cn(card, "overflow-hidden")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un e-mail…"
            aria-label="Rechercher un e-mail"
            className={cn(input, "pl-10")}
          />
        </div>
        <button onClick={exportCSV} disabled={subscribers.length === 0} className={btnGhost}>
          <Download size={15} /> Exporter en CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted">Aucun abonné trouvé.</p>
      ) : (
        <ul className="divide-y divide-line">
          {filtered.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", s.active ? "bg-emerald-500" : "bg-line")} title={s.active ? "Actif" : "Désabonné"} />
                <span className="truncate text-sm text-navy">{s.email}</span>
              </div>
              <span className="shrink-0 text-xs text-muted">{new Date(s.subscribedAt).toLocaleDateString("fr-FR")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
