import { getTranslations } from "next-intl/server";
import { Award, Check, Globe2, Headphones, Shield, Star, Wallet, Zap } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

const TECH = ["Next.js", "React", "Node.js", "Flutter", "Python", "PostgreSQL"];

function Card({
  icon: Icon,
  title,
  text,
  className = "",
  children,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <li data-reveal className={`flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:gap-6 sm:p-7 ${children ? "lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-9" : ""} ${className}`}>
      <div className="flex max-w-sm gap-4 sm:block">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-azure sm:mb-5">
          <Icon size={22} />
        </span>
        <div>
          <h3 className="text-lg font-semibold leading-snug text-navy sm:text-xl">{title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted sm:mt-2">{text}</p>
        </div>
      </div>
      {children}
    </li>
  );
}

// Les raisons de choisir Kelenix : deux cartes larges illustrées, quatre cartes simples et la note des clients.
export default async function WhyUsSection({ rating }: { rating: string }) {
  const t = await getTranslations("home.why");
  const checks = t.raw("checks") as string[];
  const item = (key: string) => ({ title: t(`items.${key}.title`), text: t(`items.${key}.text`) });

  return (
    <Reveal className="bg-mist py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-5 xl:px-8">
        <SectionHeading title={t("title")} />

        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card icon={Award} {...item("expertise")} className="md:col-span-2">
            <ul aria-hidden="true" className="flex max-w-[17rem] flex-wrap gap-2">
              {TECH.map((name) => (
                <li key={name} className="rounded-full border border-line bg-mist/70 px-3.5 py-1.5 text-sm font-medium text-navy">
                  {name}
                </li>
              ))}
            </ul>
          </Card>
          <Card icon={Zap} {...item("agile")} />
          <Card icon={Headphones} {...item("support")} />
          <Card icon={Shield} {...item("quality")} className="md:col-span-2">
            <ul aria-hidden="true" className="flex w-full max-w-[17rem] flex-col gap-2.5 rounded-2xl bg-mist/70 p-4">
              {checks.map((label) => (
                <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-navy">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </Card>
          <Card icon={Globe2} {...item("international")} />
          <Card icon={Wallet} {...item("accessible")} />

          <li data-reveal className="flex flex-col justify-between gap-6 rounded-3xl bg-linear-to-br from-azure to-sky p-6 text-white sm:p-7 md:col-span-2 lg:col-span-1">
            <span aria-hidden="true" className="flex gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </span>
            <p>
              <span className="block font-display text-6xl font-medium leading-none tracking-[-0.03em] tabular-nums">{rating}</span>
              <span className="mt-2 block text-[15px] text-white/85">{t("ratingLabel")}</span>
            </p>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}
