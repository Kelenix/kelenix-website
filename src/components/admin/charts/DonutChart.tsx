"use client";

import { useEffect, useState } from "react";

type Slice = { label: string; value: number; color: string };
type Props = { data: Slice[]; emptyLabel?: string };

const SIZE = 160;
const STROKE = 26;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function DonutChart({ data, emptyLabel = "Aucune donnée" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return <p className="text-muted text-sm py-8 text-center">{emptyLabel}</p>;
  }

  const fracs = data.map((d) => d.value / total);
  const arcs = data.map((d, i) => ({
    ...d,
    frac: fracs[i],
    len: fracs[i] * C,
    dashOffset: fracs.slice(0, i).reduce((s, f) => s + f, 0) * C,
  }));

  const centerValue = hover !== null ? data[hover].value : total;
  const centerLabel = hover !== null ? data[hover].label : "Total";

  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-6 @sm:flex-row">
        <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full -rotate-90">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#F3F7FC" strokeWidth={STROKE} />
            {arcs.map((a, i) => (
              <circle
                key={i}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={hover === i ? STROKE + 4 : STROKE}
                strokeDasharray={`${mounted ? a.len : 0} ${C}`}
                strokeDashoffset={-a.dashOffset}
                strokeLinecap="butt"
                style={{ transition: "stroke-dasharray 900ms ease, stroke-width 150ms ease", cursor: "pointer" }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display text-3xl font-medium leading-none tracking-[-0.02em] text-navy">{centerValue}</span>
            <span className="text-[11px] text-muted max-w-[90px] text-center leading-tight truncate">{centerLabel}</span>
          </div>
        </div>

        {/* Légende */}
        <div className="w-full min-w-0 space-y-2">
          {arcs.map((a, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1 transition-colors ${hover === i ? "bg-mist" : ""}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: a.color }} />
                <span className="truncate text-xs text-muted" title={a.label}>{a.label}</span>
              </div>
              <span className="text-xs font-semibold text-navy flex-shrink-0">
                {a.value} · {Math.round(a.frac * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
