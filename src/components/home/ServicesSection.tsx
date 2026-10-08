import { getTranslations } from "next-intl/server";
import {
  ArrowRight, ArrowUpRight, Brain, ChevronRight, Cloud, Code, Cpu, Database, Globe, GraduationCap, Layers, Monitor, ShieldCheck, Smartphone,
  TrendingUp, Wrench,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/motion/Reveal";
import SectionHeading, { MoreLink } from "@/components/home/SectionHeading";

const iconMap: Record<string, React.ElementType> = {
  Code, Globe, Monitor, Smartphone, Brain, TrendingUp, GraduationCap, Layers, Cpu, Wrench, Database, Cloud, ShieldCheck,
};

type HomeService = { slug: string; titleFr: string; titleEn: string; shortDescFr: string; shortDescEn: string; icon: string };
type Fallback = { icon: string; title: string; text: string };

const spanClass: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4", 6: "lg:col-span-6" };

// Services : grille « bento » sur ordinateur (deux grandes cartes puis des petites),
// liste compacte sur téléphone. Sans service en base, on affiche la liste par défaut des traductions.
export default async function ServicesSection({ services, locale }: { services: HomeService[]; locale: string }) {
  const t = await getTranslations("home.services");
  const isEn = locale === "en";

  const cards = services.length
    ? services.map((s) => ({
        key: s.slug,
        href: { pathname: "/services/[slug]" as const, params: { slug: s.slug } },
        icon: s.icon,
        title: isEn ? s.titleEn : s.titleFr,
        text: isEn ? s.shortDescEn : s.shortDescFr,
      }))
    : (t.raw("fallback") as Fallback[]).map((s) => ({ key: s.title, href: "/services" as const, icon: s.icon, title: s.title, text: s.text }));

  // La tuile « autre besoin » complète la dernière rangée (grille de 6 colonnes : 3 + 3, puis 2 + 2 + 2).
  const used = cards.reduce((sum, _, i) => sum + (i < 2 ? 3 : 2), 0) % 6;
  const lastSpan = used === 0 ? 6 : 6 - used;

  return (
    <Reveal className="bg-mist py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-5 xl:px-8">
        <SectionHeading title={t("title")} lead={t("lead")} action={<MoreLink href="/services">{t("viewAll")}</MoreLink>} />

        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white md:grid md:grid-cols-2 md:gap-5 md:divide-y-0 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent lg:grid-cols-6">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon] ?? Code;
            const large = i < 2;
            return (
              <li key={card.key} data-reveal className={`md:flex ${large ? "lg:col-span-3" : "lg:col-span-2"}`}>
                <Link
                  href={card.href}
                  className={`group relative flex w-full items-center gap-4 p-4 active:bg-mist md:flex-col md:items-start md:gap-0 md:overflow-hidden md:rounded-3xl md:border md:border-line md:bg-white md:p-7 md:transition-colors md:hover:border-sky/60 ${large ? "lg:min-h-[17.5rem] lg:p-9" : ""}`}
                >
                  {large && <Icon aria-hidden="true" strokeWidth={0.9} className="pointer-events-none absolute -bottom-10 -right-8 hidden h-52 w-52 text-sky/15 lg:block" />}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-azure transition-colors md:mb-6 md:h-12 md:w-12 md:group-hover:bg-azure md:group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <span className="relative min-w-0 flex-1 md:flex-none">
                    <span className={`block font-semibold leading-snug text-navy ${large ? "text-[1.05rem] md:text-2xl" : "text-[1.05rem] md:text-xl"}`}>{card.title}</span>
                    <span className={`mt-2 hidden text-[15px] leading-relaxed text-muted md:block ${large ? "max-w-sm lg:text-base" : ""}`}>{card.text}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted md:hidden" />
                  <span className="absolute right-7 top-7 hidden h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition-colors group-hover:border-navy group-hover:bg-navy group-hover:text-white md:flex">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </li>
            );
          })}

          <li data-reveal className={`md:flex ${cards.length % 2 === 0 ? "md:col-span-2" : ""} ${spanClass[lastSpan]}`}>
            <Link
              href="/contact"
              className="group flex w-full flex-col justify-between gap-5 bg-linear-to-br from-azure to-sky p-5 text-white md:rounded-3xl md:p-7 lg:flex-row lg:items-center"
            >
              <span>
                <span className="block text-xl font-semibold leading-snug md:text-2xl">{t("more.title")}</span>
                <span className="mt-1.5 block max-w-md text-[15px] leading-relaxed text-white/85">{t("more.text")}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy lg:self-auto">
                {t("more.cta")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>

        <div data-reveal className="mt-5 md:hidden">
          <MoreLink href="/services" variant="block">
            {t("viewAll")}
          </MoreLink>
        </div>
      </div>
    </Reveal>
  );
}
