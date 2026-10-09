// Styles partagés par l'espace d'administration : le langage du site public (clair, bleu Kelenix, titres
// Newsreader), en plus dense pour un outil de travail.
export const pageTitle = "font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]";
export const pageLead = "mt-1.5 text-sm text-muted";
export const backLink = "mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-navy";

export const card = "rounded-2xl border border-line bg-white";
export const cardTitle = "text-base font-semibold text-navy";
export const empty = "px-6 py-14 text-center text-sm text-muted";

export const label = "mb-1.5 block text-sm font-medium text-navy";
export const input =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10";

const btn = "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
export const btnPrimary = `${btn} bg-azure px-5 py-2.5 text-white hover:bg-azure-dark`;
export const btnGhost = `${btn} border border-line bg-white px-5 py-2.5 text-navy hover:bg-mist`;

const small = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50";
export const btnSmall = `${small} border-line bg-white text-navy hover:border-azure hover:text-azure`;
export const btnSmallDanger = `${small} border-red-200 bg-white text-red-600 hover:bg-red-50`;

export const pill = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";

// États d'un message, d'un devis, d'une candidature ou d'une demande de partenariat.
export const STATUS: Record<string, { label: string; tone: string }> = {
  NEW: { label: "Nouveau", tone: "bg-gold/25 text-navy" },
  READ: { label: "Lu", tone: "bg-mist text-muted" },
  IN_PROGRESS: { label: "En cours", tone: "bg-azure/10 text-azure" },
  TREATED: { label: "Traité", tone: "bg-emerald-100 text-emerald-800" },
  ARCHIVED: { label: "Archivé", tone: "bg-slate-100 text-slate-500" },
};
export const STATUS_OPTIONS = Object.entries(STATUS).map(([value, { label }]) => ({ value, label }));
