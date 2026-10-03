"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity, Database, Server, Cpu, MemoryStick, HardDrive, GitCommit,
  RefreshCw, CheckCircle2, AlertTriangle, XCircle, Clock, Users,
} from "lucide-react";

type Health = {
  timestamp: string;
  db: { ok: boolean; latencyMs: number | null; error: string | null };
  counts: {
    users: number; messagesTotal: number; messagesNew: number; quotesTotal: number; quotesNew: number;
    services: number; projects: number; blogPosts: number; testimonials: number; subscribers: number; faqs: number;
  } | null;
  system: { hostname: string; platform: string; cpuCount: number; loadavg: number[]; totalMem: number; freeMem: number; osUptimeSec: number } | null;
  process: { uptimeSec: number; rss: number; heapUsed: number; heapTotal: number; nodeVersion: string };
  disk: { totalKb: number; usedKb: number; availableKb: number; usePct: number } | null;
  pm2: { name: string; status: string; restarts: number; uptimeMs: number; cpu: number; memory: number } | null;
  deploy: { commit: string; date: string; branch: string; message: string } | null;
};

const REFRESH_MS = 10000;

function fmtBytes(n: number): string {
  if (n <= 0) return "0 o";
  const u = ["o", "Ko", "Mo", "Go", "To"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${(n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
}
const fmtKb = (kb: number) => fmtBytes(kb * 1024);

function fmtDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "—";
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}j ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

type Tone = "ok" | "warn" | "bad";
const toneClasses: Record<Tone, string> = {
  ok: "text-emerald-600 bg-emerald-50",
  warn: "text-amber-600 bg-amber-50",
  bad: "text-red-600 bg-red-50",
};
const barColor: Record<Tone, string> = { ok: "#10B981", warn: "#F59E0B", bad: "#EF4444" };

const pctTone = (p: number): Tone => (p < 70 ? "ok" : p < 90 ? "warn" : "bad");
const latencyTone = (ms: number): Tone => (ms < 100 ? "ok" : ms < 500 ? "warn" : "bad");

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-sky" />
        <h2 className="font-heading font-bold text-navy text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Gauge({ label, pct, detail }: { label: string; pct: number; detail: string }) {
  const tone = pctTone(pct);
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-navy">{detail}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: barColor[tone] }} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-navy text-right">{value}</span>
    </div>
  );
}

export default function StatusClient() {
  const [data, setData] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [auto, setAuto] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Health;
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = () => { if (active) fetchData(); };
    const first = setTimeout(run, 0);
    const id = auto ? setInterval(run, REFRESH_MS) : null;
    return () => {
      active = false;
      clearTimeout(first);
      if (id) clearInterval(id);
    };
  }, [fetchData, auto]);

  if (loading) {
    return <div className="flex items-center gap-2 text-gray-400 text-sm py-20 justify-center"><RefreshCw size={16} className="animate-spin" /> Chargement de l&apos;état du système…</div>;
  }

  if (!data) {
    return <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">Impossible de charger l&apos;état : {error}</div>;
  }

  const { db, counts, system, process: proc, disk, pm2, deploy } = data;

  const memPct = system ? Math.round(((system.totalMem - system.freeMem) / system.totalMem) * 100) : 0;
  const loadRatio = system && system.cpuCount > 0 ? system.loadavg[0] / system.cpuCount : 0;
  const loadTone: Tone = loadRatio < 0.7 ? "ok" : loadRatio < 1 ? "warn" : "bad";

  // État global = pire des sous-systèmes.
  const pm2Ok = pm2 ? pm2.status === "online" : true;
  const overallBad = !db.ok || !pm2Ok || (disk ? disk.usePct >= 90 : false) || memPct >= 90;
  const overallWarn = (db.latencyMs !== null && db.latencyMs >= 500) || (disk ? disk.usePct >= 70 : false) || memPct >= 70 || loadTone !== "ok";
  const overall: Tone = overallBad ? "bad" : overallWarn ? "warn" : "ok";
  const OverallIcon = overall === "ok" ? CheckCircle2 : overall === "warn" ? AlertTriangle : XCircle;
  const overallText = overall === "ok" ? "Tous les systèmes sont opérationnels" : overall === "warn" ? "Fonctionnel — points à surveiller" : "Problème détecté — action requise";

  return (
    <div className="space-y-6">
      {/* Barre d'état globale + contrôles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-3 ${toneClasses[overall]}`}>
          <OverallIcon size={22} />
          <span className="font-semibold text-sm">{overallText}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-sky focus:ring-sky" />
            Auto (10s)
          </label>
          <span className="text-xs text-gray-400">
            {lastUpdated ? `Maj ${lastUpdated.toLocaleTimeString("fr-FR")}` : ""}
          </span>
          <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 bg-sky text-white rounded-xl text-xs font-semibold hover:bg-sky-dark transition-colors">
            <RefreshCw size={13} /> Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-2 text-xs">
          Dernière actualisation en échec ({error}) — données affichées potentiellement anciennes.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Base de données */}
        <Card title="Base de données" icon={Database}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${db.ok ? toneClasses.ok : toneClasses.bad}`}>
              <span className={`w-2 h-2 rounded-full ${db.ok ? "bg-emerald-500" : "bg-red-500"}`} />
              {db.ok ? "En ligne" : "Hors ligne"}
            </span>
          </div>
          {db.ok && db.latencyMs !== null ? (
            <Row label="Latence" value={<span className={`px-2 py-0.5 rounded-md text-xs ${toneClasses[latencyTone(db.latencyMs)]}`}>{db.latencyMs} ms</span>} />
          ) : (
            <p className="text-xs text-red-500 break-words">{db.error}</p>
          )}
        </Card>

        {/* Application (pm2) */}
        <Card title="Application (pm2)" icon={Activity}>
          {pm2 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${pm2.status === "online" ? toneClasses.ok : toneClasses.bad}`}>
                  <span className={`w-2 h-2 rounded-full ${pm2.status === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                  {pm2.status}
                </span>
              </div>
              <Row label="Uptime" value={fmtDuration(pm2.uptimeMs / 1000)} />
              <Row label="Redémarrages" value={pm2.restarts} />
              <Row label="CPU" value={`${pm2.cpu}%`} />
              <Row label="Mémoire" value={fmtBytes(pm2.memory)} />
            </>
          ) : (
            <p className="text-xs text-gray-400">Infos pm2 indisponibles (process local ou pm2 absent).</p>
          )}
        </Card>

        {/* Déploiement */}
        <Card title="Déploiement" icon={GitCommit}>
          {deploy ? (
            <>
              <Row label="Commit" value={<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{deploy.commit}</code>} />
              <Row label="Branche" value={deploy.branch} />
              <Row label="Date" value={deploy.date ? new Date(deploy.date).toLocaleString("fr-FR") : "—"} />
              {deploy.message && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{deploy.message}</p>}
            </>
          ) : (
            <p className="text-xs text-gray-400">Infos git indisponibles.</p>
          )}
        </Card>

        {/* CPU serveur */}
        <Card title="Serveur — Processeur" icon={Cpu}>
          {system ? (
            <>
              <Gauge label={`Charge (1 min) · ${system.cpuCount} cœurs`} pct={loadRatio * 100} detail={system.loadavg[0].toFixed(2)} />
              <Row label="Charge 5 / 15 min" value={`${system.loadavg[1].toFixed(2)} / ${system.loadavg[2].toFixed(2)}`} />
            </>
          ) : <p className="text-xs text-gray-400">Indisponible</p>}
        </Card>

        {/* Mémoire serveur */}
        <Card title="Serveur — Mémoire" icon={MemoryStick}>
          {system ? (
            <Gauge label="RAM utilisée" pct={memPct} detail={`${fmtBytes(system.totalMem - system.freeMem)} / ${fmtBytes(system.totalMem)} (${memPct}%)`} />
          ) : <p className="text-xs text-gray-400">Indisponible</p>}
        </Card>

        {/* Disque */}
        <Card title="Serveur — Disque" icon={HardDrive}>
          {disk ? (
            <Gauge label="Espace utilisé" pct={disk.usePct} detail={`${fmtKb(disk.usedKb)} / ${fmtKb(disk.totalKb)} (${disk.usePct}%)`} />
          ) : <p className="text-xs text-gray-400">Indisponible (dev local).</p>}
        </Card>

        {/* Système */}
        <Card title="Système" icon={Server}>
          {system ? (
            <>
              <Row label="Hôte" value={system.hostname} />
              <Row label="OS" value={<span className="text-xs">{system.platform}</span>} />
              <Row label="Uptime serveur" value={fmtDuration(system.osUptimeSec)} />
            </>
          ) : <p className="text-xs text-gray-400">Indisponible</p>}
        </Card>

        {/* Process Node */}
        <Card title="Process Node.js" icon={Clock}>
          <Row label="Uptime app" value={fmtDuration(proc.uptimeSec)} />
          <Row label="Mémoire (RSS)" value={fmtBytes(proc.rss)} />
          <Row label="Heap" value={`${fmtBytes(proc.heapUsed)} / ${fmtBytes(proc.heapTotal)}`} />
          <Row label="Node" value={proc.nodeVersion} />
        </Card>

        {/* Contenu & utilisateurs */}
        <Card title="Contenu & utilisateurs" icon={Users}>
          {counts ? (
            <>
              <Row label="Comptes admin" value={counts.users} />
              <Row label="Abonnés newsletter" value={counts.subscribers} />
              <Row label="Messages (nouveaux)" value={`${counts.messagesTotal} (${counts.messagesNew})`} />
              <Row label="Devis (nouveaux)" value={`${counts.quotesTotal} (${counts.quotesNew})`} />
              <Row label="Services / Projets" value={`${counts.services} / ${counts.projects}`} />
              <Row label="Articles / Témoignages" value={`${counts.blogPosts} / ${counts.testimonials}`} />
              <Row label="FAQ" value={counts.faqs} />
            </>
          ) : <p className="text-xs text-gray-400">Indisponible (base injoignable).</p>}
        </Card>
      </div>
    </div>
  );
}
