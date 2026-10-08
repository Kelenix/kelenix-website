import { getTranslations } from "next-intl/server";
import Reveal from "@/components/motion/Reveal";
import CtaBand from "@/components/site/CtaBand";

// Dernier appel à l'action de la page d'accueil.
export default async function CtaSection() {
  const t = await getTranslations("home.cta");

  return (
    <Reveal>
      <CtaBand reveal title={t("title")} text={t("text")} primary={{ href: "/devis", label: t("cta1") }} secondary={{ href: "/contact", label: t("cta2") }} />
    </Reveal>
  );
}
