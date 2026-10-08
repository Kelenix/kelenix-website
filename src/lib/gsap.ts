import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Toutes les animations vivent dans ces media queries : avec « réduire les animations »,
// rien ne bouge et la page s'affiche dans son état final.
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const POINTER = `${MOTION} and (hover: hover) and (pointer: fine)`;
export const EASE = "power3.out";

type Scope = RefObject<HTMLElement | null>;
type Query = (selector: string) => HTMLElement[];

// useGSAP + matchMedia : `setup` ne tourne que si la media query correspond, et tout
// (tweens, ScrollTriggers, SplitText) est annulé au démontage ou quand elle ne correspond plus.
export function useMotion(
  scope: Scope,
  setup: (q: Query) => void | (() => void),
  dependencies: unknown[] = [],
  query: string = MOTION
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia(scope);
      mm.add(query, () => setup(gsap.utils.selector(scope)));
    },
    { scope, dependencies, revertOnUpdate: true }
  );
}

// Une animation en boucle ne tourne que lorsque son déclencheur est à l'écran.
export function playInView(animation: gsap.core.Animation, trigger: Element | null) {
  animation.pause();
  ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? animation.play() : animation.pause()),
  });
  return animation;
}

// Compte de 0 jusqu'à la valeur de data-count (« 150+ », « 97% », « 4.9/5 ») en gardant le suffixe.
export function countUp(el: HTMLElement, vars: gsap.TweenVars = {}) {
  const m = (el.dataset.count ?? "").trim().match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const decimals = /[.,]/.test(m[1]) ? 1 : 0;
  const state = { v: 0 };
  const render = () => {
    el.textContent = state.v.toFixed(decimals) + m[2];
  };
  render();
  return gsap.to(state, { v: parseFloat(m[1].replace(",", ".")), duration: 1.6, ease: "power2.out", ...vars, onUpdate: render });
}

const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  up: { y: 40 },
  left: { x: -60 },
  right: { x: 60 },
  scale: { scale: 0.9, y: 24 },
};

// Apparitions au défilement, pilotées par des attributs dans le JSX :
//   data-reveal ("up" par défaut, "left", "right", "scale") : l'élément arrive en fondu ;
//   data-split : le titre arrive mot par mot (data-nosplit garde un groupe de mots entier) ;
//   data-lines : le titre se dévoile ligne par ligne, derrière un masque ;
//   data-count="150+" : le chiffre compte depuis zéro quand il arrive à l'écran ;
//   data-parallax="-8" : l'élément glisse de ce pourcentage pendant que son parent traverse l'écran.
// Les transitions CSS de l'élément sont coupées le temps de l'apparition pour ne pas la ralentir.
export function setupReveals(q: Query) {
  q("[data-lines]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "reveal-line",
      autoSplit: true,
      onSplit: (self) => {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.lines, {
          yPercent: 108,
          duration: 0.95,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      },
    });
  });

  q("[data-count]").forEach((el) => {
    countUp(el, { duration: 1.8, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });

  q("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax) || 0;
    gsap.fromTo(
      el,
      { yPercent: -amount },
      { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.4 } }
    );
  });

  const items = q("[data-reveal]");
  items.forEach((el) => gsap.set(el, { opacity: 0, transition: "none", ...(REVEAL_FROM[el.dataset.reveal || "up"] ?? REVEAL_FROM.up) }));
  ScrollTrigger.batch(items, {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: EASE, stagger: 0.09, overwrite: true, clearProps: "transform,transition" }),
  });

  q("[data-split]").forEach((el) => {
    const split = SplitText.create(el, { type: "words", ignore: "[data-nosplit]" });
    const parts = [...(split.words as HTMLElement[]), ...Array.from(el.querySelectorAll<HTMLElement>("[data-nosplit]"))];
    gsap.set(parts, { display: "inline-block" });
    gsap.set(el, { opacity: 1 });
    gsap.from(parts, {
      yPercent: 70,
      opacity: 0,
      rotation: 4,
      duration: 0.7,
      ease: "back.out(1.6)",
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

export function useReveal(scope: Scope, dependencies: unknown[] = []) {
  useMotion(scope, setupReveals, dependencies);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
