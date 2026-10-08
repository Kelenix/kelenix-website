export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/site/PageHero";
import { btnDark, card, section } from "@/components/site/styles";
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
      <PageHero eyebrow={t("badge")} title={`${t("title")} ${t("titleHighlight")}`} lead={t("subtitle")} />

      <section className={`bg-mist ${section}`}>
        <div className="container mx-auto max-w-4xl px-5">
          {faqByCategory.length === 0 ? (
            <p className="py-12 text-center text-muted">{isEn ? "No questions available yet." : "Aucune question disponible pour le moment."}</p>
          ) : (
            <FaqAccordion categories={faqByCategory} locale={locale} />
          )}

          {/* Pas de réponse ? */}
          <div data-no-reveal className={`mt-12 flex flex-col items-start gap-5 p-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:p-8 ${card}`}>
            <p className="font-display text-2xl font-medium tracking-[-0.02em] text-navy sm:text-[1.75rem]">{t("contactUs")}</p>
            <Link href="/contact" className={`w-full shrink-0 sm:w-auto ${btnDark}`}>
              {t("contactLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
