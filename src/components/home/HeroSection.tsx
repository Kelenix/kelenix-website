"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";

// Découpe "30+" / "97%" / "4.9/5" en nombre + suffixe pour l'animation de comptage.
function parseStat(raw: string): { num: number | null; suffix: string; decimals: number } {
  const m = raw.trim().match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return { num: null, suffix: raw, decimals: 0 };
  const hasDecimals = m[1].includes(".") || m[1].includes(",");
  return { num: parseFloat(m[1].replace(",", ".")), suffix: m[2], decimals: hasDecimals ? 1 : 0 };
}

function CountUpStat({ value, reduced }: { value: string; reduced: boolean }) {
  const { num, suffix, decimals } = parseStat(value);
  const [disp, setDisp] = useState(0);

  useEffect(() => {
    if (num === null) return;
    if (reduced) {
      const id = requestAnimationFrame(() => setDisp(num));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    let start: number | null = null;
    const duration = 1600;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisp(eased * num);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [num, reduced]);

  if (num === null) return <>{value}</>;
  return <>{disp.toFixed(decimals)}{suffix}</>;
}

function RotatingHighlight({ phrases, reduced }: { phrases: string[]; reduced: boolean }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduced || phrases.length <= 1) return;
    let to: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setShow(false);
      to = setTimeout(() => {
        setI((p) => (p + 1) % phrases.length);
        setShow(true);
      }, 300);
    }, 3000);
    return () => {
      clearInterval(id);
      clearTimeout(to);
    };
  }, [phrases.length, reduced]);

  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-linear-to-r from-sky via-sky-light to-gold transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      }`}
    >
      {phrases[i]}
    </span>
  );
}

export default function HeroSection({ statValues }: { statValues?: string[] }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);

  // Détection prefers-reduced-motion (différée pour éviter un setState synchrone).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    const id = requestAnimationFrame(update);
    mq.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", update);
    };
  }, []);

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

  const phrases =
    locale === "en"
      ? [t("titleHighlight"), "your growth", "your digital projects", "your transformation"]
      : [t("titleHighlight"), "votre croissance", "vos projets digitaux", "votre transformation"];

  const scrollDown = () => {
    window.scrollBy({ top: Math.round(window.innerHeight * 0.9), behavior: "smooth" });
  };

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
          <RotatingHighlight phrases={phrases} reduced={reduced} />
        </h1>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {t("subtitle")}
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/devis"
            className="group cta-pulse cta-shine flex items-center gap-2.5 px-8 py-4 bg-gold text-navy font-bold text-base rounded-2xl hover:bg-gold-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              {t("cta1")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/services"
            className="glass glass-hover flex items-center gap-2.5 px-7 py-4 text-white font-semibold text-base rounded-2xl"
          >
            {t("cta2")}
          </Link>
        </div>

        {/* Stats — cartes de verre (chiffres animés) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass glass-shine rounded-2xl px-4 py-5 text-center float-slow"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tabular-nums">
                <CountUpStat value={stat.value} reduced={reduced} />
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur de défilement */}
      <button
        type="button"
        onClick={scrollDown}
        aria-label={locale === "en" ? "Scroll down" : "Défiler vers le bas"}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors motion-safe:animate-bounce"
      >
        <ChevronDown size={30} />
      </button>
    </section>
  );
}
