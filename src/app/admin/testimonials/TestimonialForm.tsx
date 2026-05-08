"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Star } from "lucide-react";

type TestimonialData = {
  id?: string;
  name: string;
  company: string;
  position: string;
  photo: string;
  textFr: string;
  textEn: string;
  rating: number;
  showOnHome: boolean;
  published: boolean;
};

const defaultData: TestimonialData = {
  name: "", company: "", position: "", photo: "",
  textFr: "", textEn: "", rating: 5, showOnHome: false, published: true,
};

export default function TestimonialForm({ testimonial }: { testimonial?: TestimonialData }) {
  const router = useRouter();
  const [form, setForm] = useState<TestimonialData>(testimonial ?? defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const method = testimonial?.id ? "PUT" : "POST";
    const url = testimonial?.id ? `/api/admin/testimonials/${testimonial.id}` : "/api/admin/testimonials";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/testimonials");
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
          <label className="block text-sm font-semibold text-navy mb-2">Nom *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Entreprise *</label>
          <input name="company" value={form.company} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Poste *</label>
          <input name="position" value={form.position} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Photo (URL)</label>
          <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Témoignage FR *</label>
          <textarea name="textFr" value={form.textFr} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Témoignage EN *</label>
          <textarea name="textEn" value={form.textEn} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-2">Note</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, rating: n }))}
              className="focus:outline-none"
            >
              <Star size={24} className={n <= form.rating ? "text-gold fill-gold" : "text-gray-300 fill-gray-200"} />
            </button>
          ))}
          <span className="text-sm text-gray-500 ml-2">{form.rating}/5</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="showOnHome" name="showOnHome" checked={form.showOnHome} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
          <label htmlFor="showOnHome" className="text-sm font-medium text-navy">Afficher en page d&apos;accueil</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
          <label htmlFor="published" className="text-sm font-medium text-navy">Publié</label>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {testimonial?.id ? "Mettre à jour" : "Créer le témoignage"}
        </button>
        <button type="button" onClick={() => router.push("/admin/testimonials")} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
