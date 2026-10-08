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
        "fixed bottom-[calc(6rem+var(--quote-bar,0px))] right-6 z-40 w-11 h-11 rounded-full cursor-pointer",
        "bg-white border border-line text-navy",
        "hidden lg:flex items-center justify-center shadow-[0_10px_30px_-12px_rgba(11,31,58,0.35)]",
        "hover:bg-navy hover:border-navy hover:text-white transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ChevronUp size={18} />
    </button>
  );
}
