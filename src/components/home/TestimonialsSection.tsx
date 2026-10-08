import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Marquee from "@/components/home/Marquee";
import SectionHeading, { MoreLink } from "@/components/home/SectionHeading";

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

function Card({ testimonial, locale, className = "" }: { testimonial: Testimonial; locale: string; className?: string }) {
  return (
    <figure className={`flex shrink-0 flex-col justify-between gap-6 rounded-3xl border border-line bg-white p-6 sm:p-7 ${className}`}>
      <div>
        <div role="img" aria-label={`${testimonial.rating}/5`} className="mb-4 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} className={i < testimonial.rating ? "fill-gold text-gold" : "fill-line text-line"} />
          ))}
        </div>
        <blockquote className="text-pretty text-[15px] leading-relaxed text-navy sm:text-base">{locale === "fr" ? testimonial.textFr : testimonial.textEn}</blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky/15 text-base font-semibold text-azure">
          {testimonial.photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- photo saisie dans l'admin : domaine libre, hors remotePatterns
            <img src={testimonial.photo} alt="" width={44} height={44} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          ) : (
            testimonial.name[0]
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-navy">{testimonial.name}</span>
          <span className="block truncate text-[13px] text-muted">
            {testimonial.position}, {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

// Témoignages : rangée défilante sur ordinateur, carrousel à faire glisser sur téléphone.
export default async function TestimonialsSection({ testimonials, locale, rating }: { testimonials: Testimonial[]; locale: string; rating: string }) {
  const t = await getTranslations("home.voices");
  if (!testimonials.length) return null;

  // La liste est répétée pour remplir l'écran, puis doublée pour boucler sans couture.
  const base: Testimonial[] = [];
  while (base.length < 6) base.push(...testimonials);

  return (
    <Reveal className="overflow-hidden bg-mist py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-5 xl:px-8">
        <SectionHeading
          title={t("title")}
          action={
            <p className="flex items-center gap-2.5 text-[15px] text-muted">
              <Star size={18} className="fill-gold text-gold" />
              <span className="font-display text-3xl font-medium tabular-nums text-navy">{rating}</span>
              {t("ratingLabel")}
            </p>
          }
        />
      </div>

      {/* Téléphone et tablette : on fait glisser les avis */}
      <ul data-reveal className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:hidden">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="flex w-[84vw] max-w-sm shrink-0 snap-center">
            <Card testimonial={testimonial} locale={locale} className="w-full" />
          </li>
        ))}
      </ul>

      {/* Ordinateur : rangée défilante */}
      <Marquee className="hidden overflow-x-auto lg:block">
        <div data-reveal>
          <div data-marquee className="flex w-max">
            {[...base, ...base].map((testimonial, i) => (
              <div key={i} aria-hidden={i >= testimonials.length} className="flex px-2.5">
                <Card testimonial={testimonial} locale={locale} className="w-[24rem]" />
              </div>
            ))}
          </div>
        </div>
      </Marquee>

      <div data-reveal className="container mx-auto mt-8 max-w-7xl px-5 lg:mt-12 xl:px-8">
        <div className="hidden lg:block">
          <MoreLink href="/temoignages">{t("viewAll")}</MoreLink>
        </div>
        <div className="lg:hidden">
          <MoreLink href="/temoignages" variant="block">
            {t("viewAll")}
          </MoreLink>
        </div>
      </div>
    </Reveal>
  );
}
