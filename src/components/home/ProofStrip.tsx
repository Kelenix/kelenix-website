import { getTranslations } from "next-intl/server";
import Reveal from "@/components/motion/Reveal";
import type { SiteStats } from "@/lib/site-stats";

// Bordures et retraits de chaque case : grille 2 × 2 sur téléphone, 4 colonnes sur ordinateur.
const cells = [
  "border-b border-r pr-5 lg:border-b-0 lg:pr-8",
  "border-b pl-5 lg:border-b-0 lg:border-r lg:px-8",
  "border-r pr-5 lg:px-8",
  "pl-5 lg:pl-8",
];

// Les chiffres clés, juste sous le hero. Valeurs éditables dans Admin → Paramètres.
// Le texte affiché est toujours la vraie valeur : pas de compteur qui monte depuis zéro, car une page lue
// ou capturée pendant le comptage montrait un chiffre faux (« 48 % » au lieu de « 98 % »).
export default async function ProofStrip({ stats }: { stats: SiteStats }) {
  const t = await getTranslations("home.proof");
  const items = [
    { value: stats.projects, label: t("projects") },
    { value: stats.clients, label: t("clients") },
    { value: stats.founded, label: t("founded") },
    { value: stats.satisfaction, label: t("satisfaction") },
  ];

  return (
    <Reveal className="bg-white">
      <div className="container mx-auto max-w-7xl px-5 xl:px-8">
        <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={item.label} className={`flex flex-col-reverse border-line py-7 sm:py-9 lg:py-11 ${cells[i]}`}>
              <dt data-reveal className="mt-2 text-sm text-muted sm:text-base">{item.label}</dt>
              <dd data-reveal className="font-display text-[2.75rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-navy sm:text-6xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}
