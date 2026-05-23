"use client";

import { useState, useRef } from "react";
import { Save, Loader2, Plus, Pencil, Trash2, X, Check, Upload } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Fields = Record<string, string>;

type TeamMember = {
  id: string; name: string; roleFr: string; roleEn: string;
  bioFr: string; bioEn: string; avatar: string | null; linkedin: string | null; order: number; published: boolean;
};
type TimelineItem = {
  id: string; year: string; titleFr: string; titleEn: string; descFr: string; descEn: string; order: number;
};
type WhyPoint = {
  id: string; icon: string; titleFr: string; titleEn: string; descFr: string; descEn: string; order: number; published: boolean;
};

const ICON_OPTIONS = [
  "Award", "Zap", "Shield", "Globe", "TrendingUp", "Heart",
  "Star", "Target", "Users", "Lightbulb", "Clock", "CheckCircle",
];

const generalSections = [
  { title: "Notre Histoire", fields: [
    { key: "about_story_fr", label: "Histoire (FR)", rows: 5 },
    { key: "about_story_en", label: "Histoire (EN)", rows: 5 },
  ]},
  { title: "Mission", fields: [
    { key: "about_mission_fr", label: "Mission (FR)", rows: 3 },
    { key: "about_mission_en", label: "Mission (EN)", rows: 3 },
  ]},
  { title: "Vision", fields: [
    { key: "about_vision_fr", label: "Vision (FR)", rows: 3 },
    { key: "about_vision_en", label: "Vision (EN)", rows: 3 },
  ]},
  { title: "Valeurs (une par ligne)", fields: [
    { key: "about_values_fr", label: "Valeurs (FR)", rows: 4 },
    { key: "about_values_en", label: "Valeurs (EN)", rows: 4 },
  ]},
];

function emptyMember(): Omit<TeamMember, "id"> {
  return { name: "", roleFr: "", roleEn: "", bioFr: "", bioEn: "", avatar: "", linkedin: "", order: 0, published: true };
}
function emptyTimeline(): Omit<TimelineItem, "id"> {
  return { year: "", titleFr: "", titleEn: "", descFr: "", descEn: "", order: 0 };
}
function emptyWhyPoint(): Omit<WhyPoint, "id"> {
  return { icon: "Award", titleFr: "", titleEn: "", descFr: "", descEn: "", order: 0, published: true };
}

// --- General Tab ---
function GeneralTab({ data }: { data: Fields }) {
  const [form, setForm] = useState<Fields>(data);
  const [loading, setLoading] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const handleSave = async (keys: string[], title: string) => {
    setLoading(true);
    const entries = keys.map(key => ({ key, value: form[key] || "" }));
    await fetch("/api/admin/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    setSavedSection(title);
    setLoading(false);
    setTimeout(() => setSavedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {generalSections.map(section => (
        <div key={section.title} className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="font-heading text-lg font-bold text-navy mb-6 pb-3 border-b border-gray-100">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-navy mb-2">{field.label}</label>
                <textarea
                  value={form[field.key] || ""}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  rows={field.rows}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSave(section.fields.map(f => f.key), section.title)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : savedSection === section.title ? <Check size={15} /> : <Save size={15} />}
            {savedSection === section.title ? "Sauvegardé" : "Sauvegarder"}
          </button>
        </div>
      ))}
    </div>
  );
}

// --- Team Tab ---
function TeamTab({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, "id">>(emptyMember());
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (m: TeamMember) => {
    setEditing(m.id);
    setForm({ name: m.name, roleFr: m.roleFr, roleEn: m.roleEn, bioFr: m.bioFr, bioEn: m.bioEn, avatar: m.avatar || "", linkedin: m.linkedin || "", order: m.order, published: m.published });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm(prev => ({ ...prev, avatar: data.url }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async () => {
    setLoading(true);
    if (editing === "new") {
      const res = await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const created = await res.json();
      setMembers(prev => [...prev, created]);
    } else {
      const res = await fetch(`/api/admin/team/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const updated = await res.json();
      setMembers(prev => prev.map(m => m.id === editing ? updated : m));
    }
    setEditing(null);
    setForm(emptyMember());
    setLoading(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    setMembers(prev => prev.filter(m => m.id !== id));
    setDeleteId(null);
  };

  const isNew = editing === "new";
  const showForm = editing !== null;

  return (
    <div className="space-y-4">
      {!showForm && (
        <button onClick={() => { setEditing("new"); setForm(emptyMember()); }} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors text-sm">
          <Plus size={15} /> Ajouter un membre
        </button>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="font-heading text-lg font-bold text-navy mb-6">{isNew ? "Nouveau membre" : "Modifier le membre"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Nom" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
            <Field label="Rôle (FR)" value={form.roleFr} onChange={v => setForm(p => ({ ...p, roleFr: v }))} />
            <Field label="Rôle (EN)" value={form.roleEn} onChange={v => setForm(p => ({ ...p, roleEn: v }))} />
            <Field label="LinkedIn (URL)" value={form.linkedin ?? ""} onChange={v => setForm(p => ({ ...p, linkedin: v }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <TextareaField label="Bio (FR)" value={form.bioFr} onChange={v => setForm(p => ({ ...p, bioFr: v }))} rows={3} />
            <TextareaField label="Bio (EN)" value={form.bioEn} onChange={v => setForm(p => ({ ...p, bioEn: v }))} rows={3} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-navy mb-2">Photo (URL ou upload)</label>
            <div className="flex gap-2">
              <input value={form.avatar ?? ""} onChange={e => setForm(p => ({ ...p, avatar: e.target.value }))} placeholder="https://..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            {form.avatar && <img src={form.avatar} alt="Avatar" className="mt-2 h-16 w-16 rounded-full object-cover border border-gray-200" />}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Field label="Ordre" value={String(form.order)} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} type="number" />
            <div className="flex items-end gap-3 pb-1">
              <input type="checkbox" id="pub-m" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="pub-m" className="text-sm font-medium text-navy">Publié</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60 text-sm">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Sauvegarder
            </button>
            <button onClick={() => { setEditing(null); setForm(emptyMember()); }} className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              <X size={15} /> Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {members.length === 0 ? (
          <p className="text-gray-400 text-sm p-8 text-center">Aucun membre. Ajoutez-en un ci-dessus.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-navy">Membre</th>
                <th className="px-6 py-3 text-left font-semibold text-navy hidden sm:table-cell">Rôle</th>
                <th className="px-6 py-3 text-center font-semibold text-navy">Ordre</th>
                <th className="px-6 py-3 text-right font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{m.name}</td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{m.roleFr}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{m.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(m)} className="p-2 text-gray-400 hover:text-sky rounded-lg hover:bg-sky/10 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteId(m.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Supprimer ce membre ?"
        message="Cette action est irréversible."
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// --- Timeline Tab ---
function TimelineTab({ initialItems }: { initialItems: TimelineItem[] }) {
  const [items, setItems] = useState<TimelineItem[]>(initialItems);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TimelineItem, "id">>(emptyTimeline());
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startEdit = (item: TimelineItem) => {
    setEditing(item.id);
    setForm({ year: item.year, titleFr: item.titleFr, titleEn: item.titleEn, descFr: item.descFr, descEn: item.descEn, order: item.order });
  };

  const save = async () => {
    setLoading(true);
    if (editing === "new") {
      const res = await fetch("/api/admin/timeline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const created = await res.json();
      setItems(prev => [...prev, created]);
    } else {
      const res = await fetch(`/api/admin/timeline/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const updated = await res.json();
      setItems(prev => prev.map(i => i.id === editing ? updated : i));
    }
    setEditing(null);
    setForm(emptyTimeline());
    setLoading(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {editing === null && (
        <button onClick={() => { setEditing("new"); setForm(emptyTimeline()); }} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors text-sm">
          <Plus size={15} /> Ajouter une étape
        </button>
      )}

      {editing !== null && (
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="font-heading text-lg font-bold text-navy mb-6">{editing === "new" ? "Nouvelle étape" : "Modifier l'étape"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Année" value={form.year} onChange={v => setForm(p => ({ ...p, year: v }))} />
            <Field label="Titre (FR)" value={form.titleFr} onChange={v => setForm(p => ({ ...p, titleFr: v }))} />
            <Field label="Titre (EN)" value={form.titleEn} onChange={v => setForm(p => ({ ...p, titleEn: v }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <TextareaField label="Description (FR)" value={form.descFr} onChange={v => setForm(p => ({ ...p, descFr: v }))} rows={3} />
            <TextareaField label="Description (EN)" value={form.descEn} onChange={v => setForm(p => ({ ...p, descEn: v }))} rows={3} />
          </div>
          <div className="mb-6 w-32">
            <Field label="Ordre" value={String(form.order)} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} type="number" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60 text-sm">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Sauvegarder
            </button>
            <button onClick={() => { setEditing(null); setForm(emptyTimeline()); }} className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              <X size={15} /> Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm p-8 text-center">Aucune étape. Ajoutez-en une ci-dessus.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-navy">Année</th>
                <th className="px-6 py-3 text-left font-semibold text-navy">Titre FR</th>
                <th className="px-6 py-3 text-center font-semibold text-navy">Ordre</th>
                <th className="px-6 py-3 text-right font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-sky">{item.year}</td>
                  <td className="px-6 py-4 text-navy">{item.titleFr}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{item.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 text-gray-400 hover:text-sky rounded-lg hover:bg-sky/10 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Supprimer cette étape ?"
        message="Cette action est irréversible."
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// --- WhyPoints Tab ---
function WhyTab({ initialPoints }: { initialPoints: WhyPoint[] }) {
  const [points, setPoints] = useState<WhyPoint[]>(initialPoints);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<WhyPoint, "id">>(emptyWhyPoint());
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startEdit = (p: WhyPoint) => {
    setEditing(p.id);
    setForm({ icon: p.icon, titleFr: p.titleFr, titleEn: p.titleEn, descFr: p.descFr, descEn: p.descEn, order: p.order, published: p.published });
  };

  const save = async () => {
    setLoading(true);
    if (editing === "new") {
      const res = await fetch("/api/admin/whypoints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const created = await res.json();
      setPoints(prev => [...prev, created]);
    } else {
      const res = await fetch(`/api/admin/whypoints/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const updated = await res.json();
      setPoints(prev => prev.map(p => p.id === editing ? updated : p));
    }
    setEditing(null);
    setForm(emptyWhyPoint());
    setLoading(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/whypoints/${id}`, { method: "DELETE" });
    setPoints(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {editing === null && (
        <button onClick={() => { setEditing("new"); setForm(emptyWhyPoint()); }} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors text-sm">
          <Plus size={15} /> Ajouter un argument
        </button>
      )}

      {editing !== null && (
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="font-heading text-lg font-bold text-navy mb-6">{editing === "new" ? "Nouvel argument" : "Modifier l'argument"}</h2>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-navy mb-2">Icône</label>
            <select value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky bg-white">
              {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Titre (FR)" value={form.titleFr} onChange={v => setForm(p => ({ ...p, titleFr: v }))} />
            <Field label="Titre (EN)" value={form.titleEn} onChange={v => setForm(p => ({ ...p, titleEn: v }))} />
            <TextareaField label="Description (FR)" value={form.descFr} onChange={v => setForm(p => ({ ...p, descFr: v }))} rows={3} />
            <TextareaField label="Description (EN)" value={form.descEn} onChange={v => setForm(p => ({ ...p, descEn: v }))} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Field label="Ordre" value={String(form.order)} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} type="number" />
            <div className="flex items-end gap-3 pb-1">
              <input type="checkbox" id="pub-w" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="pub-w" className="text-sm font-medium text-navy">Publié</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60 text-sm">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Sauvegarder
            </button>
            <button onClick={() => { setEditing(null); setForm(emptyWhyPoint()); }} className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              <X size={15} /> Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {points.length === 0 ? (
          <p className="text-gray-400 text-sm p-8 text-center">Aucun argument. Ajoutez-en un ci-dessus.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-navy">Icône</th>
                <th className="px-6 py-3 text-left font-semibold text-navy">Titre FR</th>
                <th className="px-6 py-3 text-center font-semibold text-navy">Ordre</th>
                <th className="px-6 py-3 text-right font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {points.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.icon}</td>
                  <td className="px-6 py-4 font-medium text-navy">{p.titleFr}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{p.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-sky rounded-lg hover:bg-sky/10 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Supprimer cet argument ?"
        message="Cette action est irréversible."
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// --- Shared field components ---
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
    </div>
  );
}
function TextareaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-2">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
    </div>
  );
}

// --- Root component ---
const TABS = ["Général", "Parcours", "Équipe", "Pourquoi nous"] as const;
type Tab = typeof TABS[number];

export default function AboutClient({
  data,
  teamMembers,
  timelineItems,
  whyPoints,
}: {
  data: Fields;
  teamMembers: TeamMember[];
  timelineItems: TimelineItem[];
  whyPoints: WhyPoint[];
}) {
  const [tab, setTab] = useState<Tab>("Général");

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-navy"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Général" && <GeneralTab data={data} />}
      {tab === "Parcours" && <TimelineTab initialItems={timelineItems} />}
      {tab === "Équipe" && <TeamTab initialMembers={teamMembers} />}
      {tab === "Pourquoi nous" && <WhyTab initialPoints={whyPoints} />}
    </div>
  );
}
