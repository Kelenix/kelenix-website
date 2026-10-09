export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import MessagesClient from "./MessagesClient";

type Props = { searchParams: Promise<{ tab?: string; open?: string }> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  await requireAuth("MODERATOR");
  const { tab, open } = await searchParams;

  const [messages, quotes] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Messages et devis" lead="Ouvrir un message le marque comme lu. Changez son état une fois la réponse envoyée." />
      {/* « open » vient d'un clic sur une notification : l'élément est déplié d'entrée. */}
      <MessagesClient key={`${tab}-${open}`} messages={messages} quotes={quotes} activeTab={tab === "devis" ? "devis" : "messages"} openId={open} />
    </div>
  );
}
