"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { COUNTS_EVENT } from "./useAdminNotifications";
import { STATUS_OPTIONS, input } from "./styles";

// État d'une candidature ou d'une demande de partenariat (nouveau, lu, en cours, traité, archivé).
export default function StatusSelect({ url, current }: { url: string; current: string }) {
  const [status, setStatus] = useState(current);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setStatus(next);
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    // Les pastilles du menu suivent aussitôt.
    window.dispatchEvent(new Event(COUNTS_EVENT));
    router.refresh();
  };

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted">
      État
      <select value={status} onChange={handleChange} className={cn(input, "w-auto py-2")}>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
