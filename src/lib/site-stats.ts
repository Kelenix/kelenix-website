import { prisma } from "@/lib/prisma";

// Source UNIQUE des statistiques affichées sur le site (hero, « Nos chiffres »,
// à propos, témoignages, portfolio). Éditable dans Admin → Paramètres.
export type SiteStats = {
  projects: string;
  clients: string;
  /** Année de création de l'entreprise. */
  founded: string;
  technologies: string;
  satisfaction: string;
  team: string;
  countries: string;
  rating: string;
  response: string;
};

export const STAT_DEFAULTS: SiteStats = {
  projects: "150+",
  clients: "80+",
  founded: "2024",
  technologies: "15+",
  satisfaction: "98%",
  team: "20+",
  countries: "3",
  rating: "4.9/5",
  response: "< 24h",
};

export const STAT_KEYS: Record<keyof SiteStats, string> = {
  projects: "stat_projects",
  clients: "stat_clients",
  founded: "stat_founded",
  technologies: "stat_technologies",
  satisfaction: "stat_satisfaction",
  team: "stat_team",
  countries: "stat_countries",
  rating: "stat_rating",
  response: "stat_response",
};

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: Object.values(STAT_KEYS) } },
      select: { key: true, value: true },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const out = { ...STAT_DEFAULTS };
    (Object.keys(STAT_KEYS) as (keyof SiteStats)[]).forEach((k) => {
      const v = map[STAT_KEYS[k]];
      if (v) out[k] = v;
    });
    return out;
  } catch {
    return { ...STAT_DEFAULTS };
  }
}
