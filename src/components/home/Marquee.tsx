"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useMotion, MOTION } from "@/lib/gsap";

// Rangée défilante (ordinateur) : le défilement de la page l'accélère et l'inverse quand on remonte,
// le survol la met en pause. La piste [data-marquee] contient la liste deux fois, pour boucler sans couture.
// Sans animation, la rangée reste défilable à la main.
export default function Marquee({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    root,
    (q) => {
      const rows = root.current;
      const track = q("[data-marquee]")[0];
      if (!rows || !track) return;
      gsap.set(rows, { overflowX: "hidden" });

      const loop = gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: track.scrollWidth / 2 / 45, ease: "none", repeat: -1 });
      // Avance dans le temps pour pouvoir aussi tourner à l'envers sans buter sur le début.
      loop.totalTime(loop.duration() * 500);

      let direction = 1;
      let hovered = false;
      const cruise = () => gsap.to(loop, { timeScale: hovered ? 0 : direction, duration: 0.8, ease: "power2.out", overwrite: true });
      const settle = gsap.delayedCall(0.2, cruise).pause();

      ScrollTrigger.create({
        trigger: rows,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loop.paused(!self.isActive),
        onUpdate: (self) => {
          if (hovered) return;
          const velocity = self.getVelocity();
          direction = velocity < 0 ? -1 : 1;
          gsap.to(loop, { timeScale: direction * (1 + Math.min(Math.abs(velocity) / 350, 5)), duration: 0.2, overwrite: true });
          settle.restart(true);
        },
      });

      const enter = () => {
        hovered = true;
        cruise();
      };
      const leave = () => {
        hovered = false;
        cruise();
      };
      rows.addEventListener("pointerenter", enter);
      rows.addEventListener("pointerleave", leave);
      return () => {
        rows.removeEventListener("pointerenter", enter);
        rows.removeEventListener("pointerleave", leave);
      };
    },
    [],
    `${MOTION} and (min-width: 1024px)`
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
