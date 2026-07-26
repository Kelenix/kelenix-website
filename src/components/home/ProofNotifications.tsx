"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ThumbsUp, X, BadgeCheck } from "lucide-react";
import { proofItems } from "@/data/chariow";

export default function ProofNotifications() {
  const t = useTranslations("proof");
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed || proofItems.length === 0) return;
    // Première apparition
    const first = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(first);
  }, [closed]);

  useEffect(() => {
    if (closed || !visible) return;
    // Cycle : affiché ~5s, caché ~1.2s, puis suivant
    const hide = setTimeout(() => setVisible(false), 5200);
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % proofItems.length);
      setVisible(true);
    }, 6400);
    return () => {
      clearTimeout(hide);
      clearTimeout(next);
    };
  }, [visible, index, closed]);

  if (closed) return null;

  const item = proofItems[index];

  return (
    <div className="fixed bottom-4 left-4 z-[90] max-w-[330px] pointer-events-none">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-light rounded-2xl p-3.5 pr-9 shadow-xl relative pointer-events-auto"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
