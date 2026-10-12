export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { agentConfigured } from "@/lib/agent/config";
import { DEFAULT_TENANT } from "@/lib/agent/tenants";
import ProspectsClient from "./ProspectsClient";

export default async function AdminProspectsPage() {
  await requireAuth("MODERATOR");
  const prospects = await prisma.prospect.findMany({ where: { tenant: DEFAULT_TENANT }, orderBy: { createdAt: "desc" } });
  return <ProspectsClient initial={prospects} configured={agentConfigured()} />;
}
