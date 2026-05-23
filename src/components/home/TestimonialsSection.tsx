"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";
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

export default function TestimonialsSection({ testimonials, locale }: { testimonials: Testimonial[]; locale: string }) {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c < testimonials.length - 1 ? c + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : testimonials.length - 1));
  const next = () => setCurrent((c) => (c < testimonials.length - 1 ? c + 1 : 0));

  const testimonial = testimonials[current];

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,168,255,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t("title")} <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Main testimonial */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 sm:p-12 relative">
            <Quote size={48} className="text-sky/20 absolute top-8 left-8" />
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={cn(
                      i < testimonial.rating ? "text-gold fill-gold" : "text-gray-600"
                    )}
                  />
                ))}
              </div>

              {/* Text */}
              <blockquote className="text-gray-200 text-lg leading-relaxed mb-8 italic">
                &ldquo;{locale === "fr" ? testimonial.textFr : testimonial.textEn}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.photo ? (
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    width={52}
                    height={52}
                    className="rounded-full object-cover border-2 border-sky/30"
                  />
                ) : (
                  <div className="w-13 h-13 rounded-full bg-sky/20 flex items-center justify-center text-sky font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-heading font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-sky">{testimonial.position}</div>
                  <div className="text-xs text-gray-400">{testimonial.company}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-sky hover:border-sky transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === current ? "w-6 bg-sky" : "w-2 bg-white/20"
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-sky hover:border-sky transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
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
