import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";

// Dernier appel à l'action : une grande carte bleue, seul aplat de couleur forte de la page.
export default async function CtaSection() {
  const t = await getTranslations("home.cta");

  return (
    <Reveal className="bg-white px-3 py-16 sm:px-5 sm:py-20 lg:py-28">
      <div data-reveal="scale" className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-linear-to-br from-[#0A4FAE] via-azure to-[#1580EE] px-6 py-14 text-center text-white sm:rounded-[2.5rem] sm:px-12 sm:py-20 lg:py-24">
        {/* Halos : blanc en haut à gauche, bleu clair en bas à droite */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div data-parallax="12" className="absolute -left-[10%] -top-[40%] h-[90%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />
          <div data-parallax="-12" className="absolute -bottom-[45%] -right-[8%] h-[95%] w-[50%] bg-[radial-gradient(closest-side,rgba(108,196,255,0.6),rgba(108,196,255,0))]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <h2 data-lines className="text-balance font-display text-[2.4rem] font-medium leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-white/85 sm:text-xl">{t("text")}</p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/devis"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-navy shadow-[0_14px_30px_-12px_rgba(6,15,28,0.5)] transition-colors hover:bg-gold"
              >
                {t("cta1")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link
              href="/contact"
              className="flex w-full items-center justify-center rounded-full border border-white/45 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/12 sm:w-auto"
            >
              {t("cta2")}
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
