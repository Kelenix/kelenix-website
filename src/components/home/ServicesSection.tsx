"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Code, Globe, Monitor, Smartphone, Brain, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const serviceIcons = {
  software: Code,
  web: Globe,
  webapp: Monitor,
  mobile: Smartphone,
  ai: Brain,
  consulting: TrendingUp,
  training: GraduationCap,
};

const serviceSlugs = {
  software: "developpement-logiciel",
  web: "creation-sites-web",
  webapp: "applications-web",
  mobile: "applications-mobiles",
  ai: "intelligence-artificielle",
  consulting: "consulting-informatique",
  training: "formation-programmation",
};

// Dégradé plein de l'icône + halo assorti
const serviceColors: Record<ServiceKey, { grad: string; glow: string }> = {
  software:   { grad: "from-blue-500 to-sky-dark",     glow: "bg-blue-500/20" },
  web:        { grad: "from-sky to-blue-400",          glow: "bg-sky/20" },
  webapp:     { grad: "from-indigo-500 to-sky",        glow: "bg-indigo-500/20" },
  mobile:     { grad: "from-purple-500 to-indigo-500", glow: "bg-purple-500/20" },
  ai:         { grad: "from-gold to-gold-dark",        glow: "bg-gold/25" },
  consulting: { grad: "from-emerald-500 to-teal-500",  glow: "bg-emerald-500/20" },
  training:   { grad: "from-orange-500 to-amber-500",  glow: "bg-orange-500/20" },
};

type ServiceKey = keyof typeof serviceIcons;

export default function ServicesSection() {
  const t = useTranslations("services");

  const serviceKeys: ServiceKey[] = ["software", "web", "webapp", "mobile", "ai", "consulting", "training"];

  return (
    <section className="relative py-24 bg-linear-to-b from-white via-neutral-light to-white overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="relative container mx-auto px-4 xl:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-sky/10 text-sky text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            {t("title")}{" "}
            <span className="text-sky">{t("titleHighlight")}</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {serviceKeys.map((key) => {
            const Icon = serviceIcons[key];
            const slug = serviceSlugs[key];
            const c = serviceColors[key];

            return (
              <Link
                key={key}
                href={{ pathname: "/services/[slug]", params: { slug } }}
                className="group relative glass-light glass-hover rounded-3xl p-6 overflow-hidden flex flex-col"
              >
                {/* Halo au survol */}
                <div className={cn("absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500", c.glow)} />

                <div className={cn(
                  "relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300",
                  c.grad
                )}>
                  <Icon size={22} className="text-white" strokeWidth={2.2} />
                </div>
                <h3 className="relative font-heading font-bold text-navy text-base mb-2 group-hover:text-sky transition-colors">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="relative text-gray-500 text-sm leading-relaxed mb-4">
                  {t(`items.${key}.description`)}
                </p>
                <div className="relative mt-auto flex items-center gap-1 text-sky text-sm font-semibold">
                  {t("learnMore")}
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-sky transition-colors duration-200 shadow-lg shadow-navy/20"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
