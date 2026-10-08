import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProcessMotion from "@/components/home/ProcessMotion";

type Step = { title: string; text: string };

// Les cinq étapes d'un projet. Le JSX décrit l'état final (tout est fait) ;
// ProcessMotion remplit le rail et allume chaque étape au rythme du défilement.
export default async function ProcessSection() {
  const t = await getTranslations("home.process");
  const steps = t.raw("steps") as Step[];
  const last = steps[steps.length - 1];

  const cta = (
    <Link
      href="/devis"
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-azure sm:w-auto"
    >
      {t("cta")}
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );

  return (
    <ProcessMotion className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 xl:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 data-lines className="text-balance font-display text-[2.1rem] font-medium leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl lg:text-[3.4rem]">
            {t("title")}
          </h2>
          <p data-reveal className="mt-4 max-w-md text-pretty text-[1.05rem] leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {t("lead")}
          </p>

          {/* Étape en cours, suivie pendant le défilement (ordinateur) */}
          <div data-reveal className="mt-10 hidden max-w-sm rounded-2xl border border-line bg-mist/70 p-5 lg:block">
            <p className="flex items-baseline justify-between text-sm text-muted">
              <span data-status-title className="text-base font-semibold text-navy">
                {last.title}
              </span>
              <span className="tabular-nums">
                <span data-status-index>{steps.length}</span> / {steps.length}
              </span>
            </p>
            <div className="mt-3 flex gap-1.5">
              {steps.map((step) => (
                <span key={step.title} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <span data-status-seg className="block h-full rounded-full bg-azure" />
                </span>
              ))}
            </div>
          </div>

          <div data-reveal className="mt-8 hidden lg:block">
            {cta}
          </div>
        </div>

        <div>
          <div data-track className="relative">
            <div aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-px -translate-x-1/2 bg-line">
              <div data-beam className="h-full w-full origin-top bg-azure" />
            </div>
            <ol>
              {steps.map((step, i) => (
                <li key={step.title} data-step data-title={step.title} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7 sm:pb-14">
                  <span data-step-badge className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-azure bg-azure font-display text-lg text-white">
                    {i + 1}
                  </span>
                  <div data-step-body className="pt-0.5">
                    <h3 className="font-display text-[1.7rem] font-medium leading-tight tracking-[-0.02em] text-navy sm:text-[2rem]">{step.title}</h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="mt-10 lg:hidden">
            {cta}
          </div>
        </div>
      </div>
    </ProcessMotion>
  );
}
