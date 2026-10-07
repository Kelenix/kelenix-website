"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Star, Quote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useReveal, useMotion } from "@/lib/gsap";

type Testimonial = {
  id: string;
  name: string;
  company: string;
  position: string;
  photo: string | null;
  textFr: string;
  textEn: string;
  rating: number;
};

function TestimonialCard({ testimonial, locale }: { testimonial: Testimonial; locale: string }) {
  const text = locale === "fr" ? testimonial.textFr : testimonial.textEn;
  return (
    <div style={{
      flexShrink: 0,
      width: 360,
      margin: "0 16px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "28px 28px 24px",
      position: "relative",
    }}>
      <Quote size={32} style={{ color: "rgba(47,168,255,0.25)", position: "absolute", top: 20, left: 20 }} />
      <div style={{ display: "flex", gap: 3, marginBottom: 16, position: "relative", zIndex: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={cn(i < testimonial.rating ? "text-gold fill-gold" : "text-gray-600")} />
        ))}
      </div>
      <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20, position: "relative", zIndex: 1 }}>
        &ldquo;{text}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: testimonial.photo ? "transparent" : "rgba(47,168,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 16, color: "#2FA8FF", flexShrink: 0,
          overflow: "hidden",
        }}>
          {testimonial.photo
            ? <img src={testimonial.photo} alt={testimonial.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : testimonial.name[0]
          }
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{testimonial.name}</div>
          <div style={{ color: "#2FA8FF", fontSize: 12 }}>{testimonial.position}</div>
          <div style={{ color: "#94a3b8", fontSize: 11 }}>{testimonial.company}</div>
        </div>
      </div>
    </div>
  );
}

// Une rangée défilante : la liste est répétée pour remplir l'écran, puis doublée pour boucler sans couture.
function Row({ items, dir, locale }: { items: Testimonial[]; dir: 1 | -1; locale: string }) {
  const base: Testimonial[] = [];
  while (base.length < 8) base.push(...items);
  return (
    <div data-marquee data-dir={dir} style={{ display: "flex", alignItems: "stretch", width: "max-content", willChange: "transform" }}>
      {[...base, ...base].map((testimonial, i) => (
        <div key={i} aria-hidden={i >= items.length} style={{ display: "flex" }}>
          <TestimonialCard testimonial={testimonial} locale={locale} />
        </div>
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials, locale }: { testimonials: Testimonial[]; locale: string }) {
  const t = useTranslations("testimonials");
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Deux rangées qui défilent en sens opposés. Le défilement de la page les accélère
  // (et les inverse quand on remonte) ; le survol les met en pause.
  useMotion(root, (q) => {
    const rows = q("[data-rows]")[0];
    const tracks = q("[data-marquee]");
    if (!rows || !tracks.length) return;
    gsap.set(rows, { overflowX: "hidden" });

    const loops = tracks.map((track) => {
      const dir = Number(track.dataset.dir);
      const loop = gsap.fromTo(
        track,
        { xPercent: dir < 0 ? 0 : -50 },
        { xPercent: dir < 0 ? -50 : 0, duration: track.scrollWidth / 2 / 55, ease: "none", repeat: -1 }
      );
      // Avance dans le temps pour pouvoir aussi tourner à l'envers sans buter sur le début.
      return loop.totalTime(loop.duration() * 500);
    });

    let direction = 1;
    let hovered = false;
    const cruise = () => gsap.to(loops, { timeScale: hovered ? 0 : direction, duration: 0.8, ease: "power2.out", overwrite: true });
    const settle = gsap.delayedCall(0.2, cruise).pause();

    ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => loops.forEach((loop) => loop.paused(!self.isActive)),
      onUpdate: (self) => {
        if (hovered) return;
        const velocity = self.getVelocity();
        direction = velocity < 0 ? -1 : 1;
        gsap.to(loops, { timeScale: direction * (1 + Math.min(Math.abs(velocity) / 350, 6)), duration: 0.2, overwrite: true });
        settle.restart(true);
      },
    });

    const enter = () => {
      hovered = true;
      cruise();
    };
    const leave = () => {
      hovered = false;
      cruise();
    };
    rows.addEventListener("pointerenter", enter);
    rows.addEventListener("pointerleave", leave);
    return () => {
      rows.removeEventListener("pointerenter", enter);
      rows.removeEventListener("pointerleave", leave);
    };
  });

  if (!testimonials.length) return null;

  // Assez d'avis : deux rangées distinctes. Sinon une seule.
  const rows =
    testimonials.length >= 4
      ? [testimonials.filter((_, i) => i % 2 === 0), testimonials.filter((_, i) => i % 2 === 1)]
      : [testimonials];

  return (
    <section ref={root} className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,168,255,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10">
        <div className="text-center mb-16 container mx-auto px-4 xl:px-8 max-w-7xl">
          <span data-reveal className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 data-split className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p data-reveal className="text-gray-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Sans animation, les rangées restent défilables à la main. */}
        <div data-rows data-reveal className="flex flex-col gap-8 overflow-x-auto pb-2">
          {rows.map((items, i) => (
            <Row key={i} items={items} dir={i % 2 ? 1 : -1} locale={locale} />
          ))}
        </div>

        <div data-reveal className="text-center mt-10 container mx-auto px-4">
          <Link
            href="/temoignages"
            className="inline-flex items-center gap-2 text-sky hover:text-sky-light font-semibold transition-colors"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
