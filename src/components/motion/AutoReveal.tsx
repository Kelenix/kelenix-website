"use client";

import { useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useMotion, setupReveals } from "@/lib/gsap";

// Mêmes sélecteurs que la règle `[data-auto-reveal]` de globals.css (pré-masquage avant le premier affichage).
const TARGETS = "h1, h2, h1 + p, h2 + p, .grid > *, form";
const HANDLED = "[data-reveal], [data-split], [data-hero], [data-no-reveal]";

// Apparitions au défilement pour les pages qui n'ont pas d'attributs data-reveal écrits à la main :
// titres, sous-titres, éléments de grille et formulaires. La page d'accueil gère ses propres animations.
// Pour exclure un bloc : data-no-reveal.
export default function AutoReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const auto = pathname !== "/";

  useMotion(
    root,
    (q) => {
      const el = root.current;
      if (!el || !auto) return;

      const marked: [HTMLElement, string][] = [];
      const mark = (target: HTMLElement, attribute: string) => {
        target.setAttribute(attribute, "");
        marked.push([target, attribute]);
      };
      // Ordre du document : un parent est marqué avant ses enfants, qui sont alors ignorés.
      q(TARGETS).forEach((target) => {
        if (target.closest(HANDLED)) return;
        // Le titre de page arrive mot par mot ; un dégradé (bg-clip-text) reste d'un seul bloc.
        if (target.tagName === "H1" && !target.classList.contains("bg-clip-text")) {
          target.querySelectorAll<HTMLElement>(".bg-clip-text").forEach((gradient) => mark(gradient, "data-nosplit"));
          mark(target, "data-split");
        } else {
          mark(target, "data-reveal");
        }
      });

      setupReveals(q);
      el.setAttribute("data-ready", "");
      return () => marked.forEach(([target, attribute]) => target.removeAttribute(attribute));
    },
    [pathname]
  );

  return (
    <div ref={root} data-auto-reveal={auto ? "" : undefined} className="contents">
      {children}
    </div>
  );
}
