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
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Nom *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Entreprise *</label>
          <input name="company" value={form.company} onChange={handleChange} required className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Poste *</label>
          <input name="position" value={form.position} onChange={handleChange} required className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Photo (URL)</label>
          <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Témoignage FR *</label>
          <textarea name="textFr" value={form.textFr} onChange={handleChange} required rows={4} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Témoignage EN *</label>
          <textarea name="textEn" value={form.textEn} onChange={handleChange} required rows={4} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 resize-none" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Note</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, rating: n }))}
              className="focus:outline-none"
            >
              <Star size={24} className={n <= form.rating ? "text-gold fill-gold" : "text-muted/50 fill-gray-200"} />
            </button>
          ))}
          <span className="text-sm text-muted ml-2">{form.rating}/5</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="showOnHome" name="showOnHome" checked={form.showOnHome} onChange={handleChange} className="h-4 w-4 rounded border-line accent-azure" />
          <label htmlFor="showOnHome" className="text-sm font-medium text-navy">Afficher en page d&apos;accueil</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="h-4 w-4 rounded border-line accent-azure" />
          <label htmlFor="published" className="text-sm font-medium text-navy">Publié</label>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-azure px-5 py-2.5 text-white hover:bg-azure-dark">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {testimonial?.id ? "Mettre à jour" : "Créer le témoignage"}
        </button>
        <button type="button" onClick={() => router.push("/admin/testimonials")} className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border border-line bg-white px-5 py-2.5 text-navy hover:bg-mist">
          Annuler
        </button>
      </div>
    </form>
  );
}
