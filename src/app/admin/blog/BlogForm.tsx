"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Save, Loader2, Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote } from "lucide-react";

type BlogData = {
  id?: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
  coverImage: string;
  authorName: string;
  category: string;
  tags: string;
  published: boolean;
};

const defaultData: BlogData = {
  slug: "", titleFr: "", titleEn: "",
  excerptFr: "", excerptEn: "",
  contentFr: "", contentEn: "",
  coverImage: "", authorName: "Équipe Kelenix",
  category: "DEVELOPMENT", tags: "", published: false,
};

const categories = ["DEVELOPMENT", "AI", "DIGITAL", "NEWS", "GUIDES"];

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      {[
        { action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), icon: Bold, title: "Gras" },
        { action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), icon: Italic, title: "Italique" },
        { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), icon: Heading2, title: "H2" },
        { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), icon: Heading3, title: "H3" },
        { action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), icon: List, title: "Liste" },
        { action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), icon: ListOrdered, title: "Liste numérotée" },
        { action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), icon: Quote, title: "Citation" },
      ].map(({ action, active, icon: Icon, title }) => (
        <button
          key={title}
          type="button"
          onClick={action}
          title={title}
          className={`p-1.5 rounded text-sm transition-colors ${active ? "bg-sky text-white" : "text-gray-600 hover:bg-gray-200"}`}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  );
}

export default function BlogForm({ post }: { post?: BlogData }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogData>(post ?? defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeLang, setActiveLang] = useState<"fr" | "en">("fr");

  const editorFr = useEditor({
    extensions: [StarterKit],
    content: form.contentFr,
    onUpdate: ({ editor }) => setForm(prev => ({ ...prev, contentFr: editor.getHTML() })),
  });

  const editorEn = useEditor({
    extensions: [StarterKit],
    content: form.contentEn,
    onUpdate: ({ editor }) => setForm(prev => ({ ...prev, contentEn: editor.getHTML() })),
  });

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
    const method = post?.id ? "PUT" : "POST";
    const url = post?.id ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/blog");
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
          <label className="block text-sm font-semibold text-navy mb-2">Extrait FR *</label>
          <textarea name="excerptFr" value={form.excerptFr} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Extrait EN *</label>
          <textarea name="excerptEn" value={form.excerptEn} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky resize-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-3">Contenu</label>
        <div className="flex gap-2 mb-3">
          <button type="button" onClick={() => setActiveLang("fr")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeLang === "fr" ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            🇫🇷 Français
          </button>
          <button type="button" onClick={() => setActiveLang("en")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeLang === "en" ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            🇬🇧 English
          </button>
        </div>
        <div className={`border border-gray-200 rounded-xl overflow-hidden ${activeLang === "fr" ? "block" : "hidden"}`}>
          <Toolbar editor={editorFr} />
          <EditorContent editor={editorFr} className="min-h-[300px] p-4 prose prose-sm max-w-none focus:outline-none" />
        </div>
        <div className={`border border-gray-200 rounded-xl overflow-hidden ${activeLang === "en" ? "block" : "hidden"}`}>
          <Toolbar editor={editorEn} />
          <EditorContent editor={editorEn} className="min-h-[300px] p-4 prose prose-sm max-w-none focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Image de couverture (URL)</label>
          <input name="coverImage" value={form.coverImage} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Auteur *</label>
          <input name="authorName" value={form.authorName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Tags (séparés par virgules)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
        <label htmlFor="published" className="text-sm font-medium text-navy">Publier immédiatement</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-sky text-white font-semibold rounded-xl hover:bg-navy transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {post?.id ? "Mettre à jour" : "Créer l'article"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
