"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 60;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(47, 168, 255, 0.6)";
        ctx.fill();

        nodes.forEach((m) => {
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(47, 168, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,168,255,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-5xl py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-sky/10 border border-sky/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-sky animate-pulse" />
            <span className="text-sky text-sm font-medium">{t("badge")}</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
            {t("title")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-gold">
              {t("titleHighlight")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/devis"
              className="group flex items-center gap-2.5 px-7 py-4 bg-gold text-navy font-bold text-base rounded-xl hover:bg-gold-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t("cta1")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-2.5 px-7 py-4 bg-white/10 border border-white/20 text-white font-semibold text-base rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              {t("cta2")}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-l from-sky/5 to-transparent pointer-events-none" />
    </section>
  );
}
