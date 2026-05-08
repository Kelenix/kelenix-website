"use client";

import { useState } from "react";
import { Mail, FileText, ChevronDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

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
  budget: string;
  deadline: string | null;
  status: string;
  createdAt: Date;
};

const statusColors: Record<string, string> = {
  NEW: "bg-sky/10 text-sky",
  READ: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  TREATED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-500",
};

const statusLabels: Record<string, string> = {
  NEW: "Nouveau",
  READ: "Lu",
  IN_PROGRESS: "En cours",
  TREATED: "Traité",
  ARCHIVED: "Archivé",
};

export default function MessagesClient({
  messages,
  quotes,
  activeTab: initialTab,
}: {
  messages: Message[];
  quotes: Quote[];
  activeTab: string;
}) {
  const [tab, setTab] = useState(initialTab);
  const [expanded, setExpanded] = useState<string | null>(null);

  const exportCSV = (data: (Message | Quote)[], filename: string) => {
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map(row =>
      Object.values(row).map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card border border-gray-100">
          <button
            onClick={() => setTab("messages")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              tab === "messages" ? "bg-sky text-white shadow" : "text-gray-600 hover:text-navy"
            )}
          >
            <Mail size={15} /> Messages ({messages.length})
          </button>
          <button
            onClick={() => setTab("devis")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              tab === "devis" ? "bg-sky text-white shadow" : "text-gray-600 hover:text-navy"
            )}
          >
            <FileText size={15} /> Devis ({quotes.length})
          </button>
        </div>
        <button
          onClick={() => {
            if (tab === "messages") exportCSV(messages, "messages.csv");
            else exportCSV(quotes, "devis.csv");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-medium hover:bg-sky transition-colors"
        >
          <Download size={15} /> Exporter CSV
        </button>
      </div>

      {/* Messages Tab */}
      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center text-gray-400">Aucun message</div>
          ) : messages.map(msg => (
            <div key={msg.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-sky/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-sky font-bold text-sm">{msg.firstName[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-navy text-sm">{msg.firstName} {msg.lastName}</p>
                    <p className="text-xs text-gray-400">{msg.email} {msg.company ? `· ${msg.company}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusColors[msg.status])}>
                    {statusLabels[msg.status]}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(msg.createdAt, "fr")}</span>
                  <ChevronDown size={16} className={cn("text-gray-400 transition-transform", expanded === msg.id && "rotate-180")} />
                </div>
              </div>
              {expanded === msg.id && (
                <div className="px-6 pb-5 pt-2 border-t border-gray-50">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    {msg.service && <p><span className="text-gray-400">Service :</span> <span className="text-navy">{msg.service}</span></p>}
                    {msg.budget && <p><span className="text-gray-400">Budget :</span> <span className="text-navy">{msg.budget}</span></p>}
                    {msg.phone && <p><span className="text-gray-400">Tél :</span> <span className="text-navy">{msg.phone}</span></p>}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`mailto:${msg.email}`} className="px-4 py-2 bg-sky text-white rounded-xl text-xs font-medium hover:bg-sky-dark transition-colors">
                      Répondre
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quotes Tab */}
      {tab === "devis" && (
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center text-gray-400">Aucune demande de devis</div>
          ) : quotes.map(q => (
            <div key={q.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-bold text-sm">{q.firstName[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-navy text-sm">{q.firstName} {q.lastName} — {q.projectName}</p>
                    <p className="text-xs text-gray-400">{q.serviceType} · {q.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusColors[q.status])}>
                    {statusLabels[q.status]}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(q.createdAt, "fr")}</span>
                  <ChevronDown size={16} className={cn("text-gray-400 transition-transform", expanded === q.id && "rotate-180")} />
                </div>
              </div>
              {expanded === q.id && (
                <div className="px-6 pb-5 pt-2 border-t border-gray-50">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <p><span className="text-gray-400">Email :</span> <span className="text-navy">{q.email}</span></p>
                    {q.phone && <p><span className="text-gray-400">Tél :</span> <span className="text-navy">{q.phone}</span></p>}
                    {q.company && <p><span className="text-gray-400">Entreprise :</span> <span className="text-navy">{q.company}</span></p>}
                    {q.deadline && <p><span className="text-gray-400">Délai :</span> <span className="text-navy">{q.deadline}</span></p>}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Description du projet</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{q.projectDesc}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`mailto:${q.email}`} className="px-4 py-2 bg-gold text-navy rounded-xl text-xs font-bold hover:bg-gold-dark transition-colors">
                      Envoyer le devis
                    </a>
                    <a href={`mailto:${q.email}`} className="px-4 py-2 bg-sky text-white rounded-xl text-xs font-medium hover:bg-sky-dark transition-colors">
                      Contacter
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
