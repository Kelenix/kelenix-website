"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { setLenis } from "@/lib/smooth-scroll";

// Socle d'animation du site public : défilement fluide (Lenis) synchronisé avec ScrollTrigger,
// barre de progression de lecture, et classe `anim` sur <html> qui masque les éléments à révéler.
export default function MotionRoot() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const root = document.documentElement;
      root.classList.add("anim");
      root.dataset.motion = "on";

      const lenis = new Lenis({ anchors: true, stopInertiaOnNavigate: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
        root.classList.remove("anim");
        delete root.dataset.motion;
      };
    });
  });

  // Nouvelle page ou polices chargées : les hauteurs ont changé, on recalcule les déclencheurs.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] pointer-events-none">
      <div ref={bar} className="h-full bg-linear-to-r from-sky to-gold" style={{ transform: "scaleX(0)", transformOrigin: "0 50%" }} />
    </div>
  );
}
