"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      aria-label="Retour en haut"
      className={cn(
        "fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full",
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
