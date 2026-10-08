// Styles partagés par les pages publiques (refonte claire) : mêmes titres, cartes, boutons et champs partout.
export const container = "container mx-auto max-w-7xl px-5 xl:px-8";
export const section = "py-16 sm:py-20 lg:py-24";

export const h2 = "text-balance font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-navy sm:text-[2.6rem] lg:text-5xl";
export const h3 = "text-xl font-semibold leading-snug text-navy";
export const lead = "text-pretty text-[1.05rem] leading-relaxed text-muted sm:text-lg";
export const body = "text-[15px] leading-relaxed text-muted sm:text-base";

export const card = "rounded-3xl border border-line bg-white";
export const iconTile = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-azure";
export const chip = "inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-[13px] font-medium text-navy";

const btn = "inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
export const btnPrimary = `${btn} bg-azure px-7 py-4 text-white hover:bg-azure-dark`;
export const btnDark = `${btn} bg-navy px-7 py-4 text-white hover:bg-azure`;
export const btnGhost = `${btn} border border-line bg-white px-7 py-4 text-navy hover:bg-mist`;
export const textLink = "font-semibold text-navy underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-azure";

export const label = "mb-1.5 block text-sm font-medium text-navy";
export const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] text-navy transition placeholder:text-muted/70 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10";
