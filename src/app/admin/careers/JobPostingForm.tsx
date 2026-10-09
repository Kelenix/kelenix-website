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
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

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
          <label className="mb-1.5 block text-sm font-medium text-navy">Description FR *</label>
          <textarea name="descFr" value={form.descFr} onChange={handleChange} required rows={6} placeholder="Responsabilités, profil recherché..." className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Description EN *</label>
          <textarea name="descEn" value={form.descEn} onChange={handleChange} required rows={6} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Lieu *</label>
          <input name="location" value={form.location} onChange={handleChange} required className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Type de contrat *</label>
          <select name="contractType" value={form.contractType} onChange={handleChange} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10">
            {contractTypes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="h-4 w-4 rounded border-line accent-azure" />
        <label htmlFor="published" className="text-sm font-medium text-navy">Publier cette offre</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-azure px-5 py-2.5 text-white hover:bg-azure-dark">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {job?.id ? "Mettre à jour" : "Créer l'offre"}
        </button>
        <button type="button" onClick={() => router.push("/admin/careers")} className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border border-line bg-white px-5 py-2.5 text-navy hover:bg-mist">
          Annuler
        </button>
      </div>
    </form>
  );
}
