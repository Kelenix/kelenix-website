import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Plus,
  Minus,
  Code,
  Globe,
  Monitor,
  Smartphone,
  Brain,
  TrendingUp,
  GraduationCap,
  Layers,
  Cpu,
  Wrench,
  Database,
  Cloud,
  ShieldCheck,
} from "lucide-react";

type Props = { params: Promise<{ locale: string; slug: string }> };

const iconMap: Record<string, React.ElementType> = {
  Code,
  Globe,
  Monitor,
  Smartphone,
  Brain,
  TrendingUp,
  GraduationCap,
  Layers,
  Cpu,
  Wrench,
  Database,
  Cloud,
  ShieldCheck,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Code;
  return <Icon size={32} className="text-white" />;
}

export async function generateStaticParams() {
  try {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const locales = ["fr", "en"];
  return locales.flatMap((locale) =>
    services.map((s: { slug: string }) => ({ locale, slug: s.slug }))
  );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return {};
  const isEn = locale === "en";
  return {
    title: isEn ? service.titleEn : service.titleFr,
    description: isEn ? service.shortDescEn : service.shortDescFr,
    openGraph: {
      images: service.image ? [{ url: service.image }] : [],
    },
  };
}

type FaqItem = { question: string; answer: string };

// Tolère les deux formats stockés : { question, answer } et l'ancien { q, a }.
function parseFaq(raw: string): FaqItem[] {
  try {
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        question: String(item.question ?? item.q ?? ""),
        answer: String(item.answer ?? item.a ?? ""),
      }))
      .filter((item) => item.question.trim() !== "" || item.answer.trim() !== "");
  } catch {
    return [];
  }
}

function parseTechnologies(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <details key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
            <span className="font-heading font-semibold text-navy pr-4">{item.question}</span>
            <span className="shrink-0 w-8 h-8 bg-sky/10 rounded-full flex items-center justify-center">
              <Plus size={16} className="text-sky group-open:hidden" />
              <Minus size={16} className="text-sky hidden group-open:block" />
            </span>
          </summary>
          <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();

  const t = await getTranslations("common");
  const isEn = locale === "en";

  const title = isEn ? service.titleEn : service.titleFr;
  const shortDesc = isEn ? service.shortDescEn : service.shortDescFr;
  const longDesc = isEn ? service.longDescEn : service.longDescFr;
  const faqItems = parseFaq(isEn ? service.faqEn : service.faqFr);
  const technologies = parseTechnologies(service.technologies);

  return (
    <main>
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-sky transition-colors">
                {isEn ? "Home" : "Accueil"}
              </Link>
            </li>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <li>
              <Link href="/services" className="hover:text-sky transition-colors">
                {isEn ? "Services" : "Services"}
              </Link>
            </li>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <li className="text-navy font-medium truncate max-w-xs">{title}</li>
          </ol>
        </div>
      </nav>

      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy to-sky/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="w-14 h-14 bg-sky/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5">
            <ServiceIcon name={service.icon} />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">{shortDesc}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 px-7 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              {isEn ? "Request a quote" : "Demander un devis"} <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              {isEn ? "Contact us" : "Nous contacter"}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy mb-8">
              {isEn ? "Service details" : "Détail du service"}
            </h2>
            <div
              className="prose-kelenix"
              dangerouslySetInnerHTML={{ __html: longDesc }}
            />
          </div>
        </div>
      </section>

      {technologies.length > 0 && (
        <section className="py-16 bg-neutral-light">
          <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy mb-4">
                {isEn ? "Technologies used" : "Technologies utilisées"}
              </h2>
              <p className="text-gray-500">
                {isEn
                  ? "Our certified technology stack for this service"
                  : "Notre stack technologique certifiée pour ce service"}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-navy font-semibold text-sm shadow-sm hover:border-sky/40 hover:text-sky transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy mb-4">
                  {isEn ? "Frequently asked questions" : "Questions fréquentes"}
                </h2>
                <p className="text-gray-500">
                  {isEn
                    ? "Everything you need to know about this service"
                    : "Tout ce que vous devez savoir sur ce service"}
                </p>
              </div>
              <Accordion items={faqItems} />
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">
            {isEn ? "Ready to get started?" : "Prêt à vous lancer ?"}
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {isEn
              ? "Contact us today for a free consultation and a personalized quote."
              : "Contactez-nous dès aujourd'hui pour une consultation gratuite et un devis personnalisé."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              {isEn ? "Get a free quote" : "Obtenir un devis gratuit"} <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              {t("backToServices")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
