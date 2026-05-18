"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function AppDeleteButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    await fetch(`/api/admin/apps/${id}`, { method: "DELETE" });
    setOpen(false);
    router.refresh();
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
      >
        <Trash2 size={13} /> Supprimer
      </button>
      <ConfirmDialog
        open={open}
        title="Supprimer cette application"
        message={`Voulez-vous vraiment supprimer "${name}" ? Cette action est irréversible.`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
