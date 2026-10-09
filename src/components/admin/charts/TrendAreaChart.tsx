"use client";

import { useEffect, useState } from "react";

type Series = { name: string; color: string; data: number[] };
type Props = { labels: string[]; series: Series[] };

const W = 640;
const H = 260;
const PAD = { l: 34, r: 16, t: 16, b: 28 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

export default function TrendAreaChart({ labels, series }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const n = labels.length;
  const maxVal = Math.max(1, ...series.flatMap((s) => s.data));
  // Arrondi "joli" pour l'échelle haute.
  const niceMax = niceCeil(maxVal);

  const x = (i: number) => (n <= 1 ? PAD.l + plotW / 2 : PAD.l + (i / (n - 1)) * plotW);
  const y = (v: number) => PAD.t + plotH - (v / niceMax) * plotH;

  const gridLines = 4;

  const handleMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const vbX = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((vbX - PAD.l) / plotW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div className="no-scrollbar w-full overflow-x-auto">
      {/* Légende */}
      <div className="flex items-center gap-5 mb-2">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs font-medium text-muted">{s.name}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[440px]" role="img">
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`area-grad-${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Gridlines + labels Y */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const val = (niceMax / gridLines) * (gridLines - i);
          const yy = PAD.t + (plotH / gridLines) * i;
          return (
            <g key={i}>
              <line x1={PAD.l} y1={yy} x2={W - PAD.r} y2={yy} stroke="#E2E9F2" strokeWidth={1} />
              <text x={PAD.l - 6} y={yy + 4} textAnchor="end" fontSize={11} fill="#55657D">
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Labels X */}
        {labels.map((lab, i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill="#55657D">
            {lab}
          </text>
        ))}

        {/* Aires + lignes */}
        {series.map((s, si) => {
          const linePts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
          const areaPath = `M ${x(0)},${y(s.data[0])} ${s.data
            .map((v, i) => `L ${x(i)},${y(v)}`)
            .join(" ")} L ${x(n - 1)},${PAD.t + plotH} L ${x(0)},${PAD.t + plotH} Z`;
          return (
            <g key={si} style={{ opacity: mounted ? 1 : 0, transition: "opacity 700ms ease" }}>
              <path d={areaPath} fill={`url(#area-grad-${si})`} />
              <polyline
                points={linePts}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Survol : ligne verticale + points + tooltip */}
        {hover !== null && (
          <g>
            <line x1={x(hover)} y1={PAD.t} x2={x(hover)} y2={PAD.t + plotH} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            {series.map((s, si) => (
              <circle key={si} cx={x(hover)} cy={y(s.data[hover])} r={4} fill="#fff" stroke={s.color} strokeWidth={2.5} />
            ))}
            <Tooltip hover={hover} x={x(hover)} labels={labels} series={series} />
          </g>
        )}

        {/* Zone de capture du survol */}
        <rect
          x={PAD.l}
          y={PAD.t}
          width={plotW}
          height={plotH}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>
    </div>
  );
}

function Tooltip({ hover, x, labels, series }: { hover: number; x: number; labels: string[]; series: Series[] }) {
  const boxW = 118;
  const rows = series.length;
  const boxH = 20 + rows * 15;
  const tx = Math.min(Math.max(x - boxW / 2, PAD.l), W - PAD.r - boxW);
  const ty = PAD.t + 4;
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect x={tx} y={ty} width={boxW} height={boxH} rx={8} fill="#0B1F3A" opacity={0.95} />
      <text x={tx + 10} y={ty + 15} fontSize={9} fill="#9aa5b1">
        {labels[hover]}
      </text>
      {series.map((s, i) => (
        <g key={i}>
          <circle cx={tx + 13} cy={ty + 27 + i * 15} r={3} fill={s.color} />
          <text x={tx + 22} y={ty + 30 + i * 15} fontSize={10} fill="#fff">
            {s.name}
          </text>
          <text x={tx + boxW - 10} y={ty + 30 + i * 15} textAnchor="end" fontSize={10} fontWeight={700} fill="#fff">
            {s.data[hover]}
          </text>
        </g>
      ))}
    </g>
  );
}

function niceCeil(v: number): number {
  if (v <= 5) return 5;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / (pow / 2)) * (pow / 2);
}
