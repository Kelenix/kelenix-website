import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { container } from "@/components/site/styles";

type Href = React.ComponentProps<typeof Link>["href"];
export type Crumb = { label: string; href?: Href };

// En-tête des pages intérieures : fond blanc, voile bleu léger, grand titre serif.
// data-no-reveal : le titre s'affiche tout de suite, sans attendre le JavaScript (voir AutoReveal).
export default function PageHero({
  title,
  lead,
  eyebrow,
  breadcrumb,
  align = "center",
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Fil d'Ariane : le dernier élément est la page courante. */
  breadcrumb?: Crumb[];
  align?: "center" | "left";
  children?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <section data-no-reveal className="relative overflow-hidden border-b border-line bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(70%_90%_at_50%_0%,rgba(47,168,255,0.13),transparent)]" />
      <div className={`${container} relative py-10 sm:py-14 lg:py-20 ${centered ? "text-center" : ""}`}>
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
            <ol className={`flex flex-wrap items-center gap-1.5 text-sm text-muted ${centered ? "justify-center" : ""}`}>
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
                  {i > 0 && <ChevronRight size={14} className="shrink-0 text-muted/60" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-navy">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="max-w-[16rem] truncate font-medium text-navy">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-navy sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {eyebrow}
          </p>
        )}
        <h1 className={`max-w-4xl text-balance font-display text-[2.4rem] font-medium leading-[1.04] tracking-[-0.03em] text-navy sm:text-6xl lg:text-[4.25rem] ${centered ? "mx-auto" : ""}`}>
          {title}
        </h1>
        {lead && <p className={`mt-5 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-muted sm:text-xl ${centered ? "mx-auto" : ""}`}>{lead}</p>}
        {children && <div className={`mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${centered ? "sm:justify-center" : ""}`}>{children}</div>}
      </div>
    </section>
  );
}
