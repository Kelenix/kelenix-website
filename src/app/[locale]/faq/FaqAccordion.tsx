"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };
type FaqCategory = { key: string; label: string; items: FaqItem[] };

export default function FaqAccordion({ categories, locale }: { categories: FaqCategory[]; locale: string }) {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const filtered = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      search === "" ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={locale === "fr" ? "Rechercher une question..." : "Search a question..."}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/10 transition-all shadow-card"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>{locale === "fr" ? "Aucune question ne correspond." : "No matching questions."}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map(cat => (
            <div key={cat.key}>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-sky inline-block" />
                {cat.label}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item, idx) => {
                  const id = `${cat.key}-${idx}`;
                  const isOpen = openIdx === id;
                  return (
                    <div key={idx} className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : id)}
                        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
                      >
                        <span className="font-medium text-navy text-sm leading-relaxed">{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={cn(
                            "text-sky flex-shrink-0 transition-transform duration-300",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          isOpen ? "max-h-96" : "max-h-0"
                        )}
                      >
                        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
