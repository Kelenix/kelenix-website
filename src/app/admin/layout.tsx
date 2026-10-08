import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "Admin | Kelenix", template: "%s | Kelenix Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="font-body antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
