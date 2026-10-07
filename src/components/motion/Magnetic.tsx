"use client";

import { useRef } from "react";
import { gsap, useMotion, POINTER } from "@/lib/gsap";

// Bouton magnétique : le contenu suit légèrement la souris. Uniquement avec une vraie souris.
// Le mouvement est porté par ce wrapper pour ne pas se battre avec les transitions CSS du bouton.
export default function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useMotion(
    ref,
    () => {
      const el = ref.current;
      if (!el) return;
      const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.4);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    [],
    POINTER
  );

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ""}`}>
      {children}
    </span>
  );
}
