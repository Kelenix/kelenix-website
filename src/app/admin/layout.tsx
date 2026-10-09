import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/app/fonts";
import "@/app/globals.css";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Admin | Kelenix", template: "%s | Kelenix Admin" },
  robots: { index: false, follow: false },
  // L'admin peut être ajouté à l'écran d'accueil du téléphone : c'est nécessaire sur iPhone pour les notifications push.
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "Kelenix Admin", statusBarStyle: "default" },
  icons: { apple: "/icons/admin-192.png" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="bg-mist font-body text-navy antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
