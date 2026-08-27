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
      { key: "google_analytics_id", label: "Google Analytics ID (G-XXXXXXXX)" },
    ],
  },
  {
    title: "Statistiques — bandeau d'accueil (haut de page)",
    fields: [
      { key: "hero_stat1_value", label: "Projets livrés (ex: 150+)", defaultValue: "150+" },
      { key: "hero_stat2_value", label: "Clients satisfaits (ex: 80+)", defaultValue: "80+" },
      { key: "hero_stat3_value", label: "Années d'expérience (ex: 5+)", defaultValue: "5+" },
      { key: "hero_stat4_value", label: "Technologies maîtrisées (ex: 15+)", defaultValue: "15+" },
    ],
  },
  {
    title: "Statistiques — section « Nos Chiffres »",
    fields: [
      { key: "home_stat1_value", label: "Projets livrés (ex: 150+)", defaultValue: "150+" },
      { key: "home_stat2_value", label: "Clients satisfaits (ex: 80+)", defaultValue: "80+" },
      { key: "home_stat3_value", label: "Années d'expérience (ex: 5+)", defaultValue: "5+" },
      { key: "home_stat4_value", label: "Technologies maîtrisées (ex: 15+)", defaultValue: "15+" },
      { key: "home_stat5_value", label: "Taux de satisfaction (ex: 97%)", defaultValue: "97%" },
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

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/10 transition-all";

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.title} className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-navy text-lg mb-5">{section.title}</h2>
          <div className="space-y-4">
            {section.fields.map(({ key, label, inputType, textarea }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
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
          className="flex items-center gap-2 px-6 py-3 bg-sky text-white rounded-xl font-semibold hover:bg-sky-dark transition-colors disabled:opacity-50"
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
