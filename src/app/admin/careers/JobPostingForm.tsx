"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

type JobData = {
  id?: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  location: string;
  contractType: string;
  published: boolean;
};

const defaultData: JobData = {
  titleFr: "", titleEn: "",
  descFr: "", descEn: "",
  location: "Paris, France",
  contractType: "CDI",
  published: true,
};

const contractTypes = ["CDI", "CDD", "Stage", "Alternance", "Freelance", "Remote"];

export default function JobPostingForm({ job }: { job?: JobData }) {
  const router = useRouter();
  const [form, setForm] = useState<JobData>(job ?? defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = job?.id ? "PUT" : "POST";
    const url = job?.id ? `/api/admin/careers/${job.id}` : "/api/admin/careers";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/careers");
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
          <label className="block text-sm font-semibold text-navy mb-2">Titre FR *</label>
          <input name="titleFr" value={form.titleFr} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Titre EN *</label>
          <input name="titleEn" value={form.titleEn} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description FR *</label>
          <textarea name="descFr" value={form.descFr} onChange={handleChange} required rows={6} placeholder="Responsabilités, profil recherché..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description EN *</label>
          <textarea name="descEn" value={form.descEn} onChange={handleChange} required rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Lieu *</label>
          <input name="location" value={form.location} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Type de contrat *</label>
          <select name="contractType" value={form.contractType} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky bg-white">
            {contractTypes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
        <label htmlFor="published" className="text-sm font-medium text-navy">Publier cette offre</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {job?.id ? "Mettre à jour" : "Créer l'offre"}
        </button>
        <button type="button" onClick={() => router.push("/admin/careers")} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
