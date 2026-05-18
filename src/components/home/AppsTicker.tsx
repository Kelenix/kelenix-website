import { prisma } from "@/lib/prisma";
import AppsTickerClient from "./AppsTickerClient";

export default async function AppsTicker() {
  const apps = await prisma.mobileApp.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 10,
    select: { id: true, name: true, initial: true, color: true, category: true },
  });

  if (apps.length === 0) return null;

  return <AppsTickerClient apps={apps} />;
}
