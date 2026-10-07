"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, PenTool, Code2, ShieldCheck, Rocket, ArrowRight, Check } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import Aurora from "@/components/motion/Aurora";
import { gsap, useReveal, useMotion, playInView, EASE } from "@/lib/gsap";

const steps = [
  { key: "order", icon: ShoppingCart },
  { key: "design", icon: PenTool },
  { key: "build", icon: Code2 },
  { key: "test", icon: ShieldCheck },
  { key: "deliver", icon: Rocket },
] as const;

const chips = [
  { icon: Code2, position: "top-2 -right-3", color: "text-sky" },
  { icon: ShieldCheck, position: "top-1/2 -left-6", color: "text-emerald-400" },
  { icon: Rocket, position: "-bottom-2 right-6", color: "text-gold" },
];

/* ---------- Scène « build en direct » ----------
   Le JSX décrit l'état final (tout coché, 100 %, livré). Avec les animations,
   la checklist se remplit au rythme du défilement des étapes. */
function BuildScene() {
  const t = useTranslations("process");

  return (
    <div data-scene className="relative w-full max-w-[380px] aspect-square mx-auto" style={{ perspective: 1100 }}>
      {/* Halo */}
      <div
        data-scene-halo
        className="absolute inset-6 rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(circle, rgba(47,168,255,0.35), transparent 68%)" }}
      />

      {/* Anneaux orbitaux : le conteneur porte l'inclinaison, l'anneau tourne dans son plan. */}
      <div className="absolute left-1/2 top-1/2" style={{ width: "108%", height: "108%", transform: "translate(-50%,-50%) rotateX(66deg)" }}>
        <div data-scene-ring="1" className="w-full h-full rounded-full border border-sky/20 border-dashed" />
      </div>
      <div className="absolute left-1/2 top-1/2" style={{ width: "84%", height: "84%", transform: "translate(-50%,-50%) rotateX(70deg) rotateZ(30deg)" }}>
        <div data-scene-ring="-1" className="relative w-full h-full rounded-full border border-gold/15">
          <span className="absolute -top-1 left-1/2 -ml-1 w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_3px_rgba(255,193,7,0.6)]" />
        </div>
      </div>

      {/* Panneau applicatif flottant */}
      <div className="absolute left-1/2 top-1/2 w-[74%]" style={{ transform: "translate(-50%,-50%)" }}>
        <div data-scene-panel className="glass rounded-2xl p-4 shadow-2xl">
          {/* Barre de fenêtre */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-gold/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 text-[11px] font-semibold text-gray-300 tracking-wide">{t("appLabel")}</span>
          </div>

          {/* Checklist des étapes */}
          <div className="flex flex-col gap-2 mb-3">
            {steps.map(({ key }) => (
              <div key={key} data-scene-item className="flex items-center gap-2.5">
                <span data-scene-box className="flex items-center justify-center w-4 h-4 rounded-full border bg-sky border-sky">
                  <Check data-scene-check size={11} className="text-navy" strokeWidth={3.5} />
                </span>
                <span data-scene-label className="text-[12px] text-white">
                  {t(`steps.${key}.title`)}
                </span>
              </div>
            ))}
          </div>

          {/* Barre de progression */}
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
            <div data-scene-bar className="h-full rounded-full bg-linear-to-r from-sky to-gold" style={{ transformOrigin: "0 50%" }} />
          </div>

          {/* État */}
          <div className="flex items-center justify-between">
            <span className="grid text-[11px] font-semibold">
              <span data-scene-building className="[grid-area:1/1] invisible text-sky">
                {t("building")}
              </span>
              <span data-scene-delivered className="[grid-area:1/1] text-emerald-400">
                {t("delivered")}
              </span>
            </span>
            <span data-scene-percent className="text-[11px] font-bold text-gray-300 tabular-nums">
              100%
            </span>
          </div>
        </div>
      </div>

      {/* Puces techno flottantes */}
      {chips.map(({ icon: Icon, position, color }) => (
        <div key={position} data-scene-chip className={`glass-pill absolute ${position} w-11 h-11 rounded-xl flex items-center justify-center z-10`}>
          <Icon size={20} className={color} />
        </div>
      ))}
    </div>
  );
}

export default function ProcessSection() {
  const t = useTranslations("process");
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useMotion(root, (q) => {
    const one = (selector: string) => q(selector)[0];
    const track = one("[data-track]");
    const rail = one("[data-rail]");
    const percent = one("[data-scene-percent]");

    /* ---- Mouvements d'ambiance, uniquement quand la section est visible ---- */
    const ambient = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    ambient
      .to(one("[data-scene-halo]"), { opacity: 0.95, scale: 1.08, duration: 2.5, repeat: -1, yoyo: true }, 0)
      .fromTo(
        one("[data-scene-panel]"),
        { y: 0, rotationY: -7, rotationX: 3, transformPerspective: 1000 },
        { y: -14, rotationY: 7, rotationX: -3, duration: 4, repeat: -1, yoyo: true },
        0
      )
      .to(q("[data-scene-chip]"), { y: -12, duration: 2.4, repeat: -1, yoyo: true, stagger: 0.6 }, 0);
    q("[data-scene-ring]").forEach((ring) =>
      ambient.to(ring, { rotation: 360 * Number(ring.dataset.sceneRing), duration: 26, ease: "none", repeat: -1 }, 0)
    );
    playInView(ambient, root.current);

    /* ---- Le rail se remplit et la checklist se coche au rythme du défilement ---- */
    const progress = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: track, start: "top 65%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true },
      onUpdate: () => {
        percent.textContent = `${Math.round(progress.progress() * 100)}%`;
      },
    });
    progress
      .fromTo(one("[data-beam]"), { scaleY: 0 }, { scaleY: 1, duration: steps.length }, 0)
      .fromTo(one("[data-dot]"), { y: 0 }, { y: () => rail.offsetHeight, duration: steps.length }, 0)
      .fromTo(one("[data-scene-bar]"), { scaleX: 0 }, { scaleX: 1, duration: steps.length }, 0)
      .fromTo(one("[data-scene-building]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, steps.length - 0.3)
      .fromTo(one("[data-scene-delivered]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, steps.length - 0.15);
    q("[data-scene-item]").forEach((item, i) => {
      const at = i + 0.75;
      progress
        .fromTo(
          item.querySelector("[data-scene-box]"),
          { backgroundColor: "rgba(47,168,255,0)", borderColor: "rgba(255,255,255,0.25)", scale: 0.9 },
          { backgroundColor: "#2FA8FF", borderColor: "#2FA8FF", scale: 1, duration: 0.2 },
          at
        )
        .fromTo(item.querySelector("[data-scene-check]"), { scale: 0 }, { scale: 1, duration: 0.2 }, at)
        .fromTo(item.querySelector("[data-scene-label]"), { color: "#6b7280" }, { color: "#ffffff", duration: 0.2 }, at);
    });

    /* ---- Chaque étape : la pastille rebondit, la carte glisse, le texte suit ---- */
    q("[data-step]").forEach((step) => {
      gsap
        .timeline({ scrollTrigger: { trigger: step, start: "top 82%", toggleActions: "play none none reverse" } })
        .from(step.querySelector("[data-step-icon]"), { scale: 0, rotation: -40, duration: 0.5, ease: "back.out(3)" })
        .from(step.querySelector("[data-step-card]"), { opacity: 0, x: 70, duration: 0.6, ease: EASE }, 0.05)
        .from(step.querySelectorAll("[data-step-text]"), { opacity: 0, x: 16, duration: 0.35, ease: EASE, stagger: 0.07 }, 0.3);
    });

    return () => {
      percent.textContent = "100%";
    };
  });

  return (
    // overflow-clip (et non hidden) : la scène peut rester collée pendant que les étapes défilent.
    <section ref={root} className="relative py-28 bg-navy-dark overflow-clip">
      {/* Décor */}
      <Aurora className="opacity-70" />
      <div className="grid-floor opacity-50" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span data-reveal className="inline-flex items-center gap-2 glass-pill text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 data-split className="font-heading text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t("title")}{" "}
            <span data-nosplit className="text-transparent bg-clip-text bg-linear-to-r from-sky to-gold">
              {t("titleHighlight")}
            </span>
          </h2>
          <p data-reveal className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Scène */}
          <div data-reveal="scale" className="relative lg:sticky lg:top-28">
            <BuildScene />
          </div>

          <div>
          {/* Timeline des étapes */}
          <div data-track className="relative pl-14">
            {/* Rail */}
            <div data-rail className="absolute left-[26px] top-3 bottom-3 w-[3px] rounded-full bg-white/10 overflow-hidden">
              <div data-beam className="absolute inset-0 rounded-full bg-linear-to-b from-sky via-sky-light to-gold" style={{ transformOrigin: "50% 0" }} />
            </div>
            {/* Point lumineux voyageur */}
            <div data-dot className="absolute left-[19px] top-1 w-[18px] h-[18px] rounded-full bg-sky shadow-[0_0_20px_6px_rgba(47,168,255,0.7)] z-10" />

            <ol className="flex flex-col gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === steps.length - 1;
                return (
                  <li key={step.key} data-step className="relative">
                    {/* Pastille icône, ancrée sur le rail */}
                    <div
                      data-step-icon
                      className={`absolute -left-[52px] top-5 w-11 h-11 rounded-xl flex items-center justify-center border z-10 ${
                        isLast ? "bg-[#2e2b17] border-gold/50 text-gold" : "bg-[#0c2338] border-sky/40 text-sky"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    {/* Le wrapper est animé ; la carte garde ses transitions CSS de survol. */}
                    <div data-step-card>
                      <div className="glass glass-hover relative rounded-2xl p-5 pl-6">
                        <div data-step-text className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-sky/70">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="font-heading font-bold text-white text-lg">{t(`steps.${step.key}.title`)}</h3>
                        </div>
                        <p data-step-text className="text-gray-400 text-sm leading-relaxed">
                          {t(`steps.${step.key}.description`)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

            {/* CTA */}
            <div data-reveal className="mt-8 pl-14">
              <Magnetic>
                <Link
                  href="/devis"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-dark transition-colors duration-200 shadow-lg"
                >
                  {t("cta")}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
