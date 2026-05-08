"use client";
import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

type Fields = Record<string, string>;

const sections = [
  {
    title: "Notre Histoire",
    fields: [
      { key: "about_story_fr", label: "Histoire (FR)", textarea: true, rows: 5 },
      { key: "about_story_en", label: "Histoire (EN)", textarea: true, rows: 5 },
    ],
  },
  {
    title: "Mission",
    fields: [
      { key: "about_mission_fr", label: "Mission (FR)", textarea: true, rows: 3 },
      { key: "about_mission_en", label: "Mission (EN)", textarea: true, rows: 3 },
    ],
  },
  {
    title: "Vision",
    fields: [
      { key: "about_vision_fr", label: "Vision (FR)", textarea: true, rows: 3 },
      { key: "about_vision_en", label: "Vision (EN)", textarea: true, rows: 3 },
    ],
  },
  {
    title: "Valeurs (une par ligne)",
    fields: [
      { key: "about_values_fr", label: "Valeurs (FR)", textarea: true, rows: 4 },
      { key: "about_values_en", label: "Valeurs (EN)", textarea: true, rows: 4 },
    ],
  },
];

export default function AboutClient({ data }: { data: Fields }) {
  const [form, setForm] = useState<Fields>(data);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (keys: string[]) => {
    setLoading(true);
    const entries = keys.map(key => ({ key, value: form[key] || "" }));
    await fetch("/api/admin/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    setSaved(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.title} className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="font-heading text-lg font-bold text-navy mb-6 pb-3 border-b border-gray-100">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-navy mb-2">{field.label}</label>
                {field.textarea ? (
                  <textarea
                    value={form[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    rows={field.rows}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none"
                  />
                ) : (
                  <input
                    value={form[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSave(section.fields.map(f => f.key))}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saved ? "Sauvegardé ✓" : "Sauvegarder"}
          </button>
        </div>
      ))}
    </div>
  );
}
