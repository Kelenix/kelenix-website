"use client";

import { useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

type FaqItem = { q: string; a: string };
type FaqCategory = { key: string; label: string; items: FaqItem[] };

export default function FaqAccordion({ categories, locale }: { categories: FaqCategory[]; locale: string }) {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // La réponse se déplie, l'icône « + » pivote en « × ».
  useGSAP(
    () => {
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.4;
      gsap.utils.toArray<HTMLElement>("[data-faq-panel]").forEach((panel) => {
        gsap.to(panel, { height: panel.dataset.faqPanel === openIdx ? "auto" : 0, duration, ease: "power3.inOut" });
      });
      gsap.utils.toArray<HTMLElement>("[data-faq-icon]").forEach((icon) => {
        gsap.to(icon, { rotation: icon.dataset.faqIcon === openIdx ? 135 : 0, duration, ease: "power3.inOut" });
      });
    },
    { scope: root, dependencies: [openIdx, search] }
  );

  const filtered = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      search === "" ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  const placeholder = locale === "fr" ? "Rechercher une question..." : "Search a question...";

  return (
    <div ref={root}>
      {/* Recherche */}
      <div className="relative mb-10 sm:mb-12">
        <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          aria-label={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-line bg-white py-4 pl-12 pr-5 text-[15px] text-navy transition placeholder:text-muted/70 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">{locale === "fr" ? "Aucune question ne correspond." : "No matching questions."}</p>
      ) : (
        <div className="space-y-10">
          {filtered.map(cat => (
            <div key={cat.key}>
              <h2 className="mb-4 font-display text-2xl font-medium tracking-[-0.02em] text-navy sm:text-[1.75rem]">{cat.label}</h2>
              <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
                {cat.items.map((item, idx) => {
                  const id = `${cat.key}-${idx}`;
                  const isOpen = openIdx === id;
                  return (
                    <div key={idx}>
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpenIdx(isOpen ? null : id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-${id}`}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                        >
                          <span className="text-[1.02rem] font-semibold leading-snug text-navy sm:text-lg">{item.q}</span>
                          <span data-faq-icon={id} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                            <Plus size={18} />
                          </span>
                        </button>
                      </h3>
                      <div id={`faq-${id}`} data-faq-panel={id} aria-hidden={!isOpen} className="overflow-hidden" style={{ height: 0 }}>
                        <p className="max-w-2xl px-5 pb-6 text-[15px] leading-relaxed text-muted sm:px-7 sm:text-base">{item.a}</p>
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
