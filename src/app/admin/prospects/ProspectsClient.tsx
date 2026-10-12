"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Mail, Phone, Plus, RefreshCw, Search, Sparkles, Target, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryLanguage, countryName, placeLabel } from "@/lib/agent/countries";
import { Avatar, Empty, PageHeader } from "@/components/admin/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { btnGhost, btnPrimary, btnSmall, btnSmallDanger, card, input, label, pill } from "@/components/admin/styles";
import Discover from "./Discover";
import { CountrySelect, LANGUAGES, LanguageSelect, STATUS, host, type Language, type Prospect } from "./shared";

// États que l'on choisit à la main une fois l'e-mail parti.
const FOLLOW_UP = ["SENT", "REPLIED", "DECLINED", "DO_NOT_CONTACT"];

// Onglets de la liste : où en est chaque entreprise.
const GROUPS = [
  { key: "all", label: "Toutes", statuses: null },
  { key: "todo", label: "À préparer", statuses: ["NEW", "PREPARING", "FAILED"] },
  { key: "ready", label: "À relire", statuses: ["READY"] },
  { key: "sent", label: "Envoyés", statuses: ["SENT"] },
  { key: "replied", label: "Réponses", statuses: ["REPLIED"] },
  { key: "closed", label: "Clos", statuses: ["DECLINED", "DO_NOT_CONTACT"] },
] as const;
type GroupKey = (typeof GROUPS)[number]["key"];

const CONTACT_FILTERS = {
  "": "Toutes les coordonnées",
  email: "Avec e-mail",
  "no-email": "Sans e-mail",
  phone: "Avec téléphone",
  "no-phone": "Sans téléphone",
  none: "Ni e-mail ni téléphone",
} as const;
type ContactFilter = keyof typeof CONTACT_FILTERS;

const hasContact: Record<ContactFilter, (p: Prospect) => boolean> = {
  "": () => true,
  email: (p) => Boolean(p.email),
  "no-email": (p) => !p.email,
  phone: (p) => Boolean(p.phone),
  "no-phone": (p) => !p.phone,
  none: (p) => !p.email && !p.phone,
};

const PHONE_SHAPE = /^[+(\d][\d\s()./-]*$/;
const isPhone = (cell: string) => PHONE_SHAPE.test(cell) && cell.replace(/\D/g, "").length >= 6;
const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

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

// Liste collée ou importée : une entreprise par ligne, le nom d'abord. Les autres colonnes sont reconnues
// à leur forme (une adresse e-mail, un téléphone, un site, sinon le nom du contact), dans n'importe quel ordre.
function parseList(text: string) {
  const separator = text.includes(";") ? ";" : text.includes("\t") ? "\t" : ",";
  return text
    .split(/\r?\n/)
    .map((line) => line.split(separator).map((cell) => cell.trim().replace(/^"|"$/g, "")))
    .filter(([company], i) => company && !(i === 0 && /^(entreprise|nom|soci[ée]t[ée]|company|name)$/i.test(company)))
    .map(([company, ...cells]) => {
      const email = cells.find((cell) => cell.includes("@"));
      const phone = cells.find((cell) => cell !== email && isPhone(cell));
      const website = cells.find((cell) => cell !== email && cell !== phone && /^\S+\.\S+$/.test(cell));
      const contactName = cells.find((cell) => cell && cell !== email && cell !== phone && cell !== website);
      return { company, email, phone, website, contactName };
    });
}

// Agent sortant : on donne des entreprises (ou on les fait chercher), l'agent lit leur site et prépare un e-mail
// personnalisé. Rien ne part d'ici : chaque brouillon se relit, se corrige, puis s'ouvre dans la messagerie de l'utilisateur.
export default function ProspectsClient({ initial, configured }: { initial: Prospect[]; configured: boolean }) {
  const [prospects, setProspects] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState<"one" | "many" | null>(null);
  const [discovering, setDiscovering] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Entreprise dont la suppression attend une confirmation.
  const [removing, setRemoving] = useState<Prospect | null>(null);
  // Brouillons demandés d'un coup : préparés un par un, pour ne pas saturer l'API.
  const [queue, setQueue] = useState<string[]>([]);
  const starting = useRef(false);

  // Filtres de la liste.
  const [group, setGroup] = useState<GroupKey>("all");
  const [query, setQuery] = useState("");
  // "" : tous les pays ; "none" : pays non précisé ; sinon un code pays.
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState<ContactFilter>("");

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
      setDiscovering(false);
      setFeedback(
        `${result.created} entreprise${result.created > 1 ? "s" : ""} ajoutée${result.created > 1 ? "s" : ""}` +
          (result.duplicates ? `, ${result.duplicates} déjà présente${result.duplicates > 1 ? "s" : ""} ignorée${result.duplicates > 1 ? "s" : ""}.` : ".")
      );
    } catch (error) {
      fail(error);
    }
  };

  const remove = () => {
    if (!removing) return;
    setProspects((current) => current.filter((p) => p.id !== removing.id));
    api(`/${removing.id}`, "DELETE").catch(fail);
    setRemoving(null);
  };

  // Recherche, pays et coordonnées s'appliquent d'abord ; les onglets comptent ce qu'il reste dans chaque état.
  const words = query.trim().toLowerCase();
  const narrowed = prospects.filter(
    (p) =>
      (country === "none" ? !p.country : !country || p.country === country) &&
      hasContact[contact](p) &&
      (!words || [p.company, p.website, p.email, p.phone, p.contactName, p.city].some((value) => value?.toLowerCase().includes(words)))
  );
  const inGroup = (key: GroupKey) => {
    const statuses: readonly string[] | null = GROUPS.find((g) => g.key === key)!.statuses;
    return statuses ? narrowed.filter((p) => statuses.includes(p.status)) : narrowed;
  };
  const visible = inGroup(group);
  const waiting = visible.filter((p) => p.status === "NEW");
  const filtered = group !== "all" || Boolean(words) || Boolean(country) || Boolean(contact);
  const resetFilters = () => {
    setGroup("all");
    setQuery("");
    setCountry("");
    setContact("");
  };

  const usedCountries = [...new Set(prospects.map((p) => p.country).filter((code): code is string => Boolean(code)))].sort((a, b) => countryName(a).localeCompare(countryName(b), "fr"));
  const count = (status: string) => prospects.filter((p) => p.status === status).length;

  return (
    <div>
      <PageHeader
        title="Prospection"
        lead={`${prospects.length} entreprise${prospects.length > 1 ? "s" : ""} · ${count("READY")} brouillon${count("READY") > 1 ? "s" : ""} à relire · ${count("SENT")} envoyé${count("SENT") > 1 ? "s" : ""}`}
      >
        {configured && waiting.length > 1 && (
          <button type="button" onClick={() => setQueue(waiting.map((p) => p.id))} disabled={preparing > 0 || queue.length > 0} className={btnGhost}>
            <Sparkles size={16} /> Préparer les {waiting.length} en attente
          </button>
        )}
        {configured && (
          <button
            type="button"
            onClick={() => {
              setDiscovering(!discovering);
              setAdding(null);
            }}
            className={btnGhost}
          >
            <Search size={16} /> Trouver des entreprises
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setAdding(adding ? null : "one");
            setDiscovering(false);
          }}
          className={btnPrimary}
        >
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
      {discovering && <Discover onAdd={add} onClose={() => setDiscovering(false)} />}

      {prospects.length === 0 ? (
        <Empty icon={Target}>Aucune entreprise pour l&apos;instant. Ajoutez-en une avec son site web, ou laissez l&apos;agent en chercher : il lira leur site et vous préparera un e-mail.</Empty>
      ) : (
        <>
          <div className="mb-4 space-y-3">
            <div className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
              {GROUPS.map(({ key, label: name }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGroup(key)}
                  aria-pressed={group === key}
                  className={cn("flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors", group === key ? "bg-navy text-white" : "text-muted hover:text-navy")}
                >
                  {name}
                  <span className={cn("text-xs font-medium", group === key ? "text-white/70" : "text-muted")}>{inGroup(key).length}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-52 flex-1">
                <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Chercher un nom, un site, un e-mail, une ville…"
                  aria-label="Chercher dans la liste"
                  className={cn(input, "pl-10")}
                />
              </div>
              <select value={country} onChange={(event) => setCountry(event.target.value)} aria-label="Filtrer par pays" className={cn(input, "w-auto")}>
                <option value="">Tous les pays</option>
                {usedCountries.map((code) => (
                  <option key={code} value={code}>
                    {countryName(code)}
                  </option>
                ))}
                {prospects.some((p) => !p.country) && <option value="none">Pays non précisé</option>}
              </select>
              <select value={contact} onChange={(event) => setContact(event.target.value as ContactFilter)} aria-label="Filtrer par coordonnées" className={cn(input, "w-auto")}>
                {Object.entries(CONTACT_FILTERS).map(([value, name]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
              {filtered && (
                <button type="button" onClick={resetFilters} className={btnSmall}>
                  <X size={13} /> Effacer les filtres
                </button>
              )}
            </div>
            {filtered && (
              <p className="text-xs text-muted">
                {visible.length} entreprise{visible.length > 1 ? "s" : ""} sur {prospects.length}
              </p>
            )}
          </div>

          {visible.length === 0 ? (
            <p className={cn(card, "px-6 py-10 text-center text-sm text-muted")}>Aucune entreprise ne correspond à ces filtres.</p>
          ) : (
            <ul className="space-y-3">
              {visible.map((prospect) => {
                const open = expanded === prospect.id;
                const status = STATUS[prospect.status] ?? STATUS.NEW;
                return (
                  <li key={prospect.id} className={card}>
                    <button type="button" onClick={() => setExpanded(open ? null : prospect.id)} aria-expanded={open} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-5">
                      <Avatar name={prospect.company} tone={prospect.status === "READY" ? "gold" : "azure"} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy">{prospect.company}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {[
                            placeLabel(prospect.city, prospect.country),
                            prospect.website && host(prospect.website),
                            prospect.email ?? "e-mail manquant",
                            prospect.phone,
                            LANGUAGES[prospect.language as Language],
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className={cn(pill, "shrink-0", status.tone)}>{status.label}</span>
                      <ChevronDown size={16} className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")} />
                    </button>
                    {open && <Details prospect={prospect} configured={configured} edit={edit} save={save} prepare={prepare} remove={setRemoving} />}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={removing !== null}
        title="Supprimer cette entreprise"
        message={
          `Voulez-vous vraiment supprimer "${removing?.company}" de la prospection ? Cette action est irréversible.` +
          (removing?.status === "DO_NOT_CONTACT" ? " Sa fiche ne vous protégera plus contre une nouvelle prise de contact." : "")
        }
        onConfirm={remove}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
}

function AddForm({ mode, setMode, onAdd }: { mode: "one" | "many"; setMode: (mode: "one" | "many" | null) => void; onAdd: (rows: unknown[]) => void }) {
  const [language, setLanguage] = useState<Language>("fr");
  const [country, setCountry] = useState("");
  const [list, setList] = useState("");
  const rows = mode === "many" ? parseList(list).map((row) => ({ ...row, language, country: country || null })) : [];

  // Choisir un pays règle aussi la langue des e-mails ; elle reste modifiable.
  const chooseCountry = (code: string) => {
    setCountry(code);
    if (code) setLanguage(countryLanguage(code));
  };

  const countryField = (
    <div>
      <label htmlFor="prospect-country" className={label}>
        Pays
      </label>
      <CountrySelect id="prospect-country" value={country} onChange={chooseCountry} />
    </div>
  );
  const languageField = (
    <div>
      <label htmlFor="prospect-language" className={label}>
        Langue de l&apos;e-mail
      </label>
      <LanguageSelect id="prospect-language" value={language} onChange={(value) => setLanguage(value as Language)} />
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
            onAdd([{ ...data, language, country: country || null }]);
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
            <label htmlFor="prospect-phone" className={label}>
              Téléphone
            </label>
            <input id="prospect-phone" name="phone" type="tel" maxLength={40} className={input} />
          </div>
          <div>
            <label htmlFor="prospect-contact" className={label}>
              Nom du contact
            </label>
            <input id="prospect-contact" name="contactName" maxLength={200} className={input} />
          </div>
          <div>
            <label htmlFor="prospect-city" className={label}>
              Ville
            </label>
            <input id="prospect-city" name="city" maxLength={100} className={input} />
          </div>
          {countryField}
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
              Une entreprise par ligne : nom ; site web ; e-mail ; téléphone ; contact
            </label>
            <textarea
              id="prospect-list"
              rows={6}
              value={list}
              onChange={(event) => setList(event.target.value)}
              placeholder={"Boulangerie Martin ; boulangerie-martin.fr ; contact@boulangerie-martin.fr ; 04 72 00 00 00\nGarage Rossi ; garagerossi.it"}
              className={cn(input, "font-mono text-[13px]")}
            />
            <p className="mt-1.5 text-xs text-muted">Seul le nom est obligatoire, l&apos;ordre des autres colonnes est libre. Un fichier CSV exporté depuis un tableur convient aussi.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {countryField}
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

  // Un champ de la fiche s'enregistre quand on le quitte, s'il a changé. Sa clé le recrée quand
  // le serveur a mis la valeur au propre (un site complété en « https://… », par exemple).
  const fieldKey = (name: "website" | "email" | "phone" | "contactName" | "city" | "notes") => `${name}-${prospect[name]}`;
  const field = (name: "website" | "email" | "phone" | "contactName" | "city" | "notes") => ({
    id: `${name}-${id}`,
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
          <input key={fieldKey("website")} {...field("website")} className={input} />
        </div>
        <div>
          <label htmlFor={`contactName-${id}`} className={label}>
            Nom du contact
          </label>
          <input key={fieldKey("contactName")} {...field("contactName")} className={input} />
        </div>
        <div>
          <label htmlFor={`email-${id}`} className={label}>
            E-mail
          </label>
          <input type="email" key={fieldKey("email")} {...field("email")} className={input} />
          {/* Proposée quand l'e-mail manque, ou quand celui de la fiche n'est pas celui affiché sur le site. */}
          {prospect.emailFound && prospect.emailFound !== prospect.email && (
            <p className="mt-1.5 text-xs text-muted">
              {prospect.email ? "Adresse différente lue sur le site" : "Lue sur le site"} : {prospect.emailFound}{" "}
              <button type="button" onClick={() => save(id, { email: prospect.emailFound })} className="cursor-pointer font-semibold text-azure hover:underline">
                Utiliser
              </button>
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`phone-${id}`} className={label}>
            Téléphone
          </label>
          <input type="tel" key={fieldKey("phone")} {...field("phone")} className={input} />
        </div>
        <div>
          <label htmlFor={`country-${id}`} className={label}>
            Pays
          </label>
          <CountrySelect id={`country-${id}`} value={prospect.country ?? ""} onChange={(value) => save(id, { country: value || null })} />
        </div>
        <div>
          <label htmlFor={`city-${id}`} className={label}>
            Ville
          </label>
          <input key={fieldKey("city")} {...field("city")} className={input} />
        </div>
        <div>
          <label htmlFor={`language-${id}`} className={label}>
            Langue de l&apos;e-mail
          </label>
          <LanguageSelect id={`language-${id}`} value={prospect.language} onChange={(value) => save(id, { language: value })} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`notes-${id}`} className={label}>
            Ce que vous savez déjà
          </label>
          <textarea rows={2} key={fieldKey("notes")} {...field("notes")} placeholder="Contexte, besoin supposé, angle souhaité : l'agent en tient compte." className={cn(input, "resize-none")} />
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
        {prospect.phone && !blocked && (
          <a href={tel(prospect.phone)} className={btnGhost}>
            <Phone size={16} /> Appeler
          </a>
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
