"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag, ThumbsUp, X, BadgeCheck } from "lucide-react";
import { proofItems } from "@/data/chariow";
import { gsap, useGSAP, EASE } from "@/lib/gsap";

export default function ProofNotifications() {
  const t = useTranslations("proof");
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  // Cycle : première apparition après 4 s, affiché ~5 s, caché ~1 s, puis notification suivante.
  useGSAP(
    () => {
      if (closed || proofItems.length === 0) return;
      const slide = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : -30;
      gsap
        .timeline({ repeat: -1, delay: 4 })
        .fromTo(card.current, { autoAlpha: 0, x: slide, y: slide ? 10 : 0 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.45, ease: EASE })
        .to(card.current, { autoAlpha: 0, x: slide, duration: 0.4, ease: "power3.in" }, "+=4.8")
        .call(() => setIndex((i) => (i + 1) % proofItems.length))
        .to({}, { duration: 0.8 });
    },
    { dependencies: [closed] }
  );

  if (closed || proofItems.length === 0) return null;

  const item = proofItems[index];

  return (
    <div className="fixed bottom-4 left-4 z-[90] max-w-[330px] pointer-events-none">
          <div ref={card} className="glass-light rounded-2xl p-3.5 pr-9 shadow-xl relative pointer-events-auto" style={{ visibility: "hidden" }}>
            <button
              onClick={() => setClosed(true)}
              className="absolute top-2 right-2 text-gray-400 hover:text-navy transition-colors"
              aria-label={t("close")}
            >
              <X size={15} />
            </button>

            <div className="flex items-start gap-3">
              {/* Icône */}
              <div
                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.type === "purchase"
                    ? "bg-sky/15 text-sky"
                    : "bg-emerald-500/15 text-emerald-500"
                }`}
              >
                {item.type === "purchase" ? <ShoppingBag size={18} /> : <ThumbsUp size={18} />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-navy text-sm">
                    {item.name} {item.flag}
                  </span>
                  <span className="text-[11px] text-gray-400">· {item.country}</span>
                </div>

                {item.type === "purchase" ? (
                  <p className="text-[13px] text-gray-600 leading-snug">
                    {t("bought")} <span className="font-semibold text-navy">{item.product}</span>
                  </p>
                ) : (
                  <p className="text-[13px] text-gray-600 leading-snug italic line-clamp-2">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-1 mt-1">
                  <BadgeCheck size={12} className="text-emerald-500" />
                  <span className="text-[10px] text-gray-400">
                    {t("verified")} · {item.when}
                  </span>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}
