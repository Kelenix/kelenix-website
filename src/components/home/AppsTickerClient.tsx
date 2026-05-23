"use client";

import { useEffect, useRef } from "react";

type App = { id: string; name: string; initial: string; color: string; category: string };

export default function AppsTickerClient({ apps }: { apps: App[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = window.innerWidth; // track starts completely off-screen to the right
    track.style.transform = `translateX(${x}px)`; // apply immediately — no flash at pos=0
    const step = () => {
      x -= 0.5;
      const half = track.scrollWidth / 2;
      if (x <= -half) x += half;
      track.style.transform = `translateX(${x}px)`;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const doubled = [...apps, ...apps];

  return (
    <div style={{ paddingTop: 6 }}>
      {/* Titre centré */}
      <p style={{ textAlign: "center", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 5 }}>
        Mes applications mobiles
      </p>
      {/* Bande défilante */}
      <div style={{ overflowX: "hidden" }}>
        <div ref={trackRef} style={{ display: "flex", alignItems: "center", width: "max-content", willChange: "transform", padding: "4px 0 8px" }}>
          {doubled.map((app, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 22px", flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: app.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat,sans-serif", fontWeight: 900, fontSize: 10, color: "#fff", flexShrink: 0, boxShadow: `0 0 8px ${app.color}55` }}>
                {app.initial}
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 10, whiteSpace: "nowrap", lineHeight: 1.2 }}>{app.name}</div>
                <div style={{ color: "#94a3b8", fontSize: 9, whiteSpace: "nowrap" }}>{app.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
