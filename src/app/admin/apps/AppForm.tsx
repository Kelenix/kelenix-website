"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type App = { id?: string; name: string; initial: string; color: string; category: string; order: number; published: boolean };

export default function AppForm({ app }: { app?: App }) {
  const router = useRouter();
  const [form, setForm] = useState<App>(app ?? { name: "", initial: "", color: "#3B82F6", category: "", order: 0, published: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof App, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(app?.id ? `/api/admin/apps/${app.id}` : "/api/admin/apps", {
      method: app?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: Number(form.order) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Erreur"); setSaving(false); return; }
    router.push("/admin/apps");
    router.refresh();
  };

  const field = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy transition placeholder:text-muted/60 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-5 sm:p-8 max-w-lg space-y-5">
      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Nom de l&apos;app</label>
        <input className={field} value={form.name} onChange={e => set("name", e.target.value)} required maxLength={50} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Initiale (1-2 car.)</label>
          <input className={field} value={form.initial} onChange={e => set("initial", e.target.value)} required maxLength={2} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Couleur</label>
          <div className="flex gap-2">
            <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
              className="w-12 h-10 rounded-lg border border-line cursor-pointer p-0.5" />
            <input className={field} value={form.color} onChange={e => set("color", e.target.value)} pattern="^#[0-9A-Fa-f]{6}$" />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Catégorie</label>
        <input className={field} value={form.category} onChange={e => set("category", e.target.value)} required maxLength={50} placeholder="ex: Santé, E-commerce…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Ordre</label>
          <input type="number" className={field} value={form.order} onChange={e => set("order", e.target.value)} min={0} max={9} />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)}
              className="w-4 h-4 accent-azure" />
            <span className="text-sm font-medium text-navy">Publié</span>
          </label>
        </div>
      </div>

      {/* Aperçu */}
      <div className="flex items-center gap-3 p-4 bg-navy rounded-xl">
        <div style={{ width: 36, height: 36, borderRadius: 8, background: form.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
          {form.initial || "?"}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{form.name || "Nom de l'app"}</p>
          <p className="text-muted text-xs">{form.category || "Catégorie"}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 py-3 bg-azure text-white font-bold rounded-xl hover:bg-azure-dark transition-colors disabled:opacity-60">
          {saving ? "Enregistrement…" : app?.id ? "Mettre à jour" : "Ajouter"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 bg-mist text-muted font-medium rounded-xl hover:bg-line transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
