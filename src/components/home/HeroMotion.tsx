"use client";

import { useRef } from "react";
import { gsap, useMotion, playInView, EASE, POINTER } from "@/lib/gsap";

// Compte jusqu'au nombre affiché (« 48 250 € », « €1,204 ») en gardant sa mise en forme, puis rend le texte d'origine.
function countTo(el: HTMLElement) {
  const text = el.textContent ?? "";
  const match = text.match(/\d[\d\s.,  ]*\d|\d/);
  if (!match) return null;
  const target = Number(match[0].replace(/\D/g, ""));
  const format = new Intl.NumberFormat(document.documentElement.lang || "fr");
  const state = { v: 0 };
  return gsap.to(state, {
    v: target,
    duration: 1.6,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = text.replace(match[0], format.format(Math.round(state.v)));
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
}

// Anime le hero : le texte reste fixe (affichage immédiat), la maquette monte et se construit.
export default function HeroMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (q) => {
    const section = root.current;
    const one = (selector: string) => q(selector)[0];
    const mock = one("[data-mock]");
    const phone = one("[data-phone]");
    const toast = one("[data-toast]");
    const glows = q("[data-glow]");
    const halo = glows[0].parentElement;

    /* ---- Entrée : le halo se lève, la maquette monte et son contenu se met en place ---- */
    const intro = gsap.timeline({ defaults: { ease: EASE } });
    intro
      .set(halo, { opacity: 1 })
      .fromTo(glows, { opacity: 0, scale: 0.6, y: 180 }, { opacity: 1, scale: 1, y: 0, duration: 1.6, stagger: 0.12 }, 0)
      .fromTo(
        mock,
        { opacity: 0, y: 110, rotationX: 16, transformPerspective: 1400, transformOrigin: "50% 0%" },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.3 },
        0.1
      )
      .from(q("[data-mock-nav] > *"), { opacity: 0, x: -14, duration: 0.45, stagger: 0.05 }, 0.55)
      .from(q("[data-kpi]"), { opacity: 0, y: 18, duration: 0.55, stagger: 0.09 }, 0.6)
      .from(one("[data-chart-area]"), { opacity: 0, duration: 1 }, 1.3)
      .fromTo(one("[data-chart-line]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0.8)
      .from(q("[data-order]"), { opacity: 0, y: 12, duration: 0.45, stagger: 0.08 }, 0.95)
      .fromTo(phone, { opacity: 0, y: 140 }, { opacity: 1, y: 0, duration: 1.2 }, 0.5)
      .from(q("[data-bar]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.6, stagger: 0.05, ease: "back.out(1.8)" }, 1.2)
      .fromTo(one("[data-stepper]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, 1);
    q("[data-num]").forEach((el, i) => {
      const tween = countTo(el);
      if (tween) intro.add(tween, 0.7 + i * 0.1);
    });

    /* ---- Les cinq étapes s'allument une à une, puis la mise en ligne est annoncée ---- */
    const dots = q("[data-step-dot]");
    const labels = q("[data-step-label]");
    const last = dots.length - 1;
    const idle = { backgroundColor: "#E2E9F2", scale: 1 };
    const now = { immediateRender: true };
    const steps = gsap.timeline({ repeat: -1, repeatDelay: 0.4, delay: 1.5 });
    steps
      .set(dots, { ...idle, ...now }, 0)
      .set(q("[data-step-dot] svg"), { scale: 0, ...now }, 0)
      .set(labels, { color: "#8492A6", ...now }, 0)
      .set(toast, { opacity: 0, y: 16, scale: 0.9, ...now }, 0);
    dots.forEach((dot, i) => {
      const at = 0.4 + i * 0.9;
      steps
        .to(dot, { backgroundColor: i === last ? "#10B981" : "#0F6FE6", scale: 1.2, duration: 0.3, ease: "back.out(3)" }, at)
        .to(dot, { scale: 1, duration: 0.3 }, at + 0.3)
        .to(dot.querySelector("svg"), { scale: 1, duration: 0.3, ease: "back.out(3)" }, at + 0.15)
        .to(labels[i], { color: "#0B1F3A", duration: 0.3 }, at);
    });
    steps
      .to(toast, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(2)" }, ">-0.1")
      .to(toast, { opacity: 0, y: -8, duration: 0.35, ease: "power2.in" }, "+=4");
    playInView(steps, section);

    /* ---- Sortie : légère parallaxe quand on quitte le hero ---- */
    const scrollTrigger = { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 };
    gsap.to(one("[data-mock-tilt]"), { yPercent: -5, ease: "none", scrollTrigger });
    if (phone) gsap.to(phone, { yPercent: -22, ease: "none", scrollTrigger });
    gsap.to(halo, { yPercent: 10, ease: "none", scrollTrigger });
  });

  // Avec une souris : la maquette s'incline légèrement vers le pointeur, le téléphone un peu plus.
  useMotion(
    root,
    (q) => {
      const section = root.current;
      const tilt = q("[data-mock-tilt]")[0];
      const phone = q("[data-phone]")[0];
      if (!section || !tilt) return;
      gsap.set(tilt, { transformPerspective: 1600 });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: EASE });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: EASE });
      const px = phone ? gsap.quickTo(phone, "x", { duration: 0.9, ease: EASE }) : null;
      const move = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        ry(dx * 4);
        rx(dy * -3);
        px?.(dx * 18);
      };
      const leave = () => {
        rx(0);
        ry(0);
        px?.(0);
      };
      section.addEventListener("pointermove", move);
      section.addEventListener("pointerleave", leave);
      return () => {
        section.removeEventListener("pointermove", move);
        section.removeEventListener("pointerleave", leave);
      };
    },
    [],
    POINTER
  );

  return (
    <section ref={root} className={className}>
      {children}
    </section>
  );
}
