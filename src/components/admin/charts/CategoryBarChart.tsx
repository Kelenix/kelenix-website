"use client";

import { useEffect, useState } from "react";

type Item = { label: string; value: number };
type Props = { data: Item[]; color?: string; emptyLabel?: string };

export default function CategoryBarChart({ data, color = "#0F6FE6", emptyLabel = "Aucune donnée" }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (data.length === 0) {
    return <p className="text-muted text-sm py-8 text-center">{emptyLabel}</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted truncate pr-2">{d.label}</span>
              <span className="text-xs font-bold text-navy flex-shrink-0">{d.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-mist overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: mounted ? `${pct}%` : "0%",
                  backgroundColor: color,
                  transition: `width 800ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
