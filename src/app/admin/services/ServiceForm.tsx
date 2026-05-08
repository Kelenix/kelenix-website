"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

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
  order: number;
  published: boolean;
};

const defaultData: ServiceData = {
  slug: "", titleFr: "", titleEn: "",
  shortDescFr: "", shortDescEn: "",
  longDescFr: "", longDescEn: "",
  icon: "", image: "", technologies: "", order: 0, published: true,
};

export default function ServiceForm({ service }: { service?: ServiceData }) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceData>(service ?? defaultData);
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
    const method = service?.id ? "PUT" : "POST";
    const url = service?.id ? `/api/admin/services/${service.id}` : "/api/admin/services";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Icône Lucide *</label>
          <input name="icon" value={form.icon} onChange={handleChange} required placeholder="Code, Globe, Monitor..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

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
          <label className="block text-sm font-semibold text-navy mb-2">Description courte FR *</label>
          <textarea name="shortDescFr" value={form.shortDescFr} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description courte EN *</label>
          <textarea name="shortDescEn" value={form.shortDescEn} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description longue FR *</label>
          <textarea name="longDescFr" value={form.longDescFr} onChange={handleChange} required rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description longue EN *</label>
          <textarea name="longDescEn" value={form.longDescEn} onChange={handleChange} required rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Image (URL)</label>
          <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Technologies (séparées par virgules)</label>
          <input name="technologies" value={form.technologies} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Ordre</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
        <label htmlFor="published" className="text-sm font-medium text-navy">Publié</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {service?.id ? "Mettre à jour" : "Créer le service"}
        </button>
        <button type="button" onClick={() => router.push("/admin/services")} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
