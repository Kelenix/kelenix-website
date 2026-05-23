"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Star, Quote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function TestimonialsSection({ testimonials, locale }: { testimonials: Testimonial[]; locale: string }) {
  const t = useTranslations("testimonials");
  const trackRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = window.innerWidth;
    const step = () => {
      x -= 0.5;
      const half = track.scrollWidth / 2;
      if (x <= -half) x += half;
      track.style.transform = `translateX(${x}px)`;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  if (!testimonials.length) return null;

  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,168,255,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10">
        <div className="text-center mb-16 container mx-auto px-4 xl:px-8 max-w-7xl">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Scrolling track */}
        <div style={{ overflowX: "hidden", paddingBottom: 8 }}>
          <div
            ref={trackRef}
            style={{
              display: "flex",
              alignItems: "stretch",
              width: "max-content",
              willChange: "transform",
              transform: "translateX(100vw)",
            }}
          >
            {doubled.map((testimonial, i) => (
              <TestimonialCard key={i} testimonial={testimonial} locale={locale} />
            ))}
          </div>
        </div>

        <div className="text-center mt-10 container mx-auto px-4">
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
