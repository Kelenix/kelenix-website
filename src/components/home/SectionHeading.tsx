import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Href = React.ComponentProps<typeof Link>["href"];

// Lien « voir tout » : texte souligné sur ordinateur, bouton pleine largeur sur téléphone (variant "block").
export function MoreLink({ href, children, variant = "inline" }: { href: Href; children: React.ReactNode; variant?: "inline" | "block" }) {
  if (variant === "block") {
    return (
      <Link
        href={href}
        className="flex items-center justify-center gap-2 rounded-full border border-line bg-white py-3.5 text-[15px] font-semibold text-navy active:bg-mist"
      >
        {children} <ArrowRight size={16} />
      </Link>
    );
  }
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-navy transition-colors hover:text-azure">
      {children}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

// En-tête de section : titre aligné à gauche, texte d'appui, et lien éventuel à droite (ordinateur).
export default function SectionHeading({
  title,
  lead,
  action,
  className = "",
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-10 flex items-end justify-between gap-8 sm:mb-12 lg:mb-16 ${className}`}>
      <div className="max-w-3xl">
        <h2 data-lines className="text-balance font-display text-[2.1rem] font-medium leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h2>
        {lead && (
          <p data-reveal className="mt-4 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {lead}
          </p>
        )}
      </div>
      {action && (
        <div data-reveal className="hidden pb-2 md:block">
          {action}
        </div>
      )}
    </div>
  );
}
