"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { value: "NEW", label: "Nouveau" },
  { value: "READ", label: "Lu" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "TREATED", label: "Traité" },
  { value: "ARCHIVED", label: "Archivé" },
];

export default function PartnerStatusSelect({ id, current }: { id: string; current: string }) {
  const [status, setStatus] = useState(current);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await fetch(`/api/admin/partners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  };

  return (
    <select value={status} onChange={handleChange} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-sky">
      {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}
