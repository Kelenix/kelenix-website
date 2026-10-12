import { COUNTRIES } from "@/lib/agent/countries";
import { input } from "@/components/admin/styles";
import { cn } from "@/lib/utils";

// Types et petites briques partagés par l'écran de prospection et son panneau de recherche.

export type Language = "fr" | "it" | "en";

export type Prospect = {
  id: string;
  company: string;
  website: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  language: string;
  notes: string | null;
  status: string;
  summary: string | null;
  angle: string | null;
  emailFound: string | null;
  subject: string | null;
  body: string | null;
  error: string | null;
};

export const LANGUAGES: Record<Language, string> = { fr: "Français", it: "Italien", en: "Anglais" };

export const STATUS: Record<string, { label: string; tone: string }> = {
  NEW: { label: "À préparer", tone: "bg-mist text-muted" },
  PREPARING: { label: "En préparation…", tone: "bg-azure/10 text-azure" },
  READY: { label: "Brouillon à relire", tone: "bg-gold/25 text-navy" },
  FAILED: { label: "Échec", tone: "bg-red-50 text-red-700" },
  SENT: { label: "Envoyé", tone: "bg-emerald-100 text-emerald-800" },
  REPLIED: { label: "A répondu", tone: "bg-emerald-100 text-emerald-800" },
  DECLINED: { label: "Pas intéressé", tone: "bg-slate-100 text-slate-500" },
  DO_NOT_CONTACT: { label: "Ne plus contacter", tone: "bg-slate-100 text-slate-500" },
};

/** « https://www.exemple.fr/ » → « exemple.fr ». */
export const host = (website: string) => website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

type SelectProps = { id: string; value: string; onChange: (value: string) => void; className?: string };

export function LanguageSelect({ id, value, onChange, className }: SelectProps) {
  return (
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={cn(input, className)}>
      {Object.entries(LANGUAGES).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}

/** Liste des pays ; la valeur vide correspond à `empty` (« Non précisé », « Tous les pays »…). */
export function CountrySelect({ id, value, onChange, className, empty = "Non précisé" }: SelectProps & { empty?: string }) {
  return (
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={cn(input, className)}>
      <option value="">{empty}</option>
      {/* Un pays hors liste (trouvé par l'agent) reste sélectionnable sur sa fiche. */}
      {value && !COUNTRIES[value] && <option value={value}>{value}</option>}
      {Object.entries(COUNTRIES).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
