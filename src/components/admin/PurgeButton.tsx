"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { btnGhost } from "./styles";
import { COUNTS_EVENT } from "./useAdminNotifications";

// Suppression groupée (« Supprimer les archivés ») : vide d'un coup ce qui ne sert plus.
// Le bouton disparaît quand il n'y a rien à supprimer.
export default function PurgeButton({ url, count, label, message }: { url: string; count: number; label: string; message: string }) {
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
    window.dispatchEvent(new Event(COUNTS_EVENT));
    router.refresh();
  };

  if (count === 0 && !failed) return null;

  return (
    <>
      {count > 0 && (
        <button onClick={() => setOpen(true)} disabled={loading} className={cn(btnGhost, "text-red-600 hover:bg-red-50")}>
          <Trash2 size={15} /> {label} ({count})
        </button>
      )}
      {failed && (
        <span role="alert" className="text-xs font-medium text-red-600">
          Suppression impossible
        </span>
      )}
      <ConfirmDialog open={open} title={label} message={`${message} Cette action est irréversible.`} onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
    </>
  );
}
