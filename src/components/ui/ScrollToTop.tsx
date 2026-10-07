"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToY } from "@/lib/smooth-scroll";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => scrollToY(0);

  return (
    <button
      onClick={scrollTop}
      aria-label="Retour en haut"
      className={cn(
        "fixed bottom-[calc(6rem+var(--quote-bar,0px))] right-6 z-40 w-10 h-10 rounded-full",
        "bg-navy/80 backdrop-blur border border-white/20 text-white",
        "flex items-center justify-center shadow-lg",
        "hover:bg-sky hover:border-sky transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ChevronUp size={18} />
    </button>
  );
}
