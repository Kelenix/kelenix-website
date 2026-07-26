"use client";

import { useRef } from "react";
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

/* ---------- Cube 3D "logiciel livré" ---------- */
function SoftwareCube() {
  const reduce = useReducedMotion();
  const face =
    "absolute inset-0 flex items-center justify-center rounded-2xl border border-sky/40 " +
    "bg-[linear-gradient(135deg,rgba(47,168,255,0.28),rgba(11,31,58,0.35))] backdrop-blur-md";
  const S = 132; // demi-arête
  return (
    <div
      className="relative"
      style={{ width: S * 2, height: S * 2, perspective: 900 }}
    >
      {/* Halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(47,168,255,0.45), transparent 65%)",
          animation: reduce ? "none" : "glowPulse 4s ease-in-out infinite",
        }}
      />
      {/* Cube */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          animation: reduce ? "none" : "spin3d 14s linear infinite",
        }}
      >
        <div className={face} style={{ transform: `rotateY(0deg) translateZ(${S}px)` }}>
          <Check className="text-sky" size={54} strokeWidth={2.5} />
        </div>
        <div className={face} style={{ transform: `rotateY(90deg) translateZ(${S}px)` }}>
          <Code2 className="text-sky-light" size={48} />
        </div>
        <div className={face} style={{ transform: `rotateY(180deg) translateZ(${S}px)` }}>
          <Rocket className="text-gold" size={48} />
        </div>
        <div className={face} style={{ transform: `rotateY(-90deg) translateZ(${S}px)` }}>
          <span className="font-heading font-black text-2xl text-white/90">K</span>
        </div>
        <div className={face} style={{ transform: `rotateX(90deg) translateZ(${S}px)` }} />
        <div className={face} style={{ transform: `rotateX(-90deg) translateZ(${S}px)` }} />
      </div>
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
          <div
            className="relative flex items-center justify-center order-1 lg:order-none"
            style={{ perspective: 1000 }}
          >
            <div className="float-slow">
              <SoftwareCube />
            </div>
            {/* Socle réfléchissant */}
            <div
              className="absolute bottom-4 w-64 h-8 rounded-[100%] blur-md"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(47,168,255,0.35), transparent 70%)",
              }}
            />
            <span className="absolute -bottom-2 text-xs uppercase tracking-[0.25em] text-sky/70 font-semibold">
              {t("cubeLabel")}
            </span>
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
