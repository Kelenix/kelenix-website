import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { decodeSlug, slugify } from "@/lib/utils";
import {
  ArrowRight,
  Plus,
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
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { btnGhost, btnPrimary, card, chip, container, h2, iconTile, section } from "@/components/site/styles";

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
  return <Icon size={22} />;
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
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
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
    <div className={`divide-y divide-line overflow-hidden ${card}`}>
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6 [&::-webkit-details-marker]:hidden">
            <span className="text-[1.02rem] font-semibold leading-snug text-navy sm:text-lg">{item.question}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition-transform duration-300 group-open:rotate-45">
              <Plus size={18} />
            </span>
          </summary>
          <p className="max-w-2xl px-5 pb-6 text-[15px] leading-relaxed text-muted sm:px-7 sm:text-base">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) {
    // Ancien lien vers un slug non normalisé (« Custom SaaS ») : on renvoie vers le slug corrigé s'il existe.
    const canonical = slugify(slug);
    if (canonical && canonical !== slug) {
      const renamed = await prisma.service.findUnique({ where: { slug: canonical }, select: { slug: true } });
      if (renamed) redirect({ href: { pathname: "/services/[slug]", params: { slug: renamed.slug } }, locale });
    }
    notFound();
  }

  const t = await getTranslations("common");
  const isEn = locale === "en";

  const title = isEn ? service.titleEn : service.titleFr;
  const shortDesc = isEn ? service.shortDescEn : service.shortDescFr;
  const longDesc = isEn ? service.longDescEn : service.longDescFr;
  const faqItems = parseFaq(isEn ? service.faqEn : service.faqFr);
  const technologies = parseTechnologies(service.technologies);

  return (
    <>
      <PageHero
        align="left"
        breadcrumb={[{ label: isEn ? "Home" : "Accueil", href: "/" }, { label: "Services", href: "/services" }, { label: title }]}
        title={title}
        lead={shortDesc}
      >
        <Link href="/devis" className={`group ${btnPrimary}`}>
          {isEn ? "Request a quote" : "Demander un devis"}
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/contact" className={btnGhost}>
          {isEn ? "Contact us" : "Nous contacter"}
        </Link>
      </PageHero>

      <section className={`bg-white ${section}`}>
        <div className={container}>
          {service.image && (
            <div className="mb-12 aspect-[16/9] overflow-hidden rounded-3xl bg-mist sm:mb-16 lg:aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element -- image saisie dans l'admin : domaine libre, hors remotePatterns */}
              <img src={service.image} alt={title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div className="min-w-0">
              <h2 className={`mb-6 ${h2}`}>{isEn ? "Service details" : "Détail du service"}</h2>
              <div className="prose-kelenix max-w-3xl" dangerouslySetInnerHTML={{ __html: longDesc }} />
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className={`p-6 sm:p-7 ${card}`}>
                <span className={`mb-5 ${iconTile}`}>
                  <ServiceIcon name={service.icon} />
                </span>
                {technologies.length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold text-navy">{isEn ? "Technologies used" : "Technologies utilisées"}</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <li key={tech} className={chip}>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Link href="/devis" className={`group mt-7 w-full ${btnPrimary}`}>
                  {isEn ? "Get a free quote" : "Obtenir un devis gratuit"}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {faqItems.length > 0 && (
        <section className={`bg-mist ${section}`}>
          <div className={`${container} grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16`}>
            <div>
              <h2 className={h2}>{isEn ? "Frequently asked questions" : "Questions fréquentes"}</h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-muted sm:text-lg">
                {isEn ? "Everything you need to know about this service" : "Tout ce que vous devez savoir sur ce service"}
              </p>
            </div>
            <Accordion items={faqItems} />
          </div>
        </section>
      )}

      <CtaBand
        title={isEn ? "Ready to get started?" : "Prêt à vous lancer ?"}
        text={
          isEn
            ? "Contact us today for a free consultation and a personalized quote."
            : "Contactez-nous dès aujourd'hui pour une consultation gratuite et un devis personnalisé."
        }
        primary={{ href: "/devis", label: isEn ? "Get a free quote" : "Obtenir un devis gratuit" }}
        secondary={{ href: "/services", label: t("backToServices") }}
      />
    </>
  );
}
