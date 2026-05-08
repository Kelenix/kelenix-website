import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import QuoteForm from "./QuoteForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Demande de Devis | Kelenix" : "Get a Quote | Kelenix",
    description: locale === "fr"
      ? "Demandez un devis personnalisé gratuit pour votre projet digital."
      : "Request a free personalized quote for your digital project.",
  };
}

export default async function DevisPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });

  const steps = [
    t("steps.service"),
    t("steps.project"),
    t("steps.budget"),
    t("steps.contact"),
    t("steps.confirm"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <span className="inline-block bg-gold/10 text-gold text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>

          {/* Step indicators */}
          <div className="flex items-center justify-center mt-10 gap-2 flex-wrap">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky/20 border border-sky/50 flex items-center justify-center text-sky text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-white text-xs font-medium">{step}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-4 h-px bg-white/20 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-3xl">
          <div className="bg-white rounded-3xl shadow-card p-8">
            <QuoteForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
