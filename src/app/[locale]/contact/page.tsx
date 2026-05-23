import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Contact | Kelenix" : "Contact | Kelenix",
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
      {/* Hero */}
      <section className="bg-linear-to-br from-navy to-navy-light py-20">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-5">
              {infos.map(({ icon: Icon, label, href }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-sky" />
                  </div>
                  <div>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-navy font-medium hover:text-sky transition-colors text-sm">
                        {label}
                      </a>
                    ) : (
                      <p className="text-navy font-medium text-sm">{label}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-card h-48 relative">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=2.2,48.8,2.4,48.9&layer=mapnik"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Kelenix location"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-card p-8">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
