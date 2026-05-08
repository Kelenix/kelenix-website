export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Star, Quote, Users, ThumbsUp, Award, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

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
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-gold fill-gold" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default async function TestimonialsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("testimonials");
  const isEn = locale === "en";

  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    testimonials.length > 0
      ? Math.round((testimonials.reduce((a: number, b: { rating: number }) => a + b.rating, 0) / testimonials.length) * 10) / 10
      : 5;

  const stats = [
    { icon: Users, value: `${testimonials.length}+`, label: isEn ? "Client testimonials" : "Témoignages clients" },
    { icon: Star, value: `${avgRating}/5`, label: isEn ? "Average rating" : "Note moyenne" },
    { icon: ThumbsUp, value: "98%", label: isEn ? "Satisfaction rate" : "Taux de satisfaction" },
    { icon: Award, value: "150+", label: isEn ? "Projects completed" : "Projets réalisés" },
  ];

  return (
    <main>
      <section className="bg-gradient-to-br from-navy via-navy to-sky/20 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,168,255,0.12)_0%,transparent_60%)]" />
        <div className="relative z-10 container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 bg-sky/10 border border-sky/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-sky animate-pulse" />
            <span className="text-sky text-sm font-medium">{t("badge")}</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white mb-6">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-gold">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-neutral-light rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={22} className="text-sky" />
                </div>
                <div className="text-3xl font-extrabold text-navy mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          {testimonials.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>{isEn ? "No testimonials yet." : "Aucun témoignage pour le moment."}</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map((t_: { id: string; name: string; company: string; position: string; photo: string | null; textFr: string; textEn: string; rating: number }) => (
                <div
                  key={t_.id}
                  className="break-inside-avoid bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-7 border border-gray-100"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Quote size={28} className="text-sky/30 shrink-0 mt-1" />
                    <p className="text-gray-600 leading-relaxed italic text-sm">
                      {isEn ? t_.textEn : t_.textFr}
                    </p>
                  </div>
                  <Stars rating={t_.rating} />
                  <div className="mt-5 flex items-center gap-3 pt-4 border-t border-gray-100">
                    {t_.photo ? (
                      <img
                        src={t_.photo}
                        alt={t_.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-sky/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy to-sky flex items-center justify-center text-white font-extrabold text-lg shrink-0">
                        {t_.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-bold text-navy text-sm">{t_.name}</p>
                      <p className="text-xs text-gray-400">
                        {t_.position}
                        {t_.company ? ` — ${t_.company}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">
            {isEn ? "Ready to join our satisfied clients?" : "Prêt à rejoindre nos clients satisfaits ?"}
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {isEn
              ? "Contact us today to discuss your project."
              : "Contactez-nous dès aujourd'hui pour discuter de votre projet."}
          </p>
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            {isEn ? "Get a free quote" : "Obtenir un devis gratuit"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
