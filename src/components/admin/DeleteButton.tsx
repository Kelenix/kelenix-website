"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { btnSmallDanger } from "./styles";
import { COUNTS_EVENT } from "./useAdminNotifications";

// Bouton « Supprimer » de l'admin, avec confirmation. Dans une liste, la page se rafraîchit sur place ;
// sur une fiche de détail, `redirectTo` ramène à la liste une fois l'élément supprimé.
export default function DeleteButton({ url, title, name, redirectTo }: { url: string; title: string; name: string; redirectTo?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    setFailed(false);
    const response = await fetch(url, { method: "DELETE" }).catch(() => null);
    setOpen(false);
    setLoading(false);
    if (!response?.ok) return setFailed(true);
    // Les pastilles du menu suivent aussitôt : un élément « nouveau » supprimé ne doit plus y compter.
    window.dispatchEvent(new Event(COUNTS_EVENT));
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  };

  return (
    <>
      <button onClick={() => setOpen(true)} disabled={loading} aria-label="Supprimer" className={btnSmallDanger}>
        <Trash2 size={13} />
        <span className="hidden sm:inline">Supprimer</span>
      </button>
      {failed && (
        <span role="alert" className="text-xs font-medium text-red-600">
          Suppression impossible
        </span>
      )}
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
