import { Resend } from "resend";

// Instanciation paresseuse : ne pas créer le client au build (clé absente → erreur).
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// Nom affiché dans tous les e-mails : fixe, pour ne pas dépendre de la configuration du serveur.
const SITE = "Kelenix Tech";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kelenix.com";
const ADMIN = process.env.ADMIN_EMAIL ?? "admin@kelenix.com";

// Expéditeur : l'adresse doit être sur un domaine vérifié dans Resend
// (EMAIL_FROM en priorité, sinon SMTP_FROM, sinon domaine de test Resend).
// Le nom affiché dans la boîte de réception reste toujours celui du site.
const FROM_ADDRESS = (process.env.EMAIL_FROM ?? process.env.SMTP_FROM ?? "onboarding@resend.dev").replace(/^.*<(.+)>.*$/, "$1").trim();
const FROM = `${SITE} <${FROM_ADDRESS}>`;

// ─── Gabarit ──────────────────────────────────────────────────────────────────
// Les messageries ignorent souvent les feuilles de style : la mise en page repose
// sur des tableaux et des styles en ligne, aux couleurs du site.

const C = { navy: "#0B1F3A", azure: "#0F6FE6", gold: "#FFC107", mist: "#F3F7FC", line: "#E2E9F2", muted: "#55657D" };
const SANS = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
// Largeur maximale de la carte, en pixels ; elle se réduit toute seule sur téléphone.
const WIDTH = 760;
const T = {
  body: `font-family:${SANS};font-size:15px;line-height:1.65;color:${C.navy};`,
  small: `font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted};`,
  label: `font-family:${SANS};font-size:12px;line-height:1.4;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};`,
};

// Tout ce qui vient d'un visiteur passe par ici avant d'entrer dans le HTML.
const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const p = (html: string) => `<p style="margin:0 0 14px;${T.body}">${html}</p>`;

// Texte libre saisi par un visiteur : une ligne = un paragraphe, pour rester lisible même très long.
function prose(value: string | null | undefined) {
  return (value ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 10px;${T.body}">${esc(line)}</p>`)
    .join("");
}

// Bloc titré ; rien n'est affiché si le contenu est vide.
const section = (title: string, html: string) =>
  html
    ? `<div style="margin-top:28px;"><div style="${T.label}padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid ${C.line};">${title}</div>${html}</div>`
    : "";

// Résumé libellé / valeur sur fond bleu très clair ; les lignes vides sont ignorées.
function facts(rows: [string, string | null | undefined][]) {
  const filled = rows.filter((row): row is [string, string] => Boolean(row[1]));
  if (filled.length === 0) return "";
  const lines = filled.map(([label, value], i) => {
    const border = i > 0 ? `border-top:1px solid ${C.line};` : "";
    return `<tr>
      <td width="110" valign="top" style="${T.small}padding:12px 8px 12px 18px;${border}">${label}</td>
      <td valign="top" style="${T.body}line-height:1.45;font-weight:700;padding:11px 18px 11px 8px;${border}">${esc(value)}</td>
    </tr>`;
  });
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.mist};border-radius:12px;">${lines.join("")}</table>`;
}

function button(label: string, href: string, variant: "primary" | "ghost" = "primary") {
  const colors =
    variant === "primary"
      ? `background:${C.azure};color:#ffffff;border:1px solid ${C.azure};`
      : `background:#ffffff;color:${C.navy};border:1px solid ${C.line};`;
  return `<a class="btn" href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 22px;border-radius:999px;font-family:${SANS};font-size:14px;font-weight:700;text-decoration:none;${colors}">${esc(label)}</a>`;
}

type Person = { name: string; company?: string | null; email: string; phone?: string | null };

// Qui écrit : nom, entreprise et coordonnées cliquables.
function contact(person: Person) {
  const link = `color:${C.azure};text-decoration:none;`;
  const phone = person.phone
    ? ` &nbsp;·&nbsp; <a href="tel:${esc(person.phone.replace(/[^\d+]/g, ""))}" style="${link}">${esc(person.phone)}</a>`
    : "";
  return `<div style="font-family:${SANS};font-size:17px;line-height:1.4;font-weight:700;color:${C.navy};">${esc(person.name)}</div>
    ${person.company ? `<div style="${T.small}font-size:14px;margin-top:2px;">${esc(person.company)}</div>` : ""}
    <div style="${T.body}margin-top:8px;"><a href="mailto:${esc(person.email)}" style="${link}">${esc(person.email)}</a>${phone}</div>`;
}

// Notification reçue par l'équipe, toujours dans le même ordre :
// l'essentiel en résumé, qui écrit et comment répondre, puis les textes libres.
function adminBody(options: {
  person: Person;
  replyLabel: string;
  replySubject: string;
  adminPath: string;
  facts: [string, string | null | undefined][];
  texts: [string, string | null | undefined][];
}) {
  const { person } = options;
  const mailto = `mailto:${person.email}?subject=${encodeURIComponent(options.replySubject)}`;
  return `${facts(options.facts)}
    ${section(
      "Contact",
      `${contact(person)}<div style="margin-top:16px;">${button(options.replyLabel, mailto)}${button("Ouvrir dans l'admin", `${BASE_URL}${options.adminPath}`, "ghost")}</div>`
    )}
    ${options.texts.map(([title, text]) => section(title, prose(text))).join("")}`;
}

function wrap(title: string, body: string, options: { eyebrow?: string; subtitle?: string; preheader?: string } = {}) {
  const { eyebrow, subtitle, preheader } = options;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<style>
  @media (max-width:620px){
    .px{padding-left:22px!important;padding-right:22px!important}
    .h1{font-size:23px!important}
    .btn{display:block!important;margin:0 0 10px!important;text-align:center!important}
  }
</style></head>
<body style="margin:0;padding:0;background:${C.mist};">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.mist};"><tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="${WIDTH}" cellpadding="0" cellspacing="0" style="width:100%;max-width:${WIDTH}px;">
    <tr><td style="padding:0 6px 18px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td width="30" height="30" align="center" valign="middle" style="background:${C.azure};border-radius:9px;font-family:${SANS};font-size:16px;font-weight:700;color:#ffffff;">K</td>
        <td style="padding-left:10px;font-family:${SANS};font-size:20px;font-weight:700;letter-spacing:-.01em;color:${C.navy};">Kelenix <span style="font-weight:500;color:${C.muted};">Tech</span></td>
      </tr></table>
    </td></tr>
    <tr><td style="background:#ffffff;border:1px solid ${C.line};border-radius:16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td class="px" style="padding:34px 36px 0;">
          ${eyebrow ? `<div style="${T.label}color:${C.azure};margin-bottom:10px;">${esc(eyebrow)}</div>` : ""}
          <h1 class="h1" style="margin:0;font-family:${SERIF};font-size:27px;line-height:1.25;font-weight:500;letter-spacing:-.01em;color:${C.navy};">${esc(title)}</h1>
          ${subtitle ? `<div style="${T.small}font-size:14px;margin-top:8px;">${esc(subtitle)}</div>` : ""}
          <div style="width:44px;height:3px;margin-top:18px;background:${C.gold};border-radius:3px;font-size:0;line-height:0;">&nbsp;</div>
        </td></tr>
        <tr><td class="px" style="padding:24px 36px 30px;">${body}</td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding:22px 12px 0;${T.small}font-size:12px;">
      <strong style="color:${C.navy};">${SITE}</strong> · L'intelligence au service de l'innovation mondiale<br/>
      © ${new Date().getFullYear()} · E-mail envoyé automatiquement depuis ${new URL(BASE_URL).host}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

const signature = p(`À très vite,<br/><strong>L'équipe ${SITE}</strong>`);

async function send(options: { to: string; subject: string; html: string; replyTo?: string }) {
  const client = getResend();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — email skipped");
    return;
  }
  try {
    const { error } = await client.emails.send({
      from: FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    if (error) console.error("[email] Resend error:", error);
  } catch (err) {
    console.error("[email] Send failed:", err);
  }
}

// ─── Contact message ──────────────────────────────────────────────────────────

export async function sendContactNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
}) {
  const name = `${data.firstName} ${data.lastName}`;
  await Promise.all([
    send({
      to: ADMIN,
      replyTo: data.email,
      subject: `[${SITE}] Nouveau message de contact — ${name}`,
      html: wrap(
        name,
        adminBody({
          person: { name, company: data.company, email: data.email, phone: data.phone },
          replyLabel: `Répondre à ${data.firstName}`,
          replySubject: `Votre message à ${SITE}`,
          adminPath: "/admin/messages",
          facts: [["Service", data.service], ["Budget", data.budget]],
          texts: [["Message", data.message]],
        }),
        { eyebrow: "Nouveau message de contact", subtitle: data.company ?? undefined, preheader: data.message.slice(0, 120) }
      ),
    }),
    send({
      to: data.email,
      replyTo: ADMIN,
      subject: `Votre message a bien été reçu — ${SITE}`,
      html: wrap(
        `Merci ${data.firstName}, votre message est bien arrivé.`,
        `${p("Nous avons bien reçu votre message et nous vous répondrons dans les meilleurs délais.")}
         ${signature}`,
        { eyebrow: "Confirmation de réception" }
      ),
    }),
  ]);
}

// ─── Devis (quote request) ────────────────────────────────────────────────────

// Mêmes intitulés que les tuiles du formulaire de devis.
const SERVICE_LABELS: Record<string, string> = {
  software: "Développement Logiciel",
  web: "Site Web",
  webapp: "Application Web",
  mobile: "App Mobile",
  ai: "Intelligence Artificielle",
  consulting: "Consulting IT",
  training: "Formation",
  other: "Autre",
};

export async function sendQuoteNotification(data: {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  serviceType: string;
  projectName: string;
  projectDesc: string;
  projectGoals?: string | null;
  budget: string;
  deadline?: string | null;
}) {
  const name = `${data.firstName} ${data.lastName}`;
  const service = SERVICE_LABELS[data.serviceType] ?? data.serviceType;
  await Promise.all([
    send({
      to: ADMIN,
      replyTo: data.email,
      subject: `[${SITE}] Demande de devis — ${name} · ${data.budget}`,
      html: wrap(
        data.projectName,
        adminBody({
          person: { name, company: data.company, email: data.email, phone: data.phone },
          replyLabel: `Répondre à ${data.firstName}`,
          replySubject: `Votre demande de devis — ${data.projectName}`,
          adminPath: `/admin/messages?tab=devis${data.id ? `&open=${data.id}` : ""}`,
          facts: [["Service", service], ["Budget", data.budget], ["Délai", data.deadline]],
          texts: [["Description du projet", data.projectDesc], ["Objectifs", data.projectGoals]],
        }),
        {
          eyebrow: "Nouvelle demande de devis",
          subtitle: [name, data.company].filter(Boolean).join(" · "),
          preheader: `${name} · ${service} · ${data.budget}`,
        }
      ),
    }),
    send({
      to: data.email,
      replyTo: ADMIN,
      subject: `Votre demande de devis a été reçue — ${SITE}`,
      html: wrap(
        `Merci ${data.firstName}, votre demande est bien arrivée.`,
        `${p(`Nous avons bien reçu votre demande de devis pour le projet <strong>${esc(data.projectName)}</strong>. Notre équipe l'étudie et revient vers vous sous 24 h.`)}
         ${section("Récapitulatif", facts([["Projet", data.projectName], ["Service", service], ["Budget", data.budget], ["Délai", data.deadline]]))}
         <div style="margin-top:24px;">${p("Une précision à ajouter ? Répondez simplement à cet e-mail.")}${signature}</div>`,
        { eyebrow: "Demande de devis reçue", preheader: "Notre équipe étudie votre projet et revient vers vous sous 24 h." }
      ),
    }),
  ]);
}

// ─── Candidature (job application) ───────────────────────────────────────────

export async function sendApplicationNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  position?: string | null;
  message: string;
}) {
  await Promise.all([
    send({
      to: ADMIN,
      replyTo: data.email,
      subject: `[${SITE}] Nouvelle candidature — ${data.name}`,
      html: wrap(
        data.name,
        adminBody({
          person: { name: data.name, email: data.email, phone: data.phone },
          replyLabel: "Répondre par e-mail",
          replySubject: `Votre candidature — ${SITE}`,
          adminPath: "/admin/careers",
          facts: [["Poste visé", data.position]],
          texts: [["Message", data.message]],
        }),
        { eyebrow: "Nouvelle candidature", subtitle: data.position ?? undefined, preheader: data.message.slice(0, 120) }
      ),
    }),
    send({
      to: data.email,
      replyTo: ADMIN,
      subject: `Votre candidature a été reçue — ${SITE}`,
      html: wrap(
        "Votre candidature est bien arrivée.",
        `${p(`Bonjour ${esc(data.name)},`)}
         ${p("Nous avons bien reçu votre candidature et nous l'examinerons avec attention.")}
         ${p("Si votre profil correspond à nos besoins, nous vous contacterons pour un entretien.")}
         ${signature}`,
        { eyebrow: "Candidature reçue" }
      ),
    }),
  ]);
}

// ─── Demande de partenariat ───────────────────────────────────────────────────

export async function sendPartnerNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  company: string;
  partnerType?: string | null;
  message: string;
}) {
  await Promise.all([
    send({
      to: ADMIN,
      replyTo: data.email,
      subject: `[${SITE}] Nouvelle demande de partenariat — ${data.company}`,
      html: wrap(
        data.company,
        adminBody({
          person: { name: data.name, company: data.company, email: data.email, phone: data.phone },
          replyLabel: "Répondre par e-mail",
          replySubject: `Votre demande de partenariat — ${SITE}`,
          adminPath: "/admin/partners",
          facts: [["Type de partenariat", data.partnerType]],
          texts: [["Message", data.message]],
        }),
        { eyebrow: "Nouvelle demande de partenariat", subtitle: data.name, preheader: data.message.slice(0, 120) }
      ),
    }),
    send({
      to: data.email,
      replyTo: ADMIN,
      subject: `Votre demande de partenariat a été reçue — ${SITE}`,
      html: wrap(
        "Votre demande de partenariat est bien arrivée.",
        `${p(`Bonjour ${esc(data.name)},`)}
         ${p("Nous avons bien reçu votre demande de partenariat et nous reviendrons vers vous prochainement.")}
         ${signature}`,
        { eyebrow: "Demande de partenariat reçue" }
      ),
    }),
  ]);
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function sendNewsletterConfirmation(email: string) {
  await send({
    to: email,
    subject: `Bienvenue dans la newsletter ${SITE} !`,
    html: wrap(
      "Votre inscription est confirmée.",
      `${p("Merci pour votre inscription à notre newsletter !")}
       ${p("Vous recevrez désormais nos dernières actualités, articles et offres directement dans votre boîte mail.")}
       ${signature}`,
      { eyebrow: "Newsletter" }
    ),
  });
}
