"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { btnSmallDanger } from "./styles";

// Bouton « Supprimer » des listes de l'admin, avec confirmation.
export default function DeleteButton({ url, title, name }: { url: string; title: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    await fetch(url, { method: "DELETE" });
    setOpen(false);
    router.refresh();
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} disabled={loading} aria-label="Supprimer" className={btnSmallDanger}>
        <Trash2 size={13} />
        <span className="hidden sm:inline">Supprimer</span>
      </button>
      <ConfirmDialog
        open={open}
        title={title}
        message={`Voulez-vous vraiment supprimer "${name}" ? Cette action est irréversible.`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
