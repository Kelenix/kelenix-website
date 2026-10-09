"use client";

import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = "Supprimer", onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div role="alertdialog" aria-modal="true" aria-label={title} className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-20px_rgba(11,31,58,0.4)]">
        {/* Close */}
        <button onClick={onCancel} aria-label="Fermer" className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-navy">
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>

        <h3 className="mb-2 font-display text-2xl font-medium tracking-[-0.02em] text-navy">{title}</h3>
        <p className="text-muted text-sm mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-full border border-line bg-white py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-mist"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
