"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Code, Briefcase, BookOpen, Star, Mail, Newspaper, Settings, LogOut, Menu, X,
  Users, Handshake, Info, Smartphone, HelpCircle, Activity, Bell, BellOff, BellRing, ExternalLink,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, MOTION, EASE } from "@/lib/gsap";
import { useAdminCounts, usePushNotifications, type AdminCounts } from "./useAdminNotifications";

type Item = {
  href: string;
  label: string;
  /** Libellé court pour le téléphone. */
  short?: string;
  icon: LucideIcon;
  /** Nombre d'éléments encore « nouveaux » dans cette rubrique. */
  count?: (counts: AdminCounts) => number;
  /** Adresse à ouvrir quand il y a du nouveau (l'onglet concerné, plutôt que l'accueil de la rubrique). */
  hrefWhenNew?: string;
};

const dashboard: Item = { href: "/admin", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard };
const messages: Item = { href: "/admin/messages", label: "Messages et devis", short: "Messages", icon: Mail, count: (c) => c.messages + c.quotes };
const careers: Item = { href: "/admin/careers", label: "Carrières", icon: Users, count: (c) => c.applications, hrefWhenNew: "/admin/careers?tab=applications" };
const partners: Item = { href: "/admin/partners", label: "Partenaires", icon: Handshake, count: (c) => c.partners };

const groups: { title?: string; items: Item[] }[] = [
  { items: [dashboard] },
  { title: "Demandes", items: [messages, careers, partners, { href: "/admin/newsletter", label: "Newsletter", icon: Newspaper }] },
  {
    title: "Contenu du site",
    items: [
      { href: "/admin/services", label: "Services", icon: Code },
      { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/testimonials", label: "Témoignages", icon: Star },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/about", label: "À propos", icon: Info },
      { href: "/admin/apps", label: "Apps mobiles", icon: Smartphone },
    ],
  },
  {
    title: "Réglages",
    items: [
      { href: "/admin/settings", label: "Paramètres", icon: Settings },
      { href: "/admin/status", label: "État du système", short: "État", icon: Activity },
    ],
  },
];

// Barre du bas sur téléphone : ce qu'on consulte dix fois par jour. Le reste est dans « Menu ».
const tabs: Item[] = [dashboard, messages, careers, partners];

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
  MODERATOR: "Modérateur",
};

// Explication affichée quand cet appareil ne peut pas (encore) recevoir de notifications.
const pushHelp: Record<string, string> = {
  install: "Sur iPhone : touchez Partager, puis « Sur l'écran d'accueil », et ouvrez l'admin depuis cette icône pour activer les notifications.",
  unsupported: "Ce navigateur ne gère pas les notifications push.",
  unconfigured: "Notifications push non configurées sur le serveur.",
  denied: "Notifications bloquées : autorisez-les pour ce site dans les réglages du navigateur.",
};

type SessionUser = { name?: string | null; email?: string | null; role?: string };
type Push = ReturnType<typeof usePushNotifications>;

const isActive = (pathname: string, href: string) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
const countOf = (item: Item, counts: AdminCounts | null) => (counts && item.count ? item.count(counts) : 0);
const hrefOf = (item: Item, badge: number) => (badge > 0 && item.hrefWhenNew ? item.hrefWhenNew : item.href);
const plural = (n: number) => `${n} nouveau${n > 1 ? "x" : ""}`;

function Badge({ n, className }: { n: number; className?: string }) {
  if (n <= 0) return null;
  return (
    <span aria-label={plural(n)} className={cn("flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-navy", className)}>
      {n > 99 ? "99+" : n}
    </span>
  );
}

// Notifications push sur cet appareil.
function PushPanel({ push }: { push: Push }) {
  return (
    <div>
      {push.state === "off" && (
        <button
          onClick={push.enable}
          disabled={push.busy}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-azure px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azure-dark disabled:opacity-60"
        >
          <Bell size={16} />
          Activer les notifications
        </button>
      )}
      {push.state === "on" && (
        <div className="rounded-xl bg-mist px-3.5 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-navy">
            <BellRing size={16} className="text-emerald-600" />
            Notifications activées
          </p>
          <div className="mt-1.5 flex gap-4 pl-6 text-xs font-medium">
            <button onClick={push.test} disabled={push.busy} className="cursor-pointer text-azure transition-colors hover:text-azure-dark disabled:opacity-60">
              Tester
            </button>
            <button onClick={push.disable} disabled={push.busy} className="cursor-pointer text-muted transition-colors hover:text-navy disabled:opacity-60">
              Désactiver
            </button>
          </div>
        </div>
      )}
      {pushHelp[push.state] && (
        <p className="flex gap-2 rounded-xl bg-mist px-3.5 py-3 text-xs leading-relaxed text-muted">
          <BellOff size={15} className="mt-0.5 shrink-0" />
          {pushHelp[push.state]}
        </p>
      )}
      {push.feedback && (
        <p role="status" className="px-1 pt-2 text-xs text-muted">
          {push.feedback}
        </p>
      )}
    </div>
  );
}

function Shell({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  const counts = useAdminCounts(pathname);
  const push = usePushNotifications();
  const [user, setUser] = useState<SessionUser | null>(null);
  // Le menu du téléphone est lié à la page où il a été ouvert : il se referme tout seul en changeant de page.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((session) => {
        if (!cancelled && session?.user) setUser(session.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!menuOpen || !sheet.current || !window.matchMedia(MOTION).matches) return;
      gsap.from(sheet.current, { yPercent: 5, opacity: 0, duration: 0.3, ease: EASE });
      gsap.from(sheet.current.querySelectorAll("[data-menu-item]"), { y: 14, opacity: 0, duration: 0.35, ease: EASE, stagger: 0.02, delay: 0.05 });
    },
    { dependencies: [menuOpen] }
  );

  const name = user?.name || "Administrateur";
  const role = (user?.role && roleLabels[user.role]) || user?.email || "Kelenix Tech";
  const logout = () => signOut({ callbackUrl: "/admin/login" });

  const account = (
    <div className="flex items-center gap-3 px-1">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">{name[0]?.toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">{name}</p>
        <p className="truncate text-xs text-muted">{role}</p>
      </div>
      <Link href="/" target="_blank" aria-label="Voir le site" title="Voir le site" className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-navy">
        <ExternalLink size={16} />
      </Link>
      <button onClick={logout} aria-label="Déconnexion" title="Déconnexion" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600">
        <LogOut size={16} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist lg:pl-[264px]">
      {/* Ordinateur : menu fixe à gauche */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
          <Link href="/admin" aria-label="Tableau de bord">
            <Logo tone="light" size="text-[1.3rem]" />
          </Link>
          <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">Admin</span>
        </div>

        <nav aria-label="Rubriques" className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
          {groups.map((group, i) => (
            <div key={group.title ?? i} className={i > 0 ? "mt-5" : undefined}>
              {group.title && <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted/80">{group.title}</p>}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const badge = countOf(item, counts);
                  return (
                    <li key={item.href}>
                      <Link
                        href={hrefOf(item, badge)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                          active ? "bg-azure/[0.08] font-semibold text-azure" : "font-medium text-navy/75 hover:bg-mist hover:text-navy"
                        )}
                      >
                        <item.icon size={18} className={active ? undefined : "text-muted transition-colors group-hover:text-navy"} />
                        {item.label}
                        <Badge n={badge} className="ml-auto" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-line p-3">
          <PushPanel push={push} />
          {account}
        </div>
      </aside>

      {/* Téléphone : barre du haut */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" aria-label="Tableau de bord">
          <Logo tone="light" size="text-lg" />
        </Link>
        <Link href="/" target="_blank" className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy">
          Voir le site <ExternalLink size={13} />
        </Link>
      </header>

      <main className="overflow-x-clip px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-10">{children}</main>

      {/* Téléphone : barre du bas */}
      <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {tabs.map((item) => {
            const active = !menuOpen && isActive(pathname, item.href);
            const badge = countOf(item, counts);
            return (
              <li key={item.href}>
                <Link
                  href={hrefOf(item, badge)}
                  aria-current={active ? "page" : undefined}
                  className={cn("flex flex-col items-center gap-1 pb-2 pt-2.5 text-[10.5px] font-medium", active ? "text-azure" : "text-muted")}
                >
                  <span className="relative">
                    <item.icon size={21} />
                    <Badge n={badge} className="absolute -right-3 -top-2 h-[18px] min-w-[18px] px-1 text-[10px] ring-2 ring-white" />
                  </span>
                  {item.short ?? item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setOpenOn(menuOpen ? null : pathname)}
              aria-expanded={menuOpen}
              className={cn("flex w-full cursor-pointer flex-col items-center gap-1 pb-2 pt-2.5 text-[10.5px] font-medium", menuOpen ? "text-azure" : "text-muted")}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
              Menu
            </button>
          </li>
        </ul>
      </nav>

      {/* Téléphone : toutes les rubriques, en plein écran */}
      {menuOpen && (
        <div ref={sheet} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-0 z-[35] flex flex-col bg-white pb-[calc(env(safe-area-inset-bottom)+60px)] lg:hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
            <Logo tone="light" size="text-lg" />
            <button onClick={() => setOpenOn(null)} aria-label="Fermer le menu" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-mist text-navy">
              <X size={19} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
            {groups.slice(1).map((group) => (
              <div key={group.title} className="mb-6">
                <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{group.title}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    const badge = countOf(item, counts);
                    return (
                      <li key={item.href} data-menu-item>
                        <Link
                          href={hrefOf(item, badge)}
                          onClick={() => setOpenOn(null)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-2xl border px-3 py-3 text-sm font-medium",
                            active ? "border-azure/30 bg-azure/[0.06] text-azure" : "border-line text-navy"
                          )}
                        >
                          <item.icon size={18} className={active ? undefined : "text-muted"} />
                          <span className="truncate">{item.short ?? item.label}</span>
                          <Badge n={badge} className="ml-auto" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="space-y-4 border-t border-line pt-5" data-menu-item>
              <PushPanel push={push} />
              {account}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Coque commune à tout l'admin (menu, barres du téléphone). La page de connexion s'affiche seule.
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <Shell pathname={pathname}>{children}</Shell>;
}
