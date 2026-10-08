/* eslint-disable react-hooks/static-components */
"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Code, Briefcase, BookOpen, Star, Mail,
  Newspaper, Settings, LogOut, Menu, X, Search,
  Users, Handshake, Info, Smartphone, HelpCircle, Activity, Bell, BellOff, BellRing
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminCounts, usePushNotifications } from "./useAdminNotifications";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/about", label: "À propos", icon: Info },
  { href: "/admin/services", label: "Services", icon: Code },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Témoignages", icon: Star },
  { href: "/admin/apps", label: "Apps mobiles", icon: Smartphone },
  { href: "/admin/careers", label: "Carrières", icon: Users },
  { href: "/admin/partners", label: "Partenaires", icon: Handshake },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
  { href: "/admin/status", label: "État du système", icon: Activity },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

// Explication affichée quand cet appareil ne peut pas (encore) recevoir de notifications.
const pushHelp: Record<string, string> = {
  install: "Sur iPhone : touchez Partager, puis « Sur l'écran d'accueil », et ouvrez l'admin depuis cette icône pour activer les notifications.",
  unsupported: "Ce navigateur ne gère pas les notifications push.",
  unconfigured: "Notifications push non configurées sur le serveur.",
  denied: "Notifications bloquées : autorisez-les pour ce site dans les réglages du navigateur.",
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const counts = useAdminCounts();
  const push = usePushNotifications();

  // Éléments encore « nouveaux » par rubrique du menu.
  const badges: Record<string, number> = counts
    ? {
        "/admin/messages": counts.messages + counts.quotes,
        "/admin/careers": counts.applications,
        "/admin/partners": counts.partners,
      }
    : {};
  const totalNew = Object.values(badges).reduce((sum, n) => sum + n, 0);

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo size="text-xl" />
        </Link>
        <p className="text-xs text-gray-400 mt-1">Administration</p>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            const badge = badges[href] ?? 0;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-sky text-white shadow-md"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {label}
                  {badge > 0 && (
                    <span
                      aria-label={`${badge} nouveau${badge > 1 ? "x" : ""}`}
                      className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-gold text-navy text-[11px] font-bold flex items-center justify-center"
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-white/10">
        {/* Notifications push sur cet appareil */}
        {push.state === "off" && (
          <button
            onClick={push.enable}
            disabled={push.busy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-2 rounded-xl text-sm font-semibold bg-sky text-white hover:bg-sky-dark transition-all disabled:opacity-60"
          >
            <Bell size={17} />
            Activer les notifications
          </button>
        )}
        {push.state === "on" && (
          <div className="px-4 py-3 mb-2 rounded-xl bg-white/5">
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <BellRing size={16} className="text-emerald-400" />
              Notifications activées
            </p>
            <div className="mt-1.5 flex gap-4 text-xs">
              <button onClick={push.test} disabled={push.busy} className="text-sky hover:text-white transition-colors disabled:opacity-60">
                Tester
              </button>
              <button onClick={push.disable} disabled={push.busy} className="text-gray-400 hover:text-white transition-colors disabled:opacity-60">
                Désactiver
              </button>
            </div>
          </div>
        )}
        {pushHelp[push.state] && (
          <p className="flex gap-2 px-4 py-3 mb-2 rounded-xl bg-white/5 text-xs leading-relaxed text-gray-400">
            <BellOff size={15} className="shrink-0 mt-0.5" />
            {pushHelp[push.state]}
          </p>
        )}
        {push.feedback && (
          <p role="status" className="px-4 pb-2 text-xs text-gray-300">
            {push.feedback}
          </p>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all mb-1"
        >
          <Search size={18} />
          Voir le site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={totalNew > 0 ? `Menu, ${totalNew} nouveau${totalNew > 1 ? "x" : ""}` : "Menu"}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        {/* Point d'alerte : il y a du nouveau, même menu fermé */}
        {totalNew > 0 && !mobileOpen && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gold border-2 border-navy" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-navy flex flex-col z-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy min-h-screen fixed left-0 top-0 h-full z-30">
        <NavContent />
      </aside>
    </>
  );
}
