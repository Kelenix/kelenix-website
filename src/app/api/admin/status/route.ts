import { NextResponse } from "next/server";
import os from "os";
import { execSync } from "child_process";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tryExec(cmd: string, timeout = 3000): string | null {
  try {
    return execSync(cmd, { encoding: "utf8", timeout, stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

async function getDb() {
  const t0 = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, latencyMs: Date.now() - t0, error: null as string | null };
  } catch (e) {
    return { ok: false, latencyMs: null, error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

async function getCounts() {
  try {
    const [users, messagesTotal, messagesNew, quotesTotal, quotesNew, services, projects, blogPosts, testimonials, subscribers, faqs] =
      await Promise.all([
        prisma.user.count(),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { status: "NEW" } }),
        prisma.quoteRequest.count(),
        prisma.quoteRequest.count({ where: { status: "NEW" } }),
        prisma.service.count(),
        prisma.project.count(),
        prisma.blogPost.count(),
        prisma.testimonial.count(),
        prisma.newsletter.count({ where: { active: true } }),
        prisma.faq.count(),
      ]);
    return { users, messagesTotal, messagesNew, quotesTotal, quotesNew, services, projects, blogPosts, testimonials, subscribers, faqs };
  } catch {
    return null;
  }
}

function getSystem() {
  try {
    return {
      hostname: os.hostname(),
      platform: `${os.type()} ${os.release()}`,
      cpuCount: os.cpus().length,
      loadavg: os.loadavg(),
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
      osUptimeSec: os.uptime(),
    };
  } catch {
    return null;
  }
}

function getProcess() {
  const mem = process.memoryUsage();
  return {
    uptimeSec: process.uptime(),
    rss: mem.rss,
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    nodeVersion: process.version,
  };
}

function getDisk() {
  // Linux uniquement (df). Null ailleurs (ex: dev local Windows).
  const out = tryExec("df -k /");
  if (!out) return null;
  const lines = out.split("\n");
  const parts = lines[lines.length - 1].trim().split(/\s+/);
  // Filesystem 1K-blocks Used Available Use% Mounted
  const totalKb = Number(parts[1]);
  const usedKb = Number(parts[2]);
  const availableKb = Number(parts[3]);
  if (!Number.isFinite(totalKb) || totalKb === 0) return null;
  return { totalKb, usedKb, availableKb, usePct: Math.round((usedKb / totalKb) * 100) };
}

function getPm2() {
  const out = tryExec("pm2 jlist");
  if (!out) return null;
  try {
    const list = JSON.parse(out) as Array<{
      name: string;
      pm2_env?: { status?: string; restart_time?: number; pm_uptime?: number };
      monit?: { cpu?: number; memory?: number };
    }>;
    const proc = list.find((p) => p.name === "kelenix") ?? list[0];
    if (!proc) return null;
    return {
      name: proc.name,
      status: proc.pm2_env?.status ?? "unknown",
      restarts: proc.pm2_env?.restart_time ?? 0,
      uptimeMs: proc.pm2_env?.pm_uptime ? Date.now() - proc.pm2_env.pm_uptime : 0,
      cpu: proc.monit?.cpu ?? 0,
      memory: proc.monit?.memory ?? 0,
    };
  } catch {
    return null;
  }
}

function getDeploy() {
  const commit = tryExec("git rev-parse --short HEAD");
  if (!commit) return null;
  return {
    commit,
    date: tryExec("git log -1 --format=%cI") ?? "",
    branch: tryExec("git rev-parse --abbrev-ref HEAD") ?? "",
    message: tryExec("git log -1 --format=%s") ?? "",
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [db, counts] = await Promise.all([getDb(), getCounts()]);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    db,
    counts,
    system: getSystem(),
    process: getProcess(),
    disk: getDisk(),
    pm2: getPm2(),
    deploy: getDeploy(),
  });
}
