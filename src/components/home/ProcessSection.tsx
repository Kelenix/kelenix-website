"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import {
  ShoppingCart,
  PenTool,
  Code2,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Check,
} from "lucide-react";

const steps = [
  { key: "order", icon: ShoppingCart },
  { key: "design", icon: PenTool },
  { key: "build", icon: Code2 },
  { key: "test", icon: ShieldCheck },
  { key: "deliver", icon: Rocket },
] as const;

const stepKeys = ["order", "design", "build", "test", "deliver"] as const;

/* ---------- Scène 3D "build en direct" ---------- */
function BuildScene() {
  const t = useTranslations("process");
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(reduce ? 6 : 0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setPhase((p) => (p >= 7 ? 0 : p + 1));
    }, 780);
    return () => clearInterval(id);
  }, [reduce]);

  const done = Math.min(phase, 5); // nb d'étapes cochées (0..5)
  const progress = (done / 5) * 100;
  const delivered = phase >= 5;

  const chips = [
    { icon: Code2, cls: "top-2 -right-3 text-sky", d: 0 },
    { icon: ShieldCheck, cls: "top-1/2 -left-6 text-emerald-400", d: 1.2 },
    { icon: Rocket, cls: "-bottom-2 right-6 text-gold", d: 2.1 },
  ];

  return (
    <div className="relative w-full max-w-[380px] aspect-square mx-auto" style={{ perspective: 1100 }}>
      {/* Halo */}
      <div
        className="absolute inset-6 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(47,168,255,0.35), transparent 68%)",
          animation: reduce ? "none" : "glowPulse 5s ease-in-out infinite",
        }}
      />

      {/* Anneaux orbitaux */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky/20 border-dashed"
        style={{ width: "108%", height: "108%", transform: "translate(-50%,-50%) rotateX(66deg)", animation: reduce ? "none" : "spin 26s linear infinite" }}
      />
      <div
        className="absolute left-1/2 top-1/2 rounded-full border border-gold/15"
        style={{ width: "84%", height: "84%", transform: "translate(-50%,-50%) rotateX(70deg) rotateZ(30deg)", animation: reduce ? "none" : "spin 18s linear infinite reverse" }}
      />

      {/* Panneau applicatif flottant */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0], rotateY: [-7, 7, -7], rotateX: [3, -3, 3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
        className="glass absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[74%] rounded-2xl p-4 shadow-2xl"
      >
        {/* Barre de fenêtre */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-gold/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[11px] font-semibold text-gray-300 tracking-wide">
            {t("appLabel")}
          </span>
        </div>

        {/* Checklist des étapes */}
        <div className="flex flex-col gap-2 mb-3">
          {stepKeys.map((k, i) => {
            const isDone = i < done;
            return (
              <div key={k} className="flex items-center gap-2.5">
                <span
                  className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${
                    isDone
                      ? "bg-sky border-sky scale-100"
                      : "border-white/25 scale-90"
                  }`}
                >
                  {isDone && <Check size={11} className="text-navy" strokeWidth={3.5} />}
                </span>
                <span
                  className={`text-[12px] transition-colors duration-300 ${
                    isDone ? "text-white" : "text-gray-500"
                  }`}
                >
                  {t(`steps.${k}.title`)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Barre de progression */}
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-sky to-gold"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* État */}
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold ${delivered ? "text-emerald-400" : "text-sky"}`}>
            {delivered ? t("delivered") : t("building")}
          </span>
          <span className="text-[11px] font-bold text-gray-300">{Math.round(progress)}%</span>
        </div>
      </motion.div>

      {/* Puces techno flottantes */}
      {chips.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={i}
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 4 + c.d, repeat: Infinity, ease: "easeInOut", delay: c.d }}
            className={`glass-pill absolute ${c.cls} w-11 h-11 rounded-xl flex items-center justify-center z-10`}
          >
            <Icon size={20} className={c.cls.split(" ").pop()} />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ProcessSection() {
  const t = useTranslations("process");
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 55%"],
  });
  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative py-28 bg-navy-dark overflow-hidden">
      {/* Décor */}
      <div className="aurora-bg opacity-70" />
      <div className="grid-floor opacity-50" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 glass-pill text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky to-gold">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Scène 3D */}
          <div className="relative order-1 lg:order-none">
            <BuildScene />
          </div>

          {/* Timeline des étapes */}
          <div ref={trackRef} className="relative pl-14">
            {/* Rail */}
            <div className="absolute left-[26px] top-3 bottom-3 w-[3px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="absolute inset-x-0 top-0 rounded-full bg-linear-to-b from-sky via-sky-light to-gold"
                style={{ height: beamHeight }}
              />
            </div>
            {/* Point lumineux voyageur */}
            <motion.div
              className="absolute left-[19px] w-[18px] h-[18px] rounded-full bg-sky shadow-[0_0_20px_6px_rgba(47,168,255,0.7)] z-10"
              style={{ top: dotTop }}
            />

            <div className="flex flex-col gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === steps.length - 1;
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 40, rotateY: -14 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformPerspective: 900 }}
                    className="glass glass-hover glass-shine relative rounded-2xl p-5 pl-6"
                  >
                    {/* Pastille numéro / icône, ancrée sur le rail */}
                    <div
                      className={`absolute -left-[52px] top-5 w-11 h-11 rounded-xl flex items-center justify-center border ${
                        isLast
                          ? "bg-gold/20 border-gold/50 text-gold"
                          : "bg-sky/15 border-sky/40 text-sky"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-sky/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading font-bold text-white text-lg">
                        {t(`steps.${step.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(`steps.${step.key}.description`)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-8 pl-1">
              <Link
                href="/devis"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-dark transition-all duration-200 shadow-lg hover:scale-105"
              >
                {t("cta")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
