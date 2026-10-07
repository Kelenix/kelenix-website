import type Lenis from "lenis";

// Instance Lenis active (créée par MotionRoot), ou null si « réduire les animations » est activé.
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: "smooth" });
}
