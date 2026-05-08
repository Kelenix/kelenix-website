"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PortfolioDeleteButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;
    setLoading(true);
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
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
