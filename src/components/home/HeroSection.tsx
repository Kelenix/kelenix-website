"use client";

import { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles, ChevronDown, Lock, Check, FileText, PenTool, Code2, ShieldCheck, Rocket } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import Aurora from "@/components/motion/Aurora";
import { gsap, SplitText, useMotion, playInView, countUp, EASE, POINTER } from "@/lib/gsap";
import { scrollToY } from "@/lib/smooth-scroll";

const stepIcons = [FileText, PenTool, Code2, ShieldCheck, Rocket];

// Texte découpé en lettres pour l'effet « machine à écrire » de la démo.
function Typed({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} data-c>
          {ch}
        </span>
      ))}
    </>
  );
}

// Bloc de la page en construction : un contour pointillé (maquette) puis un remplissage (développement).
function Block({ className, fill, children }: { className: string; fill: string; children?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <span data-wire className="absolute inset-0 rounded-[inherit] border border-dashed border-white/35 opacity-0" />
      <span data-fill className={`absolute inset-0 rounded-[inherit] ${fill}`}>
        {children}
      </span>
    </div>
  );
}

function TestBadge({ className }: { className: string }) {
  return (
    <span data-check className={`absolute z-10 w-4 h-4 rounded-full bg-emerald-400 text-navy-dark flex items-center justify-center opacity-0 ${className}`}>
      <Check size={10} strokeWidth={4} />
    </span>
  );
}

/* ---------- Démo : un projet client se construit, du devis à la mise en ligne ----------
   Sans animation (« réduire les animations »), le JSX affiche directement l'état final. */
function HeroLab() {
  const t = useTranslations("hero.lab");
  const steps = t.raw("steps") as string[];
  const cmds = t.raw("cmds") as string[];
  const outs = t.raw("outs") as string[];

  return (
    <div data-hero data-lab role="img" aria-label={t("aria")} className="relative w-full max-w-xl mx-auto lg:max-w-none">
      <div data-lab-tilt aria-hidden="true" className="relative">
        <div className="glass rounded-3xl p-3 sm:p-4">
          {/* Fenêtre de navigateur */}
          <div className="relative rounded-2xl bg-navy-dark/85 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              <div className="flex-1 min-w-0 ml-1.5 flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-gray-300">
                <Lock data-lab-lock size={11} className="text-emerald-400 shrink-0" />
                <span data-lab-url className="truncate">
                  <Typed text={t("url")} />
                </span>
              </div>
              <span className="grid text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                <span data-lab-draft className="[grid-area:1/1] invisible rounded-full bg-white/10 text-gray-300 px-2.5 py-1 text-center">
                  {t("draft")}
                </span>
                <span data-lab-live className="[grid-area:1/1] flex items-center justify-center gap-1.5 rounded-full bg-emerald-400/15 text-emerald-300 px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {t("live")}
                </span>
              </span>
            </div>

            {/* Page en construction */}
            <div className="relative flex flex-col gap-4 p-4 sm:p-5 aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
              <div className="relative flex items-center gap-2">
                <Block className="w-3.5 h-3.5 rounded-full" fill="bg-sky" />
                <span className="flex-1" />
                <Block className="w-7 h-1.5 rounded-full" fill="bg-white/40" />
                <Block className="w-7 h-1.5 rounded-full" fill="bg-white/40" />
                <Block className="w-7 h-1.5 rounded-full" fill="bg-white/40" />
                <Block className="w-11 h-4 rounded-full" fill="bg-white/15" />
                <TestBadge className="-top-1.5 -right-1.5" />
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-[1.15fr_1fr] gap-4">
                <div className="flex flex-col justify-center gap-2">
                  <Block className="h-3.5 w-[92%] rounded" fill="bg-white" />
                  <Block className="h-3.5 w-[64%] rounded" fill="bg-linear-to-r from-sky to-gold" />
                  <Block className="h-1.5 w-[84%] rounded-full mt-1.5" fill="bg-white/30" />
                  <Block className="h-1.5 w-[58%] rounded-full" fill="bg-white/30" />
                  <Block className="h-5 w-20 rounded-full mt-2" fill="bg-gold" />
                </div>
                <div className="relative">
                  <Block className="h-full rounded-xl" fill="bg-linear-to-br from-sky/35 to-navy-light">
                    <span className="absolute inset-x-3 bottom-3 top-4 flex items-end gap-1.5">
                      {[42, 58, 50, 76, 100].map((h, i) => (
                        <span
                          key={i}
                          data-bar
                          className={`flex-1 rounded-t ${i === 4 ? "bg-gold" : "bg-sky/80"}`}
                          style={{ height: `${h}%`, transformOrigin: "50% 100%" }}
                        />
                      ))}
                    </span>
                  </Block>
                  <TestBadge className="-top-1.5 -right-1.5" />
                </div>
              </div>

              <div className="relative grid grid-cols-3 gap-2.5">
                {["bg-sky", "bg-gold", "bg-emerald-400"].map((dot) => (
                  <Block key={dot} className="h-9 sm:h-11 rounded-lg" fill="bg-white/10">
                    <span className="absolute inset-0 flex items-center gap-2 px-2.5">
                      <span className={`w-3 h-3 rounded ${dot} shrink-0`} />
                      <span className="flex-1 h-1.5 rounded-full bg-white/30" />
                    </span>
                  </Block>
                ))}
                <TestBadge className="-top-1.5 -right-1.5" />
              </div>

              {/* Reflet qui balaie la page à la mise en ligne */}
              <span data-lab-sweep className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 pointer-events-none" />
            </div>
          </div>

          {/* Console : une commande par étape, puis son résultat */}
          <div className="mt-3 grid rounded-xl bg-navy-dark/85 border border-white/10 px-4 py-3 font-mono text-[11px] sm:text-[13px] leading-relaxed text-left">
            {cmds.map((cmd, i) => (
              <div key={cmd} data-lab-line className={`[grid-area:1/1] ${i < cmds.length - 1 ? "invisible" : ""}`}>
                <p className="text-white truncate">
                  <span className="text-sky">$ </span>
                  <Typed text={cmd} />
                </p>
                <p data-lab-out className="text-emerald-300 truncate">
                  ✓ {outs[i]}
                </p>
              </div>
            ))}
          </div>

          {/* Les cinq étapes */}
          <ol className="relative mt-3 grid grid-cols-5">
            <li aria-hidden="true" className="absolute top-[17px] left-[10%] right-[10%] h-0.5 rounded-full bg-white/10">
              <span data-lab-rail className="block h-full rounded-full bg-linear-to-r from-sky to-gold" style={{ transformOrigin: "0 50%" }} />
            </li>
            {steps.map((label, i) => {
              const Icon = stepIcons[i];
              const last = i === steps.length - 1;
              return (
                <li key={label} className="relative flex flex-col items-center gap-1.5">
                  <span
                    data-lab-node
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center backdrop-blur-sm ${
                      last ? "bg-[#3d3a1c] border-gold/60 text-gold" : "bg-[#143457] border-sky/40 text-sky"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span data-lab-label className="text-[10px] sm:text-[11px] font-medium text-gray-200">
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Notification finale */}
        <div data-lab-toast className="absolute -top-4 right-3 sm:-right-4 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-navy shadow-xl">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
            <Rocket size={14} />
          </span>
          {t("toast")}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ statValues }: { statValues?: string[] }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);

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

  useMotion(root, (q) => {
    const section = root.current;
    const one = (selector: string) => q(selector)[0];

    /* ---- Entrée : étiquette, titre lettre par lettre, texte, boutons, chiffres, démo ---- */
    const title = one("[data-hero-title]");
    const split = SplitText.create(title, { type: "words,chars" });
    const phraseEls = q("[data-phrase]");
    gsap.set(phraseEls.slice(1), { autoAlpha: 1, yPercent: 110 });

    const intro = gsap.timeline({ defaults: { ease: EASE } });
    intro
      .set(title, { opacity: 1 })
      .set(one("[data-hero='highlight']"), { opacity: 1 })
      .fromTo(one("[data-hero='badge']"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
      .fromTo(
        split.chars,
        { yPercent: 110, rotation: 10, opacity: 0 },
        { yPercent: 0, rotation: 0, opacity: 1, duration: 0.8, stagger: 0.022, ease: "back.out(1.7)" },
        0.05
      )
      .fromTo(phraseEls[0], { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out" }, 0.55)
      .fromTo(one("[data-hero='lead']"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.75)
      .fromTo(one("[data-hero='cta']"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.88)
      .fromTo(one("[data-hero='stats']"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1)
      .fromTo(one("[data-lab]"), { opacity: 0, y: 60, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: 1 }, 0.35)
      .fromTo(one("[data-hero='more']"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.4);
    q("[data-count]").forEach((el, i) => {
      const tween = countUp(el, { duration: 1.8 });
      if (tween) intro.add(tween, 1 + i * 0.1);
    });

    /* ---- Titre : la seconde ligne change toutes les 3 secondes ---- */
    if (phraseEls.length > 1) {
      const rotate = gsap.timeline({ repeat: -1, delay: 2 });
      phraseEls.forEach((el, i) => {
        const next = phraseEls[(i + 1) % phraseEls.length];
        rotate
          .to(el, { yPercent: -110, duration: 0.5, ease: "power3.in" }, "+=2.6")
          .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power4.out", immediateRender: false }, ">-0.05");
      });
      playInView(rotate, section);
    }

    /* ---- Démo : la console tape une commande par étape, la page se construit en même temps ---- */
    const lines = q("[data-lab-line]");
    const nodes = q("[data-lab-node]");
    const labels = q("[data-lab-label]");
    const checks = q("[data-check]");
    const idle = { backgroundColor: "#0d2440", borderColor: "rgba(255,255,255,0.16)", color: "#64748b", scale: 1 };
    const active = { backgroundColor: "#1c5d99", borderColor: "#2FA8FF", color: "#ffffff", scale: 1.14 };
    const done = { backgroundColor: "#143457", borderColor: "rgba(47,168,255,0.4)", color: "#2FA8FF", scale: 1 };
    const now = { immediateRender: true };

    const lab = gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 1.3 });
    lab
      .set(lines, { autoAlpha: 0, ...now }, 0)
      .set(q("[data-lab-line] [data-c], [data-lab-url] [data-c]"), { opacity: 0, ...now }, 0)
      .set(q("[data-lab-out]"), { opacity: 0, y: 6, ...now }, 0)
      .set(q("[data-wire]"), { opacity: 0, scale: 0.92, ...now }, 0)
      .set(q("[data-fill]"), { clipPath: "inset(0% 100% 0% 0%)", ...now }, 0)
      .set(q("[data-bar]"), { scaleY: 0, ...now }, 0)
      .set(checks, { opacity: 0, scale: 0, ...now }, 0)
      .set(nodes, { ...idle, ...now }, 0)
      .set(labels, { color: "#64748b", ...now }, 0)
      .set(one("[data-lab-rail]"), { scaleX: 0, ...now }, 0)
      .set(one("[data-lab-draft]"), { autoAlpha: 1, ...now }, 0)
      .set(one("[data-lab-live]"), { autoAlpha: 0, ...now }, 0)
      .set(one("[data-lab-lock]"), { autoAlpha: 0, ...now }, 0)
      .set(one("[data-lab-sweep]"), { opacity: 0, xPercent: -100, skewX: -18, ...now }, 0)
      .set(one("[data-lab-toast]"), { autoAlpha: 0, scale: 0.6, y: 14, ...now }, 0);

    const step = (i: number, build: () => void) => {
      const at = `step${i}`;
      lab.addLabel(at, i === 0 ? 0.3 : "+=1");
      if (i > 0) {
        lab.to(lines[i - 1], { autoAlpha: 0, duration: 0.2 }, at).to(nodes[i - 1], { ...done, duration: 0.3 }, at);
      }
      lab
        .to(nodes[i], { ...active, duration: 0.35, ease: "back.out(2.5)" }, at)
        .to(labels[i], { color: "#ffffff", duration: 0.3 }, at)
        .to(one("[data-lab-rail]"), { scaleX: i / (nodes.length - 1), duration: 0.6, ease: "power2.inOut" }, at)
        .set(lines[i], { autoAlpha: 1 }, `${at}+=0.2`)
        .to(lines[i].querySelectorAll("[data-c]"), { opacity: 1, duration: 0.01, stagger: 0.034, ease: "none" }, `${at}+=0.25`);
      build();
      lab.to(lines[i].querySelector("[data-lab-out]"), { opacity: 1, y: 0, duration: 0.3 }, ">+0.1");
    };

    // 1. Devis : l'adresse du futur site s'écrit.
    step(0, () => lab.to(q("[data-lab-url] [data-c]"), { opacity: 1, duration: 0.01, stagger: 0.04, ease: "none" }, ">+0.1"));
    // 2. Design : la maquette se dessine en pointillés.
    step(1, () => lab.to(q("[data-wire]"), { opacity: 1, scale: 1, duration: 0.45, stagger: 0.05, ease: "back.out(1.6)" }, ">+0.1"));
    // 3. Code : chaque bloc se remplit, le graphique monte.
    step(2, () =>
      lab
        .to(q("[data-fill]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, stagger: 0.06, ease: "power2.inOut" }, ">+0.1")
        .to(q("[data-wire]"), { opacity: 0, duration: 0.3 }, "<+0.5")
        .to(q("[data-bar]"), { scaleY: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.8)" }, "<")
    );
    // 4. Tests : les pastilles vertes valident chaque zone.
    step(3, () => lab.to(checks, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.22, ease: "back.out(3)" }, ">+0.1"));
    // 5. Livraison : le site passe en ligne.
    step(4, () =>
      lab
        .to(checks, { opacity: 0, scale: 0, duration: 0.25, stagger: 0.05 }, ">+0.1")
        .to(one("[data-lab-draft]"), { autoAlpha: 0, duration: 0.2 }, "<")
        .to(one("[data-lab-live]"), { autoAlpha: 1, duration: 0.3 }, ">")
        .to(one("[data-lab-lock]"), { autoAlpha: 1, duration: 0.3 }, "<")
        .to(one("[data-lab-sweep]"), { opacity: 1, duration: 0.15 }, "<")
        .to(one("[data-lab-sweep]"), { xPercent: 320, duration: 0.9, ease: "power2.inOut" }, "<")
        .to(one("[data-lab-sweep]"), { opacity: 0, duration: 0.2 }, ">-0.2")
        .to(nodes[4], { backgroundColor: "#3d3a1c", borderColor: "#FFC107", color: "#FFC107", duration: 0.3 }, "<")
        .to(one("[data-lab-toast]"), { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2.2)" }, "<")
    );
    // Remise à zéro en douceur avant de reboucler.
    lab
      .addLabel("reset", "+=3.5")
      .to(one("[data-lab-toast]"), { autoAlpha: 0, scale: 0.8, duration: 0.3 }, "reset")
      .to(lines[4], { autoAlpha: 0, duration: 0.3 }, "reset")
      .to(q("[data-fill]"), { clipPath: "inset(0% 0% 0% 100%)", duration: 0.5, stagger: 0.03, ease: "power2.in" }, "reset")
      .to(q("[data-lab-url] [data-c]"), { opacity: 0, duration: 0.2 }, "reset")
      .to([one("[data-lab-live]"), one("[data-lab-lock]")], { autoAlpha: 0, duration: 0.2 }, "reset")
      .to(one("[data-lab-draft]"), { autoAlpha: 1, duration: 0.2 }, "reset+=0.2")
      .to(nodes, { ...idle, duration: 0.4 }, "reset")
      .to(labels, { color: "#64748b", duration: 0.4 }, "reset")
      .to(one("[data-lab-rail]"), { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "reset");
    playInView(lab, one("[data-lab]"));

    /* ---- Sortie : légère parallaxe quand on quitte le hero ---- */
    gsap.to(one("[data-lab]"), { yPercent: -8, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.5 } });
    gsap.to(one("[data-hero-copy]"), {
      yPercent: 6,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: { trigger: section, start: "55% top", end: "bottom top", scrub: true },
    });
    gsap.to(one("[data-hero-chevron]"), { y: 8, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true });
  });

  // Avec une souris : la démo s'incline vers le pointeur et un halo le suit.
  useMotion(
    root,
    (q) => {
      const section = root.current;
      const tilt = q("[data-lab-tilt]")[0];
      const glow = q("[data-hero-glow]")[0];
      if (!section || !tilt || !glow) return;
      gsap.set(tilt, { transformPerspective: 1100 });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: EASE });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: EASE });
      const gx = gsap.quickTo(glow, "x", { duration: 0.9, ease: EASE });
      const gy = gsap.quickTo(glow, "y", { duration: 0.9, ease: EASE });
      const move = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 9);
        rx(py * -7);
        gx(e.clientX - r.left);
        gy(e.clientY - r.top);
        gsap.to(glow, { opacity: 1, duration: 0.4, overwrite: "auto" });
      };
      const leave = () => {
        rx(0);
        ry(0);
        gsap.to(glow, { opacity: 0, duration: 0.6, overwrite: "auto" });
      };
      section.addEventListener("pointermove", move);
      section.addEventListener("pointerleave", leave);
      return () => {
        section.removeEventListener("pointermove", move);
        section.removeEventListener("pointerleave", leave);
      };
    },
    [],
    POINTER
  );

  return (
    <section ref={root} className="relative min-h-[calc(100svh-4rem)] bg-gradient-hero flex items-center overflow-hidden">
      <Aurora />
      <div className="grid-floor opacity-60" />
      <div
        data-hero-glow
        aria-hidden="true"
        className="absolute top-0 left-0 w-[520px] h-[520px] -ml-[260px] -mt-[260px] rounded-full opacity-0 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(47,168,255,0.16), transparent 65%)" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-navy/70" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl py-14 lg:py-16 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
        <div data-hero-copy className="text-center lg:text-left">
          <div data-hero="badge" className="inline-flex items-center gap-2 glass-pill rounded-full px-5 py-2 mb-7">
            <Sparkles size={15} className="text-sky" />
            <span className="text-sky text-sm font-medium">{t("badge")}</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
            <span data-hero data-hero-title className="block text-balance">
              {t("title")}
            </span>
            {/* Seconde ligne tournante : toutes les phrases occupent la même cellule, la hauteur ne saute pas. */}
            <span data-hero="highlight" className="grid justify-items-center lg:justify-items-start overflow-hidden pb-[0.14em]">
              {phrases.map((phrase, i) => (
                <span
                  key={phrase}
                  data-phrase
                  aria-hidden={i > 0}
                  className={`[grid-area:1/1] text-transparent bg-clip-text bg-linear-to-r from-sky via-sky-light to-gold ${i > 0 ? "invisible" : ""}`}
                >
                  {phrase}
                </span>
              ))}
            </span>
          </h1>

          <p data-hero="lead" className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
            {t("subtitle")}
          </p>

          <div data-hero="cta" className="flex flex-wrap justify-center lg:justify-start gap-4 mb-9">
            <Magnetic>
              <Link
                href="/devis"
                className="group flex items-center gap-2.5 px-8 py-4 bg-gold text-navy font-bold text-base rounded-2xl hover:bg-gold-dark transition-colors duration-200 shadow-[0_10px_30px_-6px_rgba(255,193,7,0.55)]"
              >
                {t("cta1")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>
            <Link href="/services" className="glass glass-hover flex items-center gap-2.5 px-7 py-4 text-white font-semibold text-base rounded-2xl">
              {t("cta2")}
            </Link>
          </div>

          <dl data-hero="stats" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 max-w-xl mx-auto lg:mx-0">
            {stats.map((stat) => (
              <div key={stat.label} className="sm:border-l sm:border-white/15 sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd data-count={stat.value} className="font-heading text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                  {stat.value}
                </dd>
                <dd aria-hidden="true" className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroLab />
      </div>

      <button
        type="button"
        data-hero="more"
        onClick={() => scrollToY(Math.round(window.innerHeight * 0.9))}
        aria-label={locale === "en" ? "Scroll down" : "Défiler vers le bas"}
        className="hidden lg:block absolute bottom-5 left-1/2 -ml-[15px] z-10 text-white/50 hover:text-white transition-colors"
      >
        <ChevronDown data-hero-chevron size={30} />
      </button>
    </section>
  );
}
