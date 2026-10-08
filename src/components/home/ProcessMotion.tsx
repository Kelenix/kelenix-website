"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useMotion, useReveal } from "@/lib/gsap";

const IDLE = { backgroundColor: "#ffffff", color: "#0B1F3A", borderColor: "#E2E9F2" };
const DONE = { backgroundColor: "#0F6FE6", color: "#ffffff", borderColor: "#0F6FE6" };

// Le rail se remplit et chaque étape s'allume quand elle arrive au milieu de l'écran ;
// la carte de suivi (ordinateur) affiche l'étape en cours.
export default function ProcessMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useMotion(root, (q) => {
    const track = q("[data-track]")[0];
    const steps = q("[data-step]");
    const segments = q("[data-status-seg]");
    const title = q("[data-status-title]")[0];
    const index = q("[data-status-index]")[0];
    const final = { title: title.textContent, index: index.textContent };
    const setActive = (i: number) => {
      title.textContent = steps[i].dataset.title ?? "";
      index.textContent = String(i + 1);
    };
    setActive(0);

    gsap.fromTo(q("[data-beam]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: track, start: "top 62%", end: "bottom 62%", scrub: 0.4 } });

    steps.forEach((step, i) => {
      const scrollTrigger = { trigger: step, start: "top 68%", end: "top 50%", scrub: true };
      gsap.fromTo(step.querySelector("[data-step-badge]"), IDLE, { ...DONE, ease: "none", scrollTrigger });
      gsap.fromTo(step.querySelector("[data-step-body]"), { opacity: 0.35 }, { opacity: 1, ease: "none", scrollTrigger });
      if (segments[i]) gsap.fromTo(segments[i], { scaleX: 0 }, { scaleX: 1, transformOrigin: "0 50%", ease: "none", scrollTrigger });
      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        onEnter: () => setActive(i),
        onLeaveBack: () => setActive(Math.max(0, i - 1)),
      });
    });

    return () => {
      title.textContent = final.title;
      index.textContent = final.index;
    };
  });

  return (
    <section ref={root} className={className}>
      {children}
    </section>
  );
}
