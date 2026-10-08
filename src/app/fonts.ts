import { Geist, Newsreader } from "next/font/google";

// Polices auto-hébergées par next/font : aucun appel à Google au chargement, pas de CSS bloquant.
// Les variables CSS sont reprises dans le @theme de globals.css.
export const sans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const display = Newsreader({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-newsreader",
});

export const fontVariables = `${sans.variable} ${display.variable}`;
