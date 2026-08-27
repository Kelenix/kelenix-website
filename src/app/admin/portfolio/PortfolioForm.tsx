"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Upload, X } from "lucide-react";

type ProjectData = {
  id?: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  client: string;
  category: string;
  descFr: string;
  descEn: string;
  problemFr: string;
  problemEn: string;
  solutionFr: string;
  solutionEn: string;
  resultsFr: string;
  resultsEn: string;
  technologies: string;
  coverImage: string;
  link: string;
  featured: boolean;
  published: boolean;
};

const defaultData: ProjectData = {
  slug: "", titleFr: "", titleEn: "", client: "", category: "WEB",
  descFr: "", descEn: "", problemFr: "", problemEn: "",
  solutionFr: "", solutionEn: "", resultsFr: "", resultsEn: "",
  technologies: "", coverImage: "", link: "", featured: false, published: true,
};

const categories = ["WEB", "MOBILE", "SOFTWARE", "AI", "ECOMMERCE", "OTHER"];

export default function PortfolioForm({ project }: { project?: ProjectData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectData>(project ?? defaultData);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm(prev => ({ ...prev, coverImage: data.url }));
    } else {
      setError(data.error || "Erreur lors de l'upload");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = project?.id ? "PUT" : "POST";
    const url = project?.id ? `/api/admin/portfolio/${project.id}` : "/api/admin/portfolio";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/portfolio");
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
          <label className="block text-sm font-semibold text-navy mb-2">Catégorie *</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky bg-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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
          <label className="block text-sm font-semibold text-navy mb-2">Client *</label>
          <input name="client" value={form.client} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Lien (URL)</label>
          <input name="link" value={form.link} onChange={handleChange} placeholder="https://" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description FR *</label>
          <textarea name="descFr" value={form.descFr} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Description EN *</label>
          <textarea name="descEn" value={form.descEn} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Image de couverture *</label>
          <div className="flex gap-2">
            <input name="coverImage" value={form.coverImage} onChange={handleChange} required placeholder="https://... ou télécharger" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky min-w-0" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} title="Télécharger une image depuis le PC" className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60 flex-shrink-0">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            </button>
            {form.coverImage && (
              <button type="button" onClick={() => setForm(prev => ({ ...prev, coverImage: "" }))} title="Supprimer l'image" className="flex items-center px-2 py-2.5 border border-gray-200 rounded-xl text-sm text-red-400 hover:bg-red-50 flex-shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          {form.coverImage && (
            <img src={form.coverImage} alt="Aperçu" className="mt-2 h-16 w-full object-cover rounded-lg border border-gray-100" />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Technologies</label>
          <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="React, Node.js, MySQL..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
          <label htmlFor="featured" className="text-sm font-medium text-navy">À la une</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
          <label htmlFor="published" className="text-sm font-medium text-navy">Publié</label>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {project?.id ? "Mettre à jour" : "Créer le projet"}
        </button>
        <button type="button" onClick={() => router.push("/admin/portfolio")} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
