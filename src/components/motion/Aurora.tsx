"use client";

import { useRef } from "react";
import { gsap, useMotion, playInView } from "@/lib/gsap";

// Fond « aurora » : deux halos flous qui dérivent lentement, seulement quand ils sont à l'écran.
export default function Aurora({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, (q) => {
    const drift = gsap
      .timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
      .to(q("[data-aurora='a']"), { xPercent: 30, yPercent: 22, scale: 1.25, duration: 18 }, 0)
      .to(q("[data-aurora='b']"), { xPercent: -28, yPercent: -18, scale: 0.9, duration: 18 }, 0);
    playInView(drift, root.current);
  });

  return (
    <div ref={root} aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        data-aurora="a"
        className="absolute -top-[12%] -left-[8%] w-[46vw] h-[46vw] rounded-full blur-[70px] opacity-55"
        style={{ background: "radial-gradient(circle at center, rgba(47,168,255,0.55), transparent 70%)" }}
      />
      <div
        data-aurora="b"
        className="absolute -bottom-[14%] -right-[6%] w-[40vw] h-[40vw] rounded-full blur-[70px] opacity-55"
        style={{ background: "radial-gradient(circle at center, rgba(255,193,7,0.30), transparent 70%)" }}
      />
    </div>
  );
}
