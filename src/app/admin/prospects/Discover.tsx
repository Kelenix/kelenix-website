"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryLanguage, placeLabel } from "@/lib/agent/countries";
import type { Discovery, DiscoveryEvent } from "@/lib/agent/discovery";
import { btnGhost, btnPrimary, btnSmall, card, input, label } from "@/components/admin/styles";
import { CountrySelect, LanguageSelect, host, type Language } from "./shared";

// Recherche d'entreprises : on choisit le pays, la ville et le type d'entreprise, l'agent cherche sur le web
// et propose une liste. Rien n'est ajouté tout seul : on coche celles que l'on veut prospecter.
export default function Discover({ onAdd, onClose }: { onAdd: (rows: unknown[]) => void; onClose: () => void }) {
  const [target, setTarget] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [requireEmail, setRequireEmail] = useState(false);
  const [requirePhone, setRequirePhone] = useState(false);
  const [count, setCount] = useState(5);
  const [language, setLanguage] = useState<Language>("fr");
  const [busy, setBusy] = useState(false);
  const [searches, setSearches] = useState<string[]>([]);
  const [result, setResult] = useState<Discovery | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  // Filtres des résultats déjà affichés (la recherche, elle, a pu ne rien exiger).
  const [withEmailOnly, setWithEmailOnly] = useState(false);
  const [withPhoneOnly, setWithPhoneOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Choisir un pays règle aussi la langue des e-mails ; elle reste modifiable.
  const chooseCountry = (code: string) => {
    setCountry(code);
    if (code) setLanguage(countryLanguage(code));
  };

  const search = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    setSearches([]);
    setWithEmailOnly(false);
    setWithPhoneOnly(false);
    try {
      const response = await fetch("/api/admin/prospects/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, country: country || null, city: city || null, requireEmail, requirePhone, count }),
      });
      if (!response.ok || !response.body) throw new Error((await response.json().catch(() => null))?.error ?? "Une erreur est survenue.");
      // Une ligne JSON par événement ; une ligne peut arriver en plusieurs morceaux.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line) continue;
          const event = JSON.parse(line) as DiscoveryEvent;
          if (event.type === "search") setSearches((current) => [...current, event.query]);
          else if (event.type === "error") setError(event.message);
          else if (event.type === "result") {
            setResult(event);
            setPicked(event.companies.map((company) => company.website));
          }
        }
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Une erreur est survenue.");
    }
    setBusy(false);
  };

  const toggle = (website: string) => setPicked((current) => (current.includes(website) ? current.filter((w) => w !== website) : [...current, website]));
  const shown = result?.companies.filter((company) => (!withEmailOnly || company.email) && (!withPhoneOnly || company.phone)) ?? [];
  const chosen = shown.filter((company) => picked.includes(company.website));
  const withoutEmail = result?.companies.filter((company) => !company.email).length ?? 0;
  const withoutPhone = result?.companies.filter((company) => !company.phone).length ?? 0;

  return (
    <div className={cn(card, "mb-5 space-y-4 p-4 sm:p-5")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="discover-country" className={label}>
            Pays
          </label>
          <CountrySelect id="discover-country" value={country} onChange={chooseCountry} empty="Tous les pays" />
        </div>
        <div>
          <label htmlFor="discover-city" className={label}>
            Ville ou région (facultatif)
          </label>
          <input id="discover-city" value={city} maxLength={100} onChange={(event) => setCity(event.target.value)} placeholder="Lyon, Turin, Douala…" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="discover-target" className={label}>
            Quelles entreprises cherchez-vous ?
          </label>
          <textarea
            id="discover-target"
            rows={2}
            maxLength={1000}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="Exemple : traiteurs et restaurants indépendants qui livrent les entreprises"
            className={cn(input, "resize-none")}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="discover-count" className={label}>
            Combien
          </label>
          <select id="discover-count" value={count} onChange={(event) => setCount(Number(event.target.value))} className={cn(input, "w-auto")}>
            {[5, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n} entreprises
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="discover-language" className={label}>
            Langue des e-mails
          </label>
          <LanguageSelect id="discover-language" value={language} onChange={(value) => setLanguage(value as Language)} className="w-auto" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 py-2.5 text-sm text-navy">
          <input type="checkbox" checked={requireEmail} onChange={(event) => setRequireEmail(event.target.checked)} className="h-4 w-4 accent-azure" />
          Seulement avec une adresse e-mail
        </label>
        <label className="flex cursor-pointer items-center gap-2 py-2.5 text-sm text-navy">
          <input type="checkbox" checked={requirePhone} onChange={(event) => setRequirePhone(event.target.checked)} className="h-4 w-4 accent-azure" />
          Seulement avec un téléphone
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={search} disabled={busy || target.trim().length < 3} className={btnPrimary}>
          <Search size={16} /> {busy ? "Recherche en cours…" : "Chercher"}
        </button>
        <button type="button" onClick={onClose} className={btnGhost}>
          Fermer
        </button>
        <span className="text-xs text-muted">L&apos;agent fait quelques recherches web : comptez 20 à 90 secondes.</span>
      </div>

      {busy && (
        <ul role="status" className="space-y-1 rounded-xl bg-azure/[0.06] px-4 py-3 text-sm text-navy">
          <li>L&apos;agent cherche sur le web…</li>
          {searches.map((query, i) => (
            <li key={i} className="text-muted">
              Recherche : {query}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {result && (
        <>
          {result.companies.length === 0 ? (
            <p className="rounded-xl bg-mist px-4 py-3 text-sm text-navy">Aucune entreprise retenue. Élargissez la zone, précisez l&apos;activité, ou retirez l&apos;exigence d&apos;e-mail ou de téléphone.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm font-semibold text-navy">
                  {shown.length} entreprise{shown.length > 1 ? "s" : ""} proposée{shown.length > 1 ? "s" : ""}
                </p>
                {withoutEmail > 0 && (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                    <input type="checkbox" checked={withEmailOnly} onChange={(event) => setWithEmailOnly(event.target.checked)} className="h-4 w-4 accent-azure" />
                    Avec e-mail seulement ({result.companies.length - withoutEmail})
                  </label>
                )}
                {withoutPhone > 0 && (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                    <input type="checkbox" checked={withPhoneOnly} onChange={(event) => setWithPhoneOnly(event.target.checked)} className="h-4 w-4 accent-azure" />
                    Avec téléphone seulement ({result.companies.length - withoutPhone})
                  </label>
                )}
                <span className="ml-auto flex gap-2">
                  <button type="button" onClick={() => setPicked(shown.map((company) => company.website))} className={btnSmall}>
                    Tout cocher
                  </button>
                  <button type="button" onClick={() => setPicked([])} className={btnSmall}>
                    Tout décocher
                  </button>
                </span>
              </div>
              <ul className="divide-y divide-line rounded-xl border border-line">
                {shown.map((company) => (
                  <li key={company.website}>
                    <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
                      <input type="checkbox" checked={picked.includes(company.website)} onChange={() => toggle(company.website)} className="mt-1 h-4 w-4 shrink-0 accent-azure" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy">
                          {company.company}
                          {(company.city || company.country) && <span className="font-normal text-muted"> · {placeLabel(company.city, company.country)}</span>}
                        </span>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-azure hover:underline">
                          {host(company.website)}
                        </a>
                        <span className="text-xs text-muted">
                          {" "}
                          · {company.email ?? "e-mail non trouvé"} · {company.phone ?? "téléphone non trouvé"}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-navy/80">{company.reason}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
          {(result.note || result.dropped > 0) && (
            <p className="text-xs leading-relaxed text-muted">
              {result.note}
              {result.dropped > 0 && ` ${result.dropped} proposition${result.dropped > 1 ? "s" : ""} écartée${result.dropped > 1 ? "s" : ""} par les contrôles (site introuvable dans les résultats, annuaire, doublon ou hors critères).`}
            </p>
          )}
          {result.companies.length > 0 && (
            <button
              type="button"
              disabled={chosen.length === 0}
              onClick={() =>
                onAdd(chosen.map((company) => ({ company: company.company, website: company.website, email: company.email, phone: company.phone, country: company.country, city: company.city, language, notes: company.reason })))
              }
              className={btnPrimary}
            >
              <Plus size={16} /> Ajouter {chosen.length > 0 ? `les ${chosen.length} cochée${chosen.length > 1 ? "s" : ""}` : ""}
            </button>
          )}
        </>
      )}
    </div>
  );
}
