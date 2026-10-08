// Rendue à chaque requête : la page lit la base sans repli, elle ne doit pas être générée au build.
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/site/PageHero";
import { card, container, iconTile, section } from "@/components/site/styles";
import ContactForm from "./ContactForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Contact",
    description: locale === "fr"
      ? "Contactez Kelenix pour discuter de votre projet de transformation numérique."
      : "Contact Kelenix to discuss your digital transformation project.",
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const settingsRows = await prisma.siteSettings.findMany({
    where: { key: { in: ["company_email", "company_phone", "company_whatsapp", "company_address", "company_hours"] } },
  });
  const s = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));

  const email = s.company_email || t("info.email");
  const phone = s.company_phone || t("info.phone");
  const whatsapp = s.company_whatsapp || "33612345678";
  const address = s.company_address || t("info.address");
  const hours = s.company_hours || t("info.hours");

  const infos = [
    { icon: Mail, label: email, href: `mailto:${email}` },
    { icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    {
      icon: MessageCircle,
      label: "WhatsApp Business",
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(locale === "fr" ? "Bonjour, je souhaite discuter d'un projet." : "Hello, I would like to discuss a project.")}`,
    },
    { icon: MapPin, label: address, href: undefined },
    { icon: Clock, label: hours, href: undefined },
  ];

  return (
    <>
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      <section className={`bg-mist ${section}`}>
        <div className={`${container} grid gap-6 lg:grid-cols-[1fr_1.7fr] lg:gap-8`}>
          {/* Coordonnées */}
          <div className="flex flex-col gap-5">
            <ul className={`divide-y divide-line px-5 sm:px-6 ${card}`}>
              {infos.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 py-4 text-[15px] font-medium text-navy transition-colors hover:text-azure"
                    >
                      <span className={iconTile}>
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0 break-words">{label}</span>
                    </a>
                  ) : (
                    <p className="flex items-center gap-4 py-4 text-[15px] font-medium text-navy">
                      <span className={iconTile}>
                        <Icon size={20} />
                      </span>
                      {label}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {/* Carte (masquée sur téléphone : les coordonnées suffisent) */}
            <div className={`hidden h-56 overflow-hidden sm:block ${card}`}>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.2,48.8,2.4,48.9&layer=mapnik"
                className="h-full w-full border-0"
                loading="lazy"
                title="Kelenix location"
              />
            </div>
          </div>

          {/* Formulaire */}
          <div className={`p-5 sm:p-8 lg:p-10 ${card}`}>
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
