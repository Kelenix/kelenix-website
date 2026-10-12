export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { STALE_CONVERSATION_DAYS, staleConversations } from "@/lib/agent/retention";
import PurgeButton from "@/components/admin/PurgeButton";
import { card, cardTitle } from "@/components/admin/styles";
import StatusClient from "./StatusClient";

export default async function AdminStatusPage() {
  await requireAuth("MODERATOR");

  // Conversations de l'assistant IA : elles s'accumulent à chaque visiteur qui écrit.
  const [conversations, stale] = await Promise.all([prisma.agentConversation.count(), prisma.agentConversation.count({ where: staleConversations() })]).catch(() => [0, 0]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">État du système</h1>
        <p className="mt-1.5 text-sm text-muted">Santé de l&apos;application, de la base de données et du serveur en temps réel</p>
      </div>
      <StatusClient />

      <div className={`${card} mt-5 flex flex-wrap items-center justify-between gap-4 p-5`}>
        <div className="min-w-0">
          <h2 className={cardTitle}>Conversations de l&apos;assistant</h2>
          <p className="mt-1 text-sm text-muted">
            {conversations} conversation{conversations > 1 ? "s" : ""} enregistrée{conversations > 1 ? "s" : ""}, dont {stale} sans demande de devis depuis plus de {STALE_CONVERSATION_DAYS} jours. Celles qui ont donné un devis sont
            conservées avec lui.
          </p>
        </div>
        <PurgeButton
          url="/api/admin/agent/conversations"
          count={stale}
          label="Supprimer les anciennes"
          message={stale > 1 ? `Les ${stale} conversations sans demande de devis de plus de ${STALE_CONVERSATION_DAYS} jours seront supprimées.` : "La conversation concernée sera supprimée."}
        />
      </div>
    </div>
  );
}
