"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/gsap";

// Enveloppe cliente minimale : le contenu reste rendu côté serveur, seules les apparitions
// au défilement (attributs data-reveal, data-lines, data-count, data-parallax) sont branchées ici.
export default function Reveal({
  as: Tag = "section",
  className,
  id,
  children,
}: {
  as?: "section" | "div" | "footer";
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <Tag ref={root as React.RefObject<HTMLDivElement>} id={id} className={className}>
      {children}
    </Tag>
  );
}
