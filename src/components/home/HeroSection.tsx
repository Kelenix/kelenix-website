import { getTranslations } from "next-intl/server";
import {
  ArrowRight, BarChart3, Bell, Check, ChevronRight, FileText, Home, LayoutDashboard, Lock, Plus, Rocket, ShoppingBag, Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Magnetic from "@/components/motion/Magnetic";
import HeroMotion from "@/components/home/HeroMotion";

type Kpi = { label: string; value: string; delta: string };
type Order = { name: string; amount: string; status: string };

const navIcons = [LayoutDashboard, ShoppingBag, Users, FileText, BarChart3];
const avatarTints = ["bg-sky/15 text-azure", "bg-gold/25 text-[#8a6100]", "bg-emerald-100 text-emerald-700", "bg-indigo-100 text-indigo-700"];

// Courbe des ventes : segments de Bézier à tangentes horizontales, calculés une fois côté serveur.
const CHART = [112, 100, 104, 84, 90, 66, 72, 48, 54, 30, 20];
const STEP = 400 / (CHART.length - 1);
const LINE = CHART.reduce((d, y, i) => {
  if (i === 0) return `M0,${y}`;
  const x = i * STEP;
  const mid = x - STEP / 2;
  return `${d} C${mid},${CHART[i - 1]} ${mid},${y} ${x},${y}`;
}, "");
const WEEK = [38, 56, 44, 70, 52, 86, 100];

/* ---------- Maquette : l'application de gestion d'un client, web et mobile ----------
   Le JSX décrit l'état final ; HeroMotion l'anime (montée, tracé de la courbe, étapes). */
async function HeroMock() {
  const t = await getTranslations("home.hero.mock");
  const nav = t.raw("nav") as string[];
  const kpis = t.raw("kpis") as Kpi[];
  const orders = t.raw("orders") as Order[];
  const steps = t.raw("steps") as string[];

  return (
    <div role="img" aria-label={t("aria")} className="relative mx-auto h-full max-w-6xl px-4 sm:px-6">
      <div data-hero data-mock aria-hidden="true" className="relative">
        <div data-mock-tilt className="relative">
          {/* Cadre de verre puis fenêtre de navigateur */}
          <div className="rounded-t-[1.35rem] border border-b-0 border-white/80 bg-white/55 p-1.5 shadow-[0_-18px_70px_-30px_rgba(15,111,230,0.55)] sm:rounded-t-[1.75rem] sm:p-2">
            <div className="overflow-hidden rounded-t-2xl border border-b-0 border-line bg-white sm:rounded-t-[1.35rem]">
              <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6159]" />
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="mx-auto flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-[11px] text-muted">
                  <Lock size={10} className="text-emerald-600" />
                  {t("url")}
                </span>
                <span className="w-10" />
              </div>

              <div className="grid text-left md:grid-cols-[11rem_1fr]">
                {/* Barre latérale */}
                <div className="hidden border-r border-line bg-mist/60 p-3 md:block">
                  <div className="mb-4 flex items-center gap-2 px-2 py-1.5">
                    <span className="h-6 w-6 rounded-lg bg-linear-to-br from-sky to-azure" />
                    <span className="truncate text-xs font-semibold text-navy">{t("workspace")}</span>
                  </div>
                  <ul data-mock-nav className="flex flex-col gap-0.5">
                    {nav.map((label, i) => {
                      const Icon = navIcons[i];
                      return (
                        <li
                          key={label}
                          className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium ${i === 0 ? "bg-white text-navy shadow-sm" : "text-muted"}`}
                        >
                          <Icon size={14} className={i === 0 ? "text-azure" : ""} />
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Contenu */}
                <div className="p-3.5 sm:p-5">
                  <div className="mb-3.5 flex items-center gap-2 sm:mb-4">
                    <p className="text-sm font-semibold text-navy sm:text-base">{t("title")}</p>
                    <span className="ml-auto rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-muted">{t("period")}</span>
                    <span className="hidden items-center gap-1 rounded-full bg-azure px-3 py-1.5 text-[11px] font-semibold text-white sm:flex">
                      <Plus size={12} /> {t("action")}
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2.5 sm:mb-4 sm:grid-cols-3 sm:gap-3">
                    {kpis.map((kpi, i) => (
                      <div key={kpi.label} data-kpi className={`rounded-xl border border-line p-3 sm:p-3.5 ${i === 2 ? "hidden sm:block" : ""}`}>
                        <p className="mb-1 truncate text-[11px] text-muted">{kpi.label}</p>
                        <p className="flex items-baseline gap-2">
                          <span data-num className="text-base font-semibold tabular-nums text-navy sm:text-xl">
                            {kpi.value}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600">{kpi.delta}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1.55fr_1fr]">
                    <div className="rounded-xl border border-line p-3 sm:p-4">
                      <div className="mb-2 flex items-baseline justify-between">
                        <p className="text-xs font-semibold text-navy">{t("chartTitle")}</p>
                        <p className="text-[11px] text-muted">{t("chartLegend")}</p>
                      </div>
                      <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-28 w-full overflow-visible sm:h-40">
                        <defs>
                          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#2FA8FF" stopOpacity="0.28" />
                            <stop offset="1" stopColor="#2FA8FF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[35, 70, 105].map((y) => (
                          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#E2E9F2" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
                        ))}
                        <path data-chart-area d={`${LINE} L400,140 L0,140 Z`} fill="url(#hero-area)" />
                        <path
                          data-chart-line
                          d={LINE}
                          pathLength={1}
                          fill="none"
                          stroke="#0F6FE6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray="1"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>

                    <div className="hidden rounded-xl border border-line p-4 md:block">
                      <p className="mb-2.5 text-xs font-semibold text-navy">{t("ordersTitle")}</p>
                      <ul className="flex flex-col gap-2.5">
                        {orders.map((order, i) => (
                          <li key={order.name} data-order className="flex items-center gap-2.5">
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarTints[i % avatarTints.length]}`}>
                              {order.name.split(" ").map((w) => w[0]).join("")}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium text-navy">{order.name}</span>
                              <span className={`text-[10px] font-medium ${i === 2 ? "text-[#a16207]" : "text-emerald-600"}`}>{order.status}</span>
                            </span>
                            <span className="text-xs font-semibold tabular-nums text-navy">{order.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Les cinq étapes Kelenix, de gauche à droite */}
        <ol
          data-hero
          data-stepper
          className="absolute -top-5 left-4 hidden items-center gap-1 rounded-full border border-line bg-white py-1.5 pl-2 pr-3.5 shadow-[0_10px_30px_-12px_rgba(11,31,58,0.25)] md:flex lg:left-8"
        >
          {steps.map((label, i) => (
            <li key={label} data-step className="flex items-center gap-1.5 text-xs font-medium text-navy">
              {i > 0 && <span className="mx-1 h-px w-3 bg-line" />}
              <span data-step-dot className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-white ${i === steps.length - 1 ? "bg-emerald-500" : "bg-azure"}`}>
                <Check size={11} strokeWidth={3.5} />
              </span>
              <span data-step-label>{label}</span>
            </li>
          ))}
        </ol>

        {/* Notification de mise en ligne */}
        <div
          data-hero
          data-toast
          className="absolute -top-6 right-3 flex items-center gap-2.5 rounded-2xl border border-line bg-white py-2 pl-2 pr-4 text-left shadow-[0_14px_36px_-14px_rgba(11,31,58,0.3)] sm:right-8 lg:right-52"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600">
            <Rocket size={16} />
          </span>
          <span>
            <span className="block text-xs font-semibold leading-tight text-navy">{t("toastTitle")}</span>
            <span className="block text-[11px] leading-tight text-muted">{t("toastText")}</span>
          </span>
        </div>

        {/* La même application sur téléphone */}
        <div data-hero data-phone className="absolute -right-2 top-16 hidden w-[12.5rem] lg:block xl:-right-8">
          <div className="rounded-[2.1rem] bg-navy p-1.5 shadow-[0_30px_60px_-20px_rgba(11,31,58,0.45)]">
            <div className="overflow-hidden rounded-[1.75rem] bg-mist text-left">
              <div className="flex items-center justify-between px-4 pb-1 pt-2.5 text-[10px] font-semibold text-navy">
                <span>9:41</span>
                <span className="h-3.5 w-12 rounded-full bg-navy" />
                <Bell size={11} />
              </div>
              <div className="px-3 pb-3 pt-2">
                <p className="mb-2.5 text-sm font-semibold text-navy">{t("phoneHello")}</p>
                <div className="mb-3 rounded-2xl bg-linear-to-br from-azure to-sky p-3.5 text-white">
                  <p className="text-[10px] font-medium text-white/80">{t("phoneLabel")}</p>
                  <p className="mb-3 text-xl font-semibold tabular-nums">{t("phoneValue")}</p>
                  <div className="flex h-10 items-end gap-1.5">
                    {WEEK.map((h, i) => (
                      <span key={i} data-bar className={`flex-1 rounded-sm ${i === WEEK.length - 1 ? "bg-gold" : "bg-white/45"}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <p className="mb-2 text-[10px] font-semibold text-muted">{t("phoneList")}</p>
                <ul className="flex flex-col gap-1.5">
                  {orders.slice(0, 3).map((order, i) => (
                    <li key={order.name} className="flex items-center gap-2 rounded-xl bg-white p-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${avatarTints[i]}`}>
                        {order.name.split(" ").map((w) => w[0]).join("")}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-navy">{order.name}</span>
                      <span className="text-[11px] font-semibold tabular-nums text-navy">{order.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-around border-t border-line bg-white py-2.5 text-muted">
                <Home size={15} className="text-azure" />
                <ShoppingBag size={15} />
                <Users size={15} />
                <BarChart3 size={15} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <HeroMotion className="relative overflow-hidden bg-white">
      {/* Voile bleu très léger en haut de page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(47,168,255,0.10),transparent)]" />

      <div className="container relative mx-auto max-w-5xl px-5 pt-10 text-center sm:pt-14 lg:pt-20">
        <Link
          href="/devis"
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-3 pr-2.5 text-[13px] font-medium text-navy shadow-[0_1px_2px_rgba(11,31,58,0.05)] transition-colors hover:border-sky/60 sm:text-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {t("badge")}
          <ChevronRight size={14} className="text-muted transition-transform group-hover:translate-x-0.5" />
        </Link>

        <h1 className="mt-6 font-display text-[2.7rem] font-medium leading-[1.02] tracking-[-0.035em] text-navy sm:mt-7 sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
          <span className="block text-balance">{t("title1")}</span>
          <span className="block text-balance">{t("title2")}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-muted sm:mt-6 sm:text-xl">
          <strong className="rounded-md bg-sky/12 px-1 font-medium text-navy [box-decoration-break:clone]">{t("leadStrong")}</strong> {t("lead")}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-9 sm:flex-row sm:justify-center sm:gap-6">
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/devis"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-azure px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(15,111,230,0.7),inset_0_1px_0_rgba(255,255,255,0.28)] transition-colors hover:bg-azure-dark"
            >
              {t("cta1")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Link href="/portfolio" className="text-[15px] font-semibold text-navy underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-azure">
            {t("cta2")}
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">{t("note")}</p>
      </div>

      {/* Visuel : halo bleu en vague, puis la maquette qui monte du bas */}
      <div className="relative mt-14 h-[17.5rem] sm:mt-16 sm:h-[24rem] lg:h-[31rem]">
        <div data-hero aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div data-glow className="absolute -bottom-[55%] left-[-14%] h-[175%] w-[64%] bg-[radial-gradient(closest-side,rgba(15,111,230,0.9),rgba(47,168,255,0.5)_48%,rgba(47,168,255,0))]" />
          <div data-glow className="absolute -bottom-[62%] right-[-16%] h-[195%] w-[68%] bg-[radial-gradient(closest-side,rgba(47,168,255,0.95),rgba(47,168,255,0.5)_48%,rgba(47,168,255,0))]" />
          <div data-glow className="absolute -bottom-[30%] left-[36%] h-[90%] w-[30%] bg-[radial-gradient(closest-side,rgba(255,193,7,0.3),rgba(255,193,7,0))]" />
        </div>
        <HeroMock />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-white via-white/70 to-transparent" />
      </div>
    </HeroMotion>
  );
}
