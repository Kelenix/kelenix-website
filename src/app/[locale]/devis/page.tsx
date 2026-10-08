import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Clock, Lock, ShieldCheck } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { card, section } from "@/components/site/styles";
import QuoteForm from "./QuoteForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Demande de Devis" : "Get a Quote",
    description: locale === "fr"
      ? "Demandez un devis personnalisé gratuit pour votre projet digital."
      : "Request a free personalized quote for your digital project.",
  };
}

export default async function DevisPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });
  const fr = locale === "fr";

  const reassurance = [
    { icon: ShieldCheck, label: fr ? "Gratuit et sans engagement" : "Free, with no commitment" },
    { icon: Clock, label: fr ? "Devis détaillé sous 48 h" : "Detailed quote within 48 hours" },
    { icon: Lock, label: fr ? "Vos données restent confidentielles" : "Your data stays private" },
  ];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      <section className={`bg-mist ${section}`}>
        <div className="container mx-auto max-w-3xl px-4 sm:px-5">
          <div className={`p-5 sm:p-8 lg:p-10 ${card}`}>
            <QuoteForm locale={locale} />
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {reassurance.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-navy sm:justify-center">
                <Icon size={18} className="shrink-0 text-azure" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
