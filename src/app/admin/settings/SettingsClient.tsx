"use client";

import { useState } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

type Settings = Record<string, string>;
type Field = { key: string; label: string; inputType?: string; textarea?: boolean; defaultValue?: string };
type Section = { title: string; fields: Field[] };

const sections: Section[] = [
  {
    title: "Informations de l'entreprise",
    fields: [
      { key: "company_name", label: "Nom" },
      { key: "company_email", label: "Email", inputType: "email" },
      { key: "company_phone", label: "Téléphone" },
      { key: "company_whatsapp", label: "WhatsApp (numéro sans +)" },
      { key: "company_address", label: "Adresse" },
      { key: "company_hours", label: "Horaires (ex: Lun - Ven : 9h00 - 18h00)" },
    ],
  },
  {
    title: "Réseaux sociaux",
    fields: [
      { key: "company_linkedin", label: "LinkedIn URL" },
      { key: "company_facebook", label: "Facebook URL" },
      { key: "company_instagram", label: "Instagram URL" },
      { key: "company_tiktok", label: "TikTok URL" },
      { key: "company_youtube", label: "YouTube URL" },
      { key: "company_twitter", label: "Twitter/X URL" },
    ],
  },
  {
    title: "SEO global",
    fields: [
      { key: "meta_title_fr", label: "Titre méta (FR)" },
      { key: "meta_title_en", label: "Titre méta (EN)" },
      { key: "meta_description_fr", label: "Description méta (FR)", textarea: true },
      { key: "meta_description_en", label: "Description méta (EN)", textarea: true },
    ],
  },
  {
    title: "Publicité et mesure (chargés seulement si le visiteur accepte les cookies — laisser vide pour ne rien charger)",
    fields: [
      { key: "meta_pixel_id", label: "Pixel Meta — Facebook / Instagram (ex : 123456789012345)" },
      { key: "google_analytics_id", label: "Google Analytics (ex : G-XXXXXXXXXX)" },
      { key: "google_ads_id", label: "Google Ads (ex : AW-123456789)" },
    ],
  },
  {
    title: "Statistiques du site (source unique — hero, à propos, témoignages, portfolio)",
    fields: [
      { key: "stat_projects", label: "Projets livrés (ex: 150+)", defaultValue: "150+" },
      { key: "stat_clients", label: "Clients satisfaits (ex: 80+)", defaultValue: "80+" },
      { key: "stat_founded", label: "Année de création (ex: 2024)", defaultValue: "2024" },
      { key: "stat_technologies", label: "Technologies maîtrisées (ex: 15+)", defaultValue: "15+" },
      { key: "stat_satisfaction", label: "Taux de satisfaction (ex: 98%)", defaultValue: "98%" },
      { key: "stat_team", label: "Équipe d'experts (ex: 20+)", defaultValue: "20+" },
      { key: "stat_countries", label: "Pays couverts (ex: 3)", defaultValue: "3" },
      { key: "stat_rating", label: "Note clients (ex: 4.9/5)", defaultValue: "4.9/5" },
      { key: "stat_response", label: "Délai de réponse (ex: < 24h)", defaultValue: "< 24h" },
    ],
  },
];

// Valeurs par défaut pré-remplies quand la clé n'existe pas encore en base.
const fieldDefaults: Settings = Object.fromEntries(
  sections.flatMap(s => s.fields).filter(f => f.defaultValue !== undefined).map(f => [f.key, f.defaultValue as string])
);

export default function SettingsClient({ settings }: { settings: Settings }) {
  const [form, setForm] = useState<Settings>({ ...fieldDefaults, ...settings });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-line text-sm text-navy focus:outline-none focus:border-azure focus:ring-2 focus:ring-azure/10 transition-all";

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.title} className="bg-white rounded-2xl border border-line p-6">
          <h2 className="font-heading font-bold text-navy text-lg mb-5">{section.title}</h2>
          <div className="space-y-4">
            {section.fields.map(({ key, label, inputType, textarea }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
                {textarea ? (
                  <textarea
                    value={form[key] || ""}
                    onChange={e => update(key, e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <input
                    type={inputType || "text"}
                    value={form[key] || ""}
                    onChange={e => update(key, e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-3 bg-azure text-white rounded-xl font-semibold hover:bg-azure-dark transition-colors disabled:opacity-50"
        >
          {status === "saving" ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : <Save size={16} />}
          Enregistrer les paramètres
        </button>
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={16} /> Paramètres enregistrés
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} /> Erreur lors de l&apos;enregistrement
          </div>
        )}
      </div>
    </div>
  );
}
