"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection({ statValues }: { statValues?: string[] }) {
  const t = useTranslations("hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

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
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const stats = [
    { value: statValues?.[0] ?? t("stat1Value"), label: t("stat1Label") },
    { value: statValues?.[1] ?? t("stat2Value"), label: t("stat2Label") },
    { value: statValues?.[2] ?? t("stat3Value"), label: t("stat3Label") },
    { value: statValues?.[3] ?? t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center overflow-hidden">
      {/* Aurora / mesh gradient */}
      <div className="aurora-bg" />

      {/* Grille en perspective */}
      <div className="grid-floor opacity-60" />

      {/* Réseau de particules animé */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

      {/* Superpositions de dégradé */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-navy/70" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-5xl py-28 text-center">
        {/* Badge de verre */}
        <div className="inline-flex items-center gap-2 glass-pill rounded-full px-5 py-2 mb-8 animate-fade-in">
          <Sparkles size={15} className="text-sky" />
          <span className="text-sky text-sm font-medium">{t("badge")}</span>
        </div>

        {/* Titre */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-6 animate-slide-up tracking-tight text-balance">
          <span className="lg:whitespace-nowrap">{t("title")}</span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sky via-sky-light to-gold">
            {t("titleHighlight")}
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {t("subtitle")}
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/devis"
            className="group flex items-center gap-2.5 px-7 py-4 bg-gold text-navy font-bold text-base rounded-2xl hover:bg-gold-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {t("cta1")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="glass glass-hover flex items-center gap-2.5 px-7 py-4 text-white font-semibold text-base rounded-2xl"
          >
            {t("cta2")}
          </Link>
        </div>

        {/* Stats — cartes de verre */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass glass-shine rounded-2xl px-4 py-5 text-center float-slow"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
