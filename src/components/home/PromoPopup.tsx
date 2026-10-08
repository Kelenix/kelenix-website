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
    <div ref={root} className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4">
      {/* Fond */}
      <div className="absolute inset-0 bg-navy/45" onClick={close} />

      {/* Carte */}
      <div ref={card} role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white p-6 text-center shadow-[0_30px_80px_-30px_rgba(11,31,58,0.5)] sm:p-8">
        {/* Halo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(47,168,255,0.22),transparent)]" />

        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-mist text-navy transition-colors hover:bg-line"
          aria-label={t("close")}
        >
          <X size={18} />
        </button>

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-sm font-semibold text-navy">
            <Sparkles size={15} />
            {t("badge")}
          </div>

          <h3 className="mb-3 font-display text-3xl font-medium leading-tight tracking-[-0.02em] text-navy sm:text-4xl">{t("title", { percent: promo.percent })}</h3>
          <p className="mb-6 text-[15px] text-muted">{t("subtitle")}</p>

          {/* Code promo */}
          <button
            type="button"
            onClick={copyCode}
            className="mb-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-azure/50 bg-mist px-5 py-4 transition-colors hover:border-azure"
          >
            <span className="text-xl font-bold tracking-[0.2em] text-navy">{promo.code}</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-azure">
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
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-azure px-7 py-4 font-semibold text-white transition-colors hover:bg-azure-dark"
          >
            {t("cta")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>

          <button type="button" onClick={close} className="mt-4 cursor-pointer text-sm text-muted transition-colors hover:text-navy">
            {t("dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
