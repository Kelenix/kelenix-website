"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Subscriber = { id: string; email: string; active: boolean; subscribedAt: Date };

export default function NewsletterClient({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = subscribers.map(s => `"${s.email}","${s.active}","${new Date(s.subscribedAt).toISOString()}"`);
    const csv = ["email,active,subscribedAt", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-card">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-medium hover:bg-sky transition-colors"
        >
          <Download size={14} /> Exporter CSV
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun abonné trouvé</p>
        ) : filtered.map(s => (
          <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full", s.active ? "bg-green-500" : "bg-gray-300")} />
              <span className="text-sm text-navy">{s.email}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(s.subscribedAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
