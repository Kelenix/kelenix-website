export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { card, container, section } from "@/components/site/styles";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Testimonials" : "Témoignages",
    description: isEn
      ? "Discover what our clients say about Kelenix. Read authentic testimonials from companies that have trusted us for their digital transformation."
      : "Découvrez ce que nos clients disent de Kelenix. Lisez les témoignages authentiques d'entreprises qui nous ont fait confiance pour leur transformation numérique.",
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`${rating}/5`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={16} className={i < rating ? "fill-gold text-gold" : "fill-line text-line"} />
      ))}
    </div>
  );
}

export default async function TestimonialsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("testimonials");
  const isEn = locale === "en";

  const [testimonials, siteStats] = await Promise.all([
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
    getSiteStats(),
  ]);

  const avgRating =
    testimonials.length > 0
      ? Math.round((testimonials.reduce((a: number, b: { rating: number }) => a + b.rating, 0) / testimonials.length) * 10) / 10
      : 5;

  const stats = [
    { value: `${testimonials.length}+`, label: isEn ? "Client testimonials" : "Témoignages clients" },
    { value: `${avgRating}/5`, label: isEn ? "Average rating" : "Note moyenne" },
    { value: siteStats.satisfaction, label: isEn ? "Satisfaction rate" : "Taux de satisfaction" },
    { value: siteStats.projects, label: isEn ? "Projects completed" : "Projets réalisés" },
  ];
  // Bordures de chaque case : grille 2 × 2 sur téléphone, 4 colonnes sur ordinateur.
  const cells = ["border-b border-r lg:border-b-0", "border-b lg:border-b-0 lg:border-r", "border-r", ""];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      <section className={`bg-white ${section}`}>
        <div className={container}>
          <dl className="mb-12 grid grid-cols-2 overflow-hidden rounded-3xl border border-line sm:mb-16 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col-reverse border-line p-5 sm:p-7 ${cells[i]}`}>
                <dt className="mt-1.5 text-sm text-muted">{stat.label}</dt>
                <dd className="font-display text-4xl font-medium leading-none tracking-[-0.03em] tabular-nums text-navy sm:text-5xl">{stat.value}</dd>
              </div>
            ))}
          </dl>

          {testimonials.length === 0 ? (
            <p className="py-16 text-center text-muted">{isEn ? "No testimonials yet." : "Aucun témoignage pour le moment."}</p>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {testimonials.map((item) => (
                <figure key={item.id} data-no-reveal className={`mb-5 break-inside-avoid bg-mist/60 p-6 sm:p-7 ${card}`}>
                  <Stars rating={item.rating} />
                  <blockquote className="mt-4 text-pretty text-[15px] leading-relaxed text-navy sm:text-base">{isEn ? item.textEn : item.textFr}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky/15 text-base font-semibold text-azure">
                      {item.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- photo saisie dans l'admin : domaine libre, hors remotePatterns
                        <img src={item.photo} alt="" width={44} height={44} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      ) : (
                        item.name.charAt(0)
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-navy">{item.name}</span>
                      <span className="block text-[13px] text-muted">
                        {item.position}
                        {item.company ? `, ${item.company}` : ""}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title={isEn ? "Ready to join our satisfied clients?" : "Prêt à rejoindre nos clients satisfaits ?"}
        text={isEn ? "Contact us today to discuss your project." : "Contactez-nous dès aujourd'hui pour discuter de votre projet."}
        primary={{ href: "/devis", label: isEn ? "Get a free quote" : "Obtenir un devis gratuit" }}
      />
    </>
  );
}
