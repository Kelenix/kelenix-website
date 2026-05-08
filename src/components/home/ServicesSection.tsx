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

const serviceColors = {
  software: "from-blue-500/10 to-sky/5",
  web: "from-sky/10 to-blue-400/5",
  webapp: "from-indigo-500/10 to-sky/5",
  mobile: "from-purple-500/10 to-sky/5",
  ai: "from-gold/10 to-yellow-400/5",
  consulting: "from-green-500/10 to-sky/5",
  training: "from-orange-500/10 to-sky/5",
};

type ServiceKey = keyof typeof serviceIcons;

export default function ServicesSection() {
  const t = useTranslations("services");

  const serviceKeys: ServiceKey[] = ["software", "web", "webapp", "mobile", "ai", "consulting", "training"];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
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
            const gradient = serviceColors[key];

            return (
              <Link
                key={key}
                href={{ pathname: "/services/[slug]", params: { slug } }}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 hover:border-sky/20"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                  gradient
                )}>
                  <Icon size={22} className="text-sky" />
                </div>
                <h3 className="font-heading font-bold text-navy text-base mb-2 group-hover:text-sky transition-colors">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {t(`items.${key}.description`)}
                </p>
                <div className="flex items-center gap-1 text-sky text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("learnMore")} <ArrowRight size={14} className="ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-sky transition-colors duration-200"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
