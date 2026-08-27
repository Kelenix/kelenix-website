"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

type FaqData = {
  id?: string;
  category: string;
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
  order: number;
  published: boolean;
};

const categories: { value: string; label: string }[] = [
  { value: "services", label: "Services" },
  { value: "pricing", label: "Tarification" },
  { value: "process", label: "Process" },
  { value: "delays", label: "Délais" },
  { value: "support", label: "Support" },
];

const defaultData: FaqData = {
  category: "services",
  questionFr: "", questionEn: "",
  answerFr: "", answerEn: "",
  order: 0, published: true,
};

export default function FaqForm({ faq }: { faq?: FaqData }) {
  const router = useRouter();
  const [form, setForm] = useState<FaqData>(faq ?? defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = faq?.id ? "PUT" : "POST";
    const url = faq?.id ? `/api/admin/faq/${faq.id}` : "/api/admin/faq";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/faq");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error || "Une erreur est survenue.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Catégorie *</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky bg-white">
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Ordre</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Question FR *</label>
          <textarea name="questionFr" value={form.questionFr} onChange={handleChange} required rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Question EN *</label>
          <textarea name="questionEn" value={form.questionEn} onChange={handleChange} required rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Réponse FR *</label>
          <textarea name="answerFr" value={form.answerFr} onChange={handleChange} required rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Réponse EN *</label>
          <textarea name="answerEn" value={form.answerEn} onChange={handleChange} required rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
        <label htmlFor="published" className="text-sm font-medium text-navy">Publié</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {faq?.id ? "Mettre à jour" : "Créer la question"}
        </button>
        <button type="button" onClick={() => router.push("/admin/faq")} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
