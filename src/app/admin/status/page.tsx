export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import StatusClient from "./StatusClient";

export default async function AdminStatusPage() {
  await requireAuth("MODERATOR");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">État du système</h1>
        <p className="mt-1.5 text-sm text-muted">Santé de l&apos;application, de la base de données et du serveur en temps réel</p>
      </div>
      <StatusClient />
    </div>
  );
}
