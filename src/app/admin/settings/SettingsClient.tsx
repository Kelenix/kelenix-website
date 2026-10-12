"use client";

import { useState } from "react";
import { AlertCircle, BarChart3, Building2, CheckCircle, Megaphone, Save, Search, Share2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui";
import { btnPrimary, card, cardTitle, input, label } from "@/components/admin/styles";

type Settings = Record<string, string>;
type Field = { key: string; label: string; placeholder?: string; hint?: string; inputType?: string; textarea?: boolean; defaultValue?: string };
type Section = {
  title: string;
  hint?: string;
  icon: LucideIcon;
  /** Carte sur toute la largeur, avec plus de champs par ligne (beaucoup de valeurs courtes). */
  wide?: boolean;
  fields: Field[];
};

const sections: Section[] = [
  {
    title: "Informations de l'entreprise",
    icon: Building2,
    fields: [
      { key: "company_name", label: "Nom" },
      { key: "company_email", label: "E-mail", inputType: "email" },
      { key: "company_phone", label: "Téléphone", placeholder: "+39 350 123 4567" },
      { key: "company_whatsapp", label: "WhatsApp", placeholder: "393501234567", hint: "Chiffres uniquement, avec l'indicatif du pays." },
      { key: "company_address", label: "Adresse" },
      { key: "company_hours", label: "Horaires", placeholder: "Lun - Ven : 9h00 - 18h00" },
    ],
  },
  {
    title: "Réseaux sociaux",
    hint: "Adresse complète de chaque page. Laissez vide pour ne pas l'afficher.",
    icon: Share2,
    fields: [
      { key: "company_linkedin", label: "LinkedIn", placeholder: "https://…" },
      { key: "company_facebook", label: "Facebook", placeholder: "https://…" },
      { key: "company_instagram", label: "Instagram", placeholder: "https://…" },
      { key: "company_tiktok", label: "TikTok", placeholder: "https://…" },
      { key: "company_youtube", label: "YouTube", placeholder: "https://…" },
      { key: "company_twitter", label: "X (Twitter)", placeholder: "https://…" },
    ],
  },
  {
    title: "Référencement (SEO)",
    hint: "Titre et description repris par Google et les réseaux sociaux.",
    icon: Search,
    fields: [
      { key: "meta_title_fr", label: "Titre (français)" },
      { key: "meta_title_en", label: "Titre (anglais)" },
      { key: "meta_description_fr", label: "Description (français)", textarea: true },
      { key: "meta_description_en", label: "Description (anglais)", textarea: true },
    ],
  },
  {
    title: "Publicité et mesure",
    hint: "Chargés seulement si le visiteur accepte les cookies. Laissez vide pour ne rien charger.",
    icon: Megaphone,
    fields: [
      { key: "meta_pixel_id", label: "Pixel Meta (Facebook / Instagram)", placeholder: "123456789012345" },
      { key: "google_analytics_id", label: "Google Analytics", placeholder: "G-XXXXXXXXXX" },
      { key: "google_ads_id", label: "Google Ads", placeholder: "AW-123456789" },
    ],
  },
  {
    title: "Chiffres clés du site",
    hint: "Source unique des chiffres affichés sur l'accueil, À propos, les témoignages et le portfolio.",
    icon: BarChart3,
    wide: true,
    fields: [
      { key: "stat_projects", label: "Projets livrés", placeholder: "150+", defaultValue: "150+" },
      { key: "stat_clients", label: "Clients satisfaits", placeholder: "80+", defaultValue: "80+" },
      { key: "stat_founded", label: "Année de création", placeholder: "2024", defaultValue: "2024" },
      { key: "stat_technologies", label: "Technologies maîtrisées", placeholder: "15+", defaultValue: "15+" },
      { key: "stat_satisfaction", label: "Taux de satisfaction", placeholder: "98%", defaultValue: "98%" },
      { key: "stat_team", label: "Équipe d'experts", placeholder: "20+", defaultValue: "20+" },
      { key: "stat_countries", label: "Pays couverts", placeholder: "3", defaultValue: "3" },
      { key: "stat_rating", label: "Note clients", placeholder: "4.9/5", defaultValue: "4.9/5" },
      { key: "stat_response", label: "Délai de réponse", placeholder: "< 24h", defaultValue: "< 24h" },
    ],
  },
];

// Valeurs par défaut pré-remplies quand la clé n'existe pas encore en base.
const fieldDefaults: Settings = Object.fromEntries(
  sections.flatMap((s) => s.fields).filter((f) => f.defaultValue !== undefined).map((f) => [f.key, f.defaultValue as string])
);

// Paramètres du site : les cartes se rangent deux par ligne sur grand écran, et leurs champs se mettent
// sur plusieurs colonnes dès que la carte est assez large (requêtes de conteneur « @… »).
export default function SettingsClient({ settings }: { settings: Settings }) {
  const [form, setForm] = useState<Settings>({ ...fieldDefaults, ...settings });
  const [saved, setSaved] = useState(form);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setStatus("saving");
    // Même mise au propre que le serveur : le lien WhatsApp n'accepte que des chiffres.
    const data = { ...form, company_whatsapp: (form.company_whatsapp ?? "").replace(/\D/g, "") };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setForm(data);
        setSaved(data);
        setStatus("success");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const saveBar = (
    <>
      {status === "success" && (
        <span role="status" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
          <CheckCircle size={16} /> Enregistré
        </span>
      )}
      {status === "error" && (
        <span role="alert" className="flex items-center gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle size={16} /> Enregistrement impossible
        </span>
      )}
      {status === "idle" && dirty && <span className="text-sm text-muted">Modifications non enregistrées</span>}
      <button type="button" onClick={handleSave} disabled={status === "saving"} className={btnPrimary}>
        <Save size={16} /> {status === "saving" ? "Enregistrement…" : "Enregistrer"}
      </button>
    </>
  );

  return (
    <>
      <PageHeader title="Paramètres du site" lead="Informations de l'entreprise et configuration globale">
        {saveBar}
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-2">
        {sections.map(({ title, hint, icon: Icon, wide, fields }) => (
          <section key={title} className={cn(card, "@container p-5 sm:p-6", wide && "xl:col-span-2")}>
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist text-azure">
                <Icon size={17} />
              </span>
              <div className="min-w-0">
                <h2 className={cardTitle}>{title}</h2>
                {hint && <p className="mt-0.5 text-xs leading-relaxed text-muted">{hint}</p>}
              </div>
            </div>

            <div className={cn("grid gap-4", wide ? "grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-5" : "@md:grid-cols-2")}>
              {fields.map((field) => {
                const id = `setting-${field.key}`;
                const props = {
                  id,
                  value: form[field.key] || "",
                  placeholder: field.placeholder,
                  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field.key, event.target.value),
                };
                return (
                  <div key={field.key}>
                    <label htmlFor={id} className={label}>
                      {field.label}
                    </label>
                    {field.textarea ? <textarea rows={3} {...props} className={cn(input, "resize-none")} /> : <input type={field.inputType || "text"} {...props} className={input} />}
                    {field.hint && <p className="mt-1.5 text-xs text-muted">{field.hint}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">{saveBar}</div>
    </>
  );
}
