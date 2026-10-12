import { kelenix } from "./kelenix";
import type { Tenant } from "./types";

// Entreprises servies par l'assistant. Kelenix est la seule pour l'instant ; en ajouter une
// revient à écrire son fichier (connaissances, choix, enregistrement) et à l'inscrire ici.
const TENANTS: Record<string, Tenant> = { [kelenix.id]: kelenix };

export const DEFAULT_TENANT = kelenix.id;

export function getTenant(id: string): Tenant {
  const tenant = TENANTS[id];
  if (!tenant) throw new Error(`[agent] Entreprise inconnue : ${id}`);
  return tenant;
}
