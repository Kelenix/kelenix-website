"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { X, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { promo, STORE_URL } from "@/data/chariow";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";

const STORAGE_KEY = "kelenix_promo_dismissed";

export default function PromoPopup() {
  const t = useTranslations("promo");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  // Ouverture : le fond apparaît en fondu, la carte arrive avec un léger rebond.
  useGSAP(
    () => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from(root.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        gsap.from(card.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.5, ease: "back.out(1.6)" });
      });
    },
    { dependencies: [open] }
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  // Fermeture : on joue la sortie, puis on démonte.
  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setOpen(false);
    gsap.to(card.current, { scale: 0.92, y: 16, duration: 0.25, ease: "power2.in" });
    gsap.to(root.current, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => setOpen(false) });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!open) return null;

  return (
        <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Fond */}
          <div
            className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Carte */}
          <div ref={card} className="glass relative z-10 w-full max-w-md rounded-3xl p-8 text-center overflow-hidden">
            {/* Halo */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-sky/30 blur-3xl pointer-events-none" />

            <button
              onClick={close}
              className="absolute top-4 right-4 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-gray-300 hover:text-white transition-colors z-10"
              aria-label={t("close")}
            >
              <X size={18} />
            </button>

            <div className="relative">
              <div className="inline-flex items-center gap-2 glass-pill text-gold px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                <Sparkles size={15} />
                {t("badge")}
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                {t("title", { percent: promo.percent })}
              </h3>
              <p className="text-gray-300 text-sm mb-6">{t("subtitle")}</p>

              {/* Code promo */}
              <button
                onClick={copyCode}
                className="group w-full flex items-center justify-between gap-3 bg-white/10 border border-dashed border-sky/50 rounded-xl px-5 py-4 mb-5 hover:border-sky transition-colors"
              >
                <span className="font-heading text-xl font-extrabold tracking-[0.2em] text-white">
                  {promo.code}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-sky">
                  {copied ? (
                    <>
                      <Check size={16} /> {t("copied")}
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> {t("copy")}
                    </>
                  )}
                </span>
              </button>

              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="group flex items-center justify-center gap-2.5 w-full px-7 py-4 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-dark transition-all hover:scale-[1.02]"
              >
                {t("cta")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={close}
                className="mt-4 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {t("dismiss")}
              </button>
            </div>
          </div>
        </div>
  );
}
