"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils";

type ServiceData = {
  id?: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  shortDescFr: string;
  shortDescEn: string;
  longDescFr: string;
  longDescEn: string;
  icon: string;
  image: string;
  technologies: string;
  faqFr?: string;
  faqEn?: string;
  order: number;
  published: boolean;
};

type FaqItem = { question: string; answer: string };
type Lang = "fr" | "en";

const defaultData: ServiceData = {
  slug: "", titleFr: "", titleEn: "",
  shortDescFr: "", shortDescEn: "",
  longDescFr: "", longDescEn: "",
  icon: "", image: "", technologies: "", faqFr: "[]", faqEn: "[]", order: 0, published: true,
};

// Tolère les deux formats stockés : { question, answer } et l'ancien { q, a }.
function parseFaq(raw?: string): FaqItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      question: String(item.question ?? item.q ?? ""),
      answer: String(item.answer ?? item.a ?? ""),
    }));
  } catch {
    return [];
  }
}

export default function ServiceForm({ service }: { service?: ServiceData }) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceData>(service ?? defaultData);
  const [faqFr, setFaqFr] = useState<FaqItem[]>(parseFaq(service?.faqFr));
  const [faqEn, setFaqEn] = useState<FaqItem[]>(parseFaq(service?.faqEn));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
  };

  const faqState: Record<Lang, [FaqItem[], React.Dispatch<React.SetStateAction<FaqItem[]>>]> = {
    fr: [faqFr, setFaqFr],
    en: [faqEn, setFaqEn],
  };

  const addFaq = (lang: Lang) =>
    faqState[lang][1](prev => [...prev, { question: "", answer: "" }]);

  const removeFaq = (lang: Lang, index: number) =>
    faqState[lang][1](prev => prev.filter((_, i) => i !== index));

  const updateFaq = (lang: Lang, index: number, field: keyof FaqItem, value: string) =>
    faqState[lang][1](prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = service?.id ? "PUT" : "POST";
    const url = service?.id ? `/api/admin/services/${service.id}` : "/api/admin/services";
    const cleanFaq = (items: FaqItem[]) =>
      items.filter((item) => item.question.trim() !== "" || item.answer.trim() !== "");
    const payload = {
      ...form,
      faqFr: JSON.stringify(cleanFaq(faqFr)),
      faqEn: JSON.stringify(cleanFaq(faqEn)),
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/admin/services");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error || "Une erreur est survenue.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} onBlur={() => setForm(prev => ({ ...prev, slug: slugify(prev.slug) }))} required placeholder="mon-slug" className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Icône Lucide *</label>
          <input name="icon" value={form.icon} onChange={handleChange} required placeholder="Code, Globe, Monitor..." className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Titre FR *</label>
          <input name="titleFr" value={form.titleFr} onChange={handleChange} required className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Titre EN *</label>
          <input name="titleEn" value={form.titleEn} onChange={handleChange} required className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Description courte FR *</label>
          <textarea name="shortDescFr" value={form.shortDescFr} onChange={handleChange} required rows={3} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Description courte EN *</label>
          <textarea name="shortDescEn" value={form.shortDescEn} onChange={handleChange} required rows={3} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Description longue FR *</label>
          <textarea name="longDescFr" value={form.longDescFr} onChange={handleChange} required rows={6} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Description longue EN *</label>
          <textarea name="longDescEn" value={form.longDescEn} onChange={handleChange} required rows={6} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Image (URL)</label>
          <input name="image" value={form.image} onChange={handleChange} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Technologies (séparées par virgules)</label>
          <input name="technologies" value={form.technologies} onChange={handleChange} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Ordre</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
      </div>

      <div className="border-t border-line pt-6">
        <h3 className="font-heading text-lg font-bold text-navy mb-1">Questions fréquentes (FAQ)</h3>
        <p className="text-sm text-muted mb-4">Affichées sur la page publique du service. Renseignez chaque question dans les deux langues.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(["fr", "en"] as Lang[]).map((lang) => {
            const items = faqState[lang][0];
            return (
              <div key={lang} className="bg-mist rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-navy uppercase">{lang === "fr" ? "Français" : "English"}</span>
                  <button
                    type="button"
                    onClick={() => addFaq(lang)}
                    className="flex items-center gap-1 text-sm font-medium text-azure hover:text-navy transition-colors"
                  >
                    <Plus size={14} /> Ajouter
                  </button>
                </div>

                {items.length === 0 && (
                  <p className="text-sm text-muted italic py-2">Aucune question pour le moment.</p>
                )}

                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="bg-white border border-line rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted">Question {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeFaq(lang, i)}
                          className="text-muted hover:text-red-500 transition-colors"
                          aria-label="Supprimer la question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        value={item.question}
                        onChange={(e) => updateFaq(lang, i, "question", e.target.value)}
                        placeholder={lang === "fr" ? "Question" : "Question"}
                        className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:outline-none focus:border-azure"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateFaq(lang, i, "answer", e.target.value)}
                        rows={3}
                        placeholder={lang === "fr" ? "Réponse" : "Answer"}
                        className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:outline-none focus:border-azure resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="h-4 w-4 rounded border-line accent-azure" />
        <label htmlFor="published" className="text-sm font-medium text-navy">Publié</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-azure px-5 py-2.5 text-white hover:bg-azure-dark">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {service?.id ? "Mettre à jour" : "Créer le service"}
        </button>
        <button type="button" onClick={() => router.push("/admin/services")} className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border border-line bg-white px-5 py-2.5 text-navy hover:bg-mist">
          Annuler
        </button>
      </div>
    </form>
  );
}
