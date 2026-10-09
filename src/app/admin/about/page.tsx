export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AboutClient from "./AboutClient";

export default async function AdminAboutPage() {
  await requireAuth("MODERATOR");

  const [settings, teamMembers, timelineItems, whyPoints] = await Promise.all([
    prisma.siteSettings.findMany({
      where: { key: { in: ["about_mission_fr", "about_mission_en", "about_vision_fr", "about_vision_en", "about_values_fr", "about_values_en", "about_story_fr", "about_story_en"] } },
    }),
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    prisma.aboutTimeline.findMany({ orderBy: { order: "asc" } }),
    prisma.whyPoint.findMany({ orderBy: { order: "asc" } }),
  ]);

  const data = Object.fromEntries(settings.map(s => [s.key, s.value]));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">Page À propos</h1>
        <p className="mt-1.5 text-sm text-muted">Gérez le contenu de la page À propos</p>
      </div>
      <AboutClient
        data={data}
        teamMembers={teamMembers}
        timelineItems={timelineItems}
        whyPoints={whyPoints}
      />
    </div>
  );
}
