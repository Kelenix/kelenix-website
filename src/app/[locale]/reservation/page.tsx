import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CalendarCheck, ShieldCheck, Clock } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { card, container, section } from "@/components/site/styles";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Booking" : "Réservation",
    description: isEn
      ? "Book your appointment with Kelenix Tech online. Secure payment and instant confirmation."
      : "Réservez votre rendez-vous avec Kelenix Tech en ligne. Paiement sécurisé et confirmation immédiate.",
  };
}

export default async function ReservationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });

  const perks = [
    { icon: CalendarCheck, label: t("instant") },
    { icon: ShieldCheck, label: t("secure") },
    { icon: Clock, label: t("quick") },
  ];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")}>
        {perks.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy"
          >
            <Icon size={16} className="text-azure" />
            {label}
          </span>
        ))}
      </PageHero>

      {/* Widget de réservation Ponctio */}
      <section className={`bg-mist ${section}`}>
        <div className={container}>
          <div className={`mx-auto max-w-4xl overflow-hidden p-3 sm:p-5 ${card}`}>
            <iframe
              src="https://ponctio.com/w/kelenix-tech2-a4qjh"
              title="Kelenix Tech"
              className="w-full rounded-2xl border-0"
              style={{ minHeight: 760 }}
              loading="lazy"
              allow="payment"
            />
          </div>
        </div>
      </section>
    </>
  );
}
