"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Mail, Plus, RefreshCw, Sparkles, Target, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Empty, PageHeader } from "@/components/admin/ui";
import { btnGhost, btnPrimary, btnSmall, btnSmallDanger, card, input, label, pill } from "@/components/admin/styles";

type Language = "fr" | "it" | "en";

type Prospect = {
  id: string;
  company: string;
  website: string | null;
  contactName: string | null;
  email: string | null;
  language: string;
  notes: string | null;
  status: string;
  summary: string | null;
  angle: string | null;
  emailFound: string | null;
  subject: string | null;
  body: string | null;
  error: string | null;
};

const LANGUAGES: Record<Language, string> = { fr: "Français", it: "Italien", en: "Anglais" };

const STATUS: Record<string, { label: string; tone: string }> = {
  NEW: { label: "À préparer", tone: "bg-mist text-muted" },
  PREPARING: { label: "En préparation…", tone: "bg-azure/10 text-azure" },
  READY: { label: "Brouillon à relire", tone: "bg-gold/25 text-navy" },
  FAILED: { label: "Échec", tone: "bg-red-50 text-red-700" },
  SENT: { label: "Envoyé", tone: "bg-emerald-100 text-emerald-800" },
  REPLIED: { label: "A répondu", tone: "bg-emerald-100 text-emerald-800" },
  DECLINED: { label: "Pas intéressé", tone: "bg-slate-100 text-slate-500" },
  DO_NOT_CONTACT: { label: "Ne plus contacter", tone: "bg-slate-100 text-slate-500" },
};
// États que l'on choisit à la main une fois l'e-mail parti.
const FOLLOW_UP = ["SENT", "REPLIED", "DECLINED", "DO_NOT_CONTACT"];

async function api<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/admin/prospects${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) throw new Error(json?.error ?? "Une erreur est survenue.");
  return json as T;
}

// Liste collée ou importée : une entreprise par ligne, le nom d'abord. Les autres colonnes sont
// reconnues à leur forme (une adresse e-mail, un site, sinon le nom du contact), dans n'importe quel ordre.
function parseList(text: string, language: Language) {
  const separator = text.includes(";") ? ";" : text.includes("\t") ? "\t" : ",";
  return text
    .split(/\r?\n/)
    .map((line) => line.split(separator).map((cell) => cell.trim().replace(/^"|"$/g, "")))
    .filter(([company], i) => company && !(i === 0 && /^(entreprise|nom|soci[ée]t[ée]|company|name)$/i.test(company)))
    .map(([company, ...cells]) => {
      const email = cells.find((cell) => cell.includes("@"));
      const website = cells.find((cell) => cell !== email && /^\S+\.\S+$/.test(cell));
      const contactName = cells.find((cell) => cell && cell !== email && cell !== website);
      return { company, email, website, contactName, language };
    });
}

const host = (website: string) => website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Agent sortant : on donne des entreprises, l'agent lit leur site et prépare un e-mail personnalisé.
// Rien ne part d'ici : chaque brouillon se relit, se corrige, puis s'ouvre dans la messagerie de l'utilisateur.
export default function ProspectsClient({ initial, configured }: { initial: Prospect[]; configured: boolean }) {
  const [prospects, setProspects] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState<"one" | "many" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Brouillons demandés d'un coup : préparés un par un, pour ne pas saturer l'API.
  const [queue, setQueue] = useState<string[]>([]);
  const starting = useRef(false);

  const replace = (fresh: Prospect) => setProspects((current) => current.map((p) => (p.id === fresh.id ? fresh : p)));
  const edit = (id: string, changes: Partial<Prospect>) => setProspects((current) => current.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  const fail = (error: unknown) => setFeedback(error instanceof Error ? error.message : "Une erreur est survenue.");

  // Seuls les champs envoyés sont repris de la réponse (le serveur met au propre un site ou un e-mail) :
  // un texte en cours de frappe dans un autre champ n'est pas écrasé.
  const save = (id: string, changes: Partial<Prospect>) => {
    edit(id, changes);
    api<Prospect>(`/${id}`, "PUT", changes)
      .then((fresh) => edit(id, Object.fromEntries(Object.keys(changes).map((key) => [key, fresh[key as keyof Prospect]]))))
      .catch(fail);
  };

  const prepare = async (id: string) => {
    starting.current = true;
    setFeedback(null);
    try {
      replace(await api<Prospect>(`/${id}/prepare`, "POST"));
    } catch (error) {
      setQueue([]);
      fail(error);
    }
    starting.current = false;
  };

  const preparing = prospects.filter((p) => p.status === "PREPARING").length;
  const waiting = prospects.filter((p) => p.status === "NEW");

  // Tant qu'un brouillon se prépare, on relit la liste : seuls les prospects qui viennent de finir
  // sont remplacés, pour ne pas écraser un texte en cours de correction.
  useEffect(() => {
    if (preparing === 0) return;
    const timer = setInterval(() => {
      api<Prospect[]>("", "GET")
        .then((fresh) =>
          setProspects((current) =>
            current.map((p) => {
              const latest = fresh.find((f) => f.id === p.id);
              return latest && p.status === "PREPARING" && latest.status !== "PREPARING" ? latest : p;
            })
          )
        )
        .catch(() => {});
    }, 4000);
    return () => clearInterval(timer);
  }, [preparing]);

  useEffect(() => {
    if (starting.current || preparing > 0 || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    prepare(next);
  }, [preparing, queue]);

  const add = async (rows: unknown[]) => {
    setFeedback(null);
    try {
      const result = await api<{ created: number; duplicates: number }>("", "POST", { prospects: rows });
      setProspects(await api<Prospect[]>("", "GET"));
      setAdding(null);
      setFeedback(
        `${result.created} entreprise${result.created > 1 ? "s" : ""} ajoutée${result.created > 1 ? "s" : ""}` +
          (result.duplicates ? `, ${result.duplicates} déjà présente${result.duplicates > 1 ? "s" : ""} ignorée${result.duplicates > 1 ? "s" : ""}.` : ".")
      );
    } catch (error) {
      fail(error);
    }
  };

  const remove = (prospect: Prospect) => {
    if (!window.confirm(`Supprimer ${prospect.company} de la prospection ?`)) return;
    setProspects((current) => current.filter((p) => p.id !== prospect.id));
    api(`/${prospect.id}`, "DELETE").catch(fail);
  };

  const count = (status: string) => prospects.filter((p) => p.status === status).length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Prospection"
        lead={`${prospects.length} entreprise${prospects.length > 1 ? "s" : ""} · ${count("READY")} brouillon${count("READY") > 1 ? "s" : ""} à relire · ${count("SENT")} envoyé${count("SENT") > 1 ? "s" : ""}`}
      >
        {configured && waiting.length > 1 && (
          <button type="button" onClick={() => setQueue(waiting.map((p) => p.id))} disabled={preparing > 0 || queue.length > 0} className={btnGhost}>
            <Sparkles size={16} /> Préparer les {waiting.length} en attente
          </button>
        )}
        <button type="button" onClick={() => setAdding(adding ? null : "one")} className={btnPrimary}>
          <Plus size={16} /> Ajouter
        </button>
      </PageHeader>

      {!configured && (
        <p className="mb-5 rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-navy">
          La clé d&apos;API Claude (ANTHROPIC_API_KEY) n&apos;est pas configurée sur ce serveur : vous pouvez gérer la liste, mais l&apos;agent ne peut pas préparer de brouillon.
        </p>
      )}
      {feedback && (
        <p role="status" className="mb-5 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-navy">
          {feedback}
        </p>
      )}
      {queue.length > 0 && <p className="mb-5 text-sm text-muted">Préparation en cours, un brouillon à la fois : encore {queue.length} en file. Gardez cette page ouverte.</p>}

      {adding && <AddForm mode={adding} setMode={setAdding} onAdd={add} />}

      {prospects.length === 0 ? (
        <Empty icon={Target}>Aucune entreprise pour l&apos;instant. Ajoutez-en une avec son site web : l&apos;agent le lira et vous préparera un e-mail.</Empty>
      ) : (
        <ul className="space-y-3">
          {prospects.map((prospect) => {
            const open = expanded === prospect.id;
            const status = STATUS[prospect.status] ?? STATUS.NEW;
            return (
              <li key={prospect.id} className={card}>
                <button type="button" onClick={() => setExpanded(open ? null : prospect.id)} aria-expanded={open} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-5">
                  <Avatar name={prospect.company} tone={prospect.status === "READY" ? "gold" : "azure"} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy">{prospect.company}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {[prospect.website && host(prospect.website), prospect.email ?? "e-mail manquant", LANGUAGES[prospect.language as Language]].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className={cn(pill, "shrink-0", status.tone)}>{status.label}</span>
                  <ChevronDown size={16} className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")} />
                </button>
                {open && <Details prospect={prospect} configured={configured} edit={edit} save={save} prepare={prepare} remove={remove} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AddForm({ mode, setMode, onAdd }: { mode: "one" | "many"; setMode: (mode: "one" | "many" | null) => void; onAdd: (rows: unknown[]) => void }) {
  const [language, setLanguage] = useState<Language>("fr");
  const [list, setList] = useState("");
  const rows = mode === "many" ? parseList(list, language) : [];

  const languageField = (
    <div>
      <label htmlFor="prospect-language" className={label}>
        Langue de l&apos;e-mail
      </label>
      <select id="prospect-language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className={input}>
        {Object.entries(LANGUAGES).map(([value, name]) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={cn(card, "mb-5 p-4 sm:p-5")}>
      <div className="mb-4 flex w-fit gap-1 rounded-full border border-line bg-white p-1">
        {(["one", "many"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setMode(value)} className={cn("cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", mode === value ? "bg-navy text-white" : "text-muted hover:text-navy")}>
            {value === "one" ? "Une entreprise" : "Plusieurs (liste)"}
          </button>
        ))}
      </div>

      {mode === "one" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.currentTarget));
            onAdd([{ ...data, language }]);
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="prospect-company" className={label}>
              Entreprise *
            </label>
            <input id="prospect-company" name="company" required maxLength={200} className={input} />
          </div>
          <div>
            <label htmlFor="prospect-website" className={label}>
              Site web
            </label>
            <input id="prospect-website" name="website" placeholder="exemple.fr" maxLength={300} className={input} />
          </div>
          <div>
            <label htmlFor="prospect-email" className={label}>
              E-mail
            </label>
            <input id="prospect-email" name="email" type="email" maxLength={200} className={input} />
          </div>
          <div>
            <label htmlFor="prospect-contact" className={label}>
              Nom du contact
            </label>
            <input id="prospect-contact" name="contactName" maxLength={200} className={input} />
          </div>
          {languageField}
          <div className="sm:col-span-2">
            <label htmlFor="prospect-notes" className={label}>
              Ce que vous savez déjà (facultatif)
            </label>
            <textarea id="prospect-notes" name="notes" rows={2} maxLength={5000} placeholder="Contexte, besoin supposé, angle souhaité : l'agent en tient compte." className={cn(input, "resize-none")} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary}>
              Ajouter
            </button>
            <button type="button" onClick={() => setMode(null)} className={btnGhost}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          <div>
            <label htmlFor="prospect-list" className={label}>
              Une entreprise par ligne : nom ; site web ; e-mail ; contact
            </label>
            <textarea
              id="prospect-list"
              rows={6}
              value={list}
              onChange={(event) => setList(event.target.value)}
              placeholder={"Boulangerie Martin ; boulangerie-martin.fr ; contact@boulangerie-martin.fr\nGarage Rossi ; garagerossi.it"}
              className={cn(input, "font-mono text-[13px]")}
            />
            <p className="mt-1.5 text-xs text-muted">Seul le nom est obligatoire. Les colonnes d&apos;un fichier CSV exporté depuis un tableur conviennent aussi.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {languageField}
            <div>
              <span className={label}>Ou depuis un fichier</span>
              <label className={cn(btnGhost, "w-full")}>
                <Upload size={16} /> Choisir un fichier CSV
                <input type="file" accept=".csv,.txt,text/csv,text/plain" className="sr-only" onChange={(event) => event.target.files?.[0]?.text().then(setList)} />
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" disabled={rows.length === 0} onClick={() => onAdd(rows)} className={btnPrimary}>
              Ajouter {rows.length > 0 ? `${rows.length} entreprise${rows.length > 1 ? "s" : ""}` : ""}
            </button>
            <button type="button" onClick={() => setMode(null)} className={btnGhost}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Details({
  prospect,
  configured,
  edit,
  save,
  prepare,
  remove,
}: {
  prospect: Prospect;
  configured: boolean;
  edit: (id: string, changes: Partial<Prospect>) => void;
  save: (id: string, changes: Partial<Prospect>) => void;
  prepare: (id: string) => void;
  remove: (prospect: Prospect) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { id, status } = prospect;
  const hasDraft = prospect.body !== null;
  const blocked = status === "DO_NOT_CONTACT";

  // Un champ de la fiche s'enregistre quand on le quitte, s'il a changé.
  const field = (name: "website" | "email" | "contactName" | "notes") => ({
    defaultValue: prospect[name] ?? "",
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.target.value !== (prospect[name] ?? "")) save(id, { [name]: event.target.value });
    },
  });
  // L'objet et le texte suivent la frappe (les boutons d'envoi reprennent toujours la dernière version)
  // et s'enregistrent quand on quitte le champ.
  const draftField = (name: "subject" | "body") => ({
    value: prospect[name] ?? "",
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => edit(id, { [name]: event.target.value }),
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => save(id, { [name]: event.target.value }),
  });

  const subject = encodeURIComponent(prospect.subject ?? "");
  const body = encodeURIComponent(prospect.body ?? "");
  const copy = () =>
    navigator.clipboard.writeText(`${prospect.subject}\n\n${prospect.body}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

  return (
    <div className="space-y-5 border-t border-line px-4 py-5 sm:px-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`website-${id}`} className={label}>
            Site web
          </label>
          <input id={`website-${id}`} key={`website-${prospect.website}`} {...field("website")} className={input} />
        </div>
        <div>
          <label htmlFor={`email-${id}`} className={label}>
            E-mail
          </label>
          <input id={`email-${id}`} key={`email-${prospect.email}`} type="email" {...field("email")} className={input} />
          {!prospect.email && prospect.emailFound && (
            <p className="mt-1.5 text-xs text-muted">
              Lue sur le site : {prospect.emailFound}{" "}
              <button type="button" onClick={() => save(id, { email: prospect.emailFound })} className="cursor-pointer font-semibold text-azure hover:underline">
                Utiliser
              </button>
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`contact-${id}`} className={label}>
            Nom du contact
          </label>
          <input id={`contact-${id}`} {...field("contactName")} className={input} />
        </div>
        <div>
          <label htmlFor={`language-${id}`} className={label}>
            Langue de l&apos;e-mail
          </label>
          <select id={`language-${id}`} value={prospect.language} onChange={(event) => save(id, { language: event.target.value })} className={input}>
            {Object.entries(LANGUAGES).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`notes-${id}`} className={label}>
            Ce que vous savez déjà
          </label>
          <textarea id={`notes-${id}`} rows={2} {...field("notes")} placeholder="Contexte, besoin supposé, angle souhaité : l'agent en tient compte." className={cn(input, "resize-none")} />
        </div>
      </div>

      {status === "PREPARING" && <p className="rounded-xl bg-azure/[0.06] px-4 py-3 text-sm text-navy">L&apos;agent lit le site et rédige l&apos;e-mail. Cela prend de 20 à 60 secondes ; la page se met à jour toute seule.</p>}
      {status === "FAILED" && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">La préparation a échoué. {prospect.error}</p>}

      {hasDraft && status !== "PREPARING" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-mist p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Ce que l&apos;agent a compris</p>
              <p className="mt-1.5 text-sm leading-relaxed text-navy">{prospect.summary}</p>
            </div>
            <div className="rounded-xl bg-mist p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pourquoi les contacter</p>
              <p className="mt-1.5 text-sm leading-relaxed text-navy">{prospect.angle}</p>
            </div>
          </div>

          <div>
            <label htmlFor={`subject-${id}`} className={label}>
              Objet
            </label>
            <input id={`subject-${id}`} maxLength={200} {...draftField("subject")} className={input} />
          </div>
          <div>
            <label htmlFor={`body-${id}`} className={label}>
              E-mail (relisez et corrigez avant d&apos;envoyer)
            </label>
            <textarea id={`body-${id}`} rows={14} {...draftField("body")} className={cn(input, "leading-relaxed")} />
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {hasDraft && !blocked && status !== "PREPARING" && (
          <>
            {prospect.email ? (
              <>
                <a href={`mailto:${prospect.email}?subject=${subject}&body=${body}`} className={btnPrimary}>
                  <Mail size={16} /> Ouvrir dans ma messagerie
                </a>
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(prospect.email)}&su=${subject}&body=${body}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                  <ExternalLink size={16} /> Gmail
                </a>
              </>
            ) : (
              <span className="text-sm text-muted">Ajoutez l&apos;e-mail du destinataire pour ouvrir le message.</span>
            )}
            <button type="button" onClick={copy} className={btnGhost}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copié" : "Copier"}
            </button>
            {status === "READY" && (
              <button type="button" onClick={() => save(id, { status: "SENT" })} className={btnGhost}>
                <Check size={16} /> Marquer comme envoyé
              </button>
            )}
          </>
        )}
        {configured && !blocked && status !== "PREPARING" && (
          <button type="button" onClick={() => prepare(id)} className={hasDraft ? btnSmall : btnPrimary}>
            {hasDraft ? <RefreshCw size={13} /> : <Sparkles size={16} />} {hasDraft ? "Refaire le brouillon" : "Préparer l'e-mail"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        {FOLLOW_UP.includes(status) ? (
          <label className="flex items-center gap-2 text-sm text-muted">
            Suivi
            <select value={status} onChange={(event) => save(id, { status: event.target.value })} className={cn(input, "w-auto py-1.5")}>
              {FOLLOW_UP.map((value) => (
                <option key={value} value={value}>
                  {STATUS[value].label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <button type="button" onClick={() => save(id, { status: "DO_NOT_CONTACT" })} className={btnSmall}>
            Ne plus contacter
          </button>
        )}
        <button type="button" onClick={() => remove(prospect)} className={btnSmallDanger}>
          <Trash2 size={13} /> Supprimer
        </button>
      </div>
    </div>
  );
}
