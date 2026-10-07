"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Users, Calendar, Cpu, Star } from "lucide-react";
import { gsap, useReveal, useMotion, countUp } from "@/lib/gsap";

export default function StatsSection({ statValues }: { statValues?: string[] }) {
  const t = useTranslations("stats");
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Chaque chiffre compte de 0 à sa valeur quand il arrive à l'écran, son icône rebondit.
  useMotion(root, (q) => {
    q("[data-stat]").forEach((stat, i) => {
      const trigger = { trigger: stat, start: "top 85%", once: true };
      const value = stat.querySelector<HTMLElement>("[data-count]");
      if (value) countUp(value, { duration: 2, delay: i * 0.12, scrollTrigger: trigger });
      gsap.from(stat.querySelector("[data-stat-icon]"), { scale: 0, rotation: -30, duration: 0.7, delay: i * 0.12, ease: "back.out(2.5)", scrollTrigger: trigger });
    });
  });

  const defaults = [
    { icon: Briefcase, value: "150+", label: t("projects") },
    { icon: Users, value: "80+", label: t("clients") },
    { icon: Calendar, value: "5+", label: t("years") },
    { icon: Cpu, value: "15+", label: t("technologies") },
    { icon: Star, value: "97%", label: t("satisfaction") },
  ];
  const stats = defaults.map((d, i) => ({ ...d, value: statValues?.[i]?.trim() || d.value }));

  return (
    <section ref={root} className="py-24 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,168,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,193,7,0.04)_0%,transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span data-reveal className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 data-split className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} data-stat data-reveal className="text-center">
              <div data-stat-icon className="w-14 h-14 rounded-2xl bg-sky/10 border border-sky/20 flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-sky" />
              </div>
              <div data-count={value} className="font-heading text-4xl font-extrabold text-white mb-1 tabular-nums">
                {value}
              </div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
