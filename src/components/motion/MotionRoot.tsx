"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { setLenis } from "@/lib/smooth-scroll";

// Socle d'animation du site public : défilement fluide (Lenis) synchronisé avec ScrollTrigger,
// barre de progression de lecture, et attribut data-motion sur <html> (voir globals.css).
export default function MotionRoot() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const root = document.documentElement;
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
        delete root.dataset.motion;
      };
    });
  });

  // Petites boucles d'attention posées dans le JSX : data-loop="pulse" (point qui respire)
  // et data-loop="ping" (onde qui s'étend). Rescannées à chaque changement de page.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.utils.toArray<HTMLElement>("[data-loop='pulse']").forEach((el) => {
          gsap.to(el, { opacity: 0.35, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true });
        });
        gsap.utils.toArray<HTMLElement>("[data-loop='ping']").forEach((el) => {
          gsap.fromTo(el, { scale: 1, opacity: 0.35 }, { scale: 1.9, opacity: 0, duration: 1.4, ease: "power2.out", repeat: -1 });
        });
      });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  // Nouvelle page, polices ou images chargées, liste filtrée, accordéon ouvert : dès que la hauteur
  // de la page change, on recalcule les positions des déclencheurs.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] pointer-events-none">
      <div ref={bar} className="h-full bg-linear-to-r from-sky to-gold" style={{ transform: "scaleX(0)", transformOrigin: "0 50%" }} />
    </div>
  );
}
