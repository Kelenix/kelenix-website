"use client";

import { useEffect } from "react";
import { COUNTS_EVENT } from "./useAdminNotifications";

// Posé sur la fiche d'une candidature ou d'une demande encore « nouvelle » : l'ouvrir la marque comme lue,
// puis les pastilles du menu se mettent à jour. Fait côté navigateur pour qu'un simple préchargement
// de la page ne compte pas comme une lecture.
export default function MarkAsRead({ url }: { url: string }) {
  useEffect(() => {
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "READ" }),
    })
      .then(() => window.dispatchEvent(new Event(COUNTS_EVENT)))
      .catch(() => {});
  }, [url]);

  return null;
}
