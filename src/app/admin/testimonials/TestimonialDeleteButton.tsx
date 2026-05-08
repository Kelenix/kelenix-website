"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestimonialDeleteButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer le témoignage de "${name}" ? Cette action est irréversible.`)) return;
    setLoading(true);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
    >
      <Trash2 size={13} /> Supprimer
    </button>
  );
}
