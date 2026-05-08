"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Users, Calendar, Cpu, Star } from "lucide-react";

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatCard({ icon: Icon, value, suffix, label, delay }: {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-14 h-14 rounded-2xl bg-sky/10 border border-sky/20 flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-sky" />
      </div>
      <div className="font-heading text-4xl font-extrabold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const t = useTranslations("stats");

  const stats = [
    { icon: Briefcase, value: 150, suffix: "+", label: t("projects") },
    { icon: Users, value: 80, suffix: "+", label: t("clients") },
    { icon: Calendar, value: 5, suffix: "+", label: t("years") },
    { icon: Cpu, value: 15, suffix: "+", label: t("technologies") },
    { icon: Star, value: 97, suffix: "%", label: t("satisfaction") },
  ];

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,168,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,193,7,0.04)_0%,transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
