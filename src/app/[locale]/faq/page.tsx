export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FaqAccordion from "./FaqAccordion";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "FAQ",
    description: locale === "fr"
      ? "Trouvez les réponses à vos questions sur les services Kelenix."
      : "Find answers to your questions about Kelenix services.",
  };
}

// Ordre d'affichage des catégories sur la page.
const CATEGORY_ORDER = ["services", "pricing", "process", "delays", "support"];

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const isEn = locale === "en";

  let faqs: {
    category: string;
    questionFr: string;
    questionEn: string;
    answerFr: string;
    answerEn: string;
  }[] = [];
  try {
    faqs = await prisma.faq.findMany({
      where: { published: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
      select: { category: true, questionFr: true, questionEn: true, answerFr: true, answerEn: true },
    });
  } catch {
    faqs = [];
  }

  const knownKeys = new Set(CATEGORY_ORDER);
  const categoryKeys = [
    ...CATEGORY_ORDER,
    ...Array.from(new Set(faqs.map(f => f.category))).filter(k => !knownKeys.has(k)),
  ];

  const faqByCategory = categoryKeys
    .map(key => ({
      key,
      label: knownKeys.has(key) ? t(`categories.${key}`) : key,
      items: faqs
        .filter(f => f.category === key)
        .map(f => ({
          q: isEn ? f.questionEn : f.questionFr,
          a: isEn ? f.answerEn : f.answerFr,
        })),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20">
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

      {/* FAQ Content */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          {faqByCategory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>{isEn ? "No questions available yet." : "Aucune question disponible pour le moment."}</p>
            </div>
          ) : (
            <FaqAccordion categories={faqByCategory} locale={locale} />
          )}

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-navy rounded-3xl p-10">
            <MessageCircle size={40} className="text-sky mx-auto mb-4" />
            <p className="text-white font-medium text-lg mb-2">{t("contactUs")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky text-white rounded-xl font-semibold text-sm hover:bg-sky-dark transition-colors mt-4"
            >
              {t("contactLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
