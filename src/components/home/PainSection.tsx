import { getTranslations } from "next-intl/server";
import { Check, MessageSquareOff, TrendingDown, Unplug } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

const icons = [TrendingDown, MessageSquareOff, Unplug];

type Item = { problem: string; detail: string; solution: string };

// Les problèmes du client et, pour chacun, ce que Kelenix fait à la place.
export default async function PainSection() {
  const t = await getTranslations("home.pain");
  const items = t.raw("items") as Item[];

  return (
    <Reveal className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 xl:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 data-lines className="text-balance font-display text-[2.1rem] font-medium leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl lg:text-[3.4rem]">
            {t("title")}
          </h2>
          <p data-reveal className="mt-4 max-w-md text-pretty text-[1.05rem] leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {t("lead")}
          </p>
        </div>

        <ul className="flex flex-col gap-4 sm:gap-5">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={item.problem} data-reveal className="rounded-3xl border border-line bg-mist/70 p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDECEA] text-[#C4372D]">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="sr-only">{t("before")}</p>
                    <h3 className="text-lg font-semibold leading-snug text-navy line-through decoration-[#E0564E]/60 decoration-2">{item.problem}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{item.detail}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-white p-4 sm:items-center">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-azure text-white sm:mt-0">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <p className="text-[15px] font-medium leading-snug text-navy sm:text-base">
                    <span className="sr-only">{t("after")} : </span>
                    {item.solution}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
