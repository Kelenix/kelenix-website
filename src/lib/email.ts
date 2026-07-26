import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM ?? "Kelenix Tech <noreply@kelenix.com>";
const ADMIN = process.env.ADMIN_EMAIL ?? "admin@kelenix.com";
const SITE = process.env.NEXT_PUBLIC_SITE_NAME ?? "Kelenix Tech";

function wrap(title: string, body: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
  .card{max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .header{background:#0f172a;color:#fff;padding:24px 32px}
  .header h1{margin:0;font-size:20px}
  .body{padding:32px}
  .body p{color:#374151;line-height:1.6;margin:0 0 12px}
  .field{margin-bottom:16px}
  .label{font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
  .value{color:#111827;margin-top:4px}
  .footer{background:#f9fafb;padding:16px 32px;font-size:12px;color:#9ca3af;text-align:center}
  .divider{border:none;border-top:1px solid #e5e7eb;margin:20px 0}
</style></head><body>
<div class="card">
  <div class="header"><h1>${SITE} — ${title}</h1></div>
  <div class="body">${body}</div>
  <div class="footer">© ${new Date().getFullYear()} ${SITE} · Ce message a été généré automatiquement.</div>
</div></body></html>`;
}

function field(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<div class="field"><div class="label">${label}</div><div class="value">${value}</div></div>`;
}

async function send(options: nodemailer.SendMailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP_USER / SMTP_PASS not set — email skipped");
    return;
  }
  try {
    await transporter.sendMail({ from: FROM, ...options });
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
  await Promise.all([
    send({
      to: ADMIN,
      subject: `[${SITE}] Nouveau message de contact — ${data.firstName} ${data.lastName}`,
      html: wrap(
        "Nouveau message de contact",
        `${field("Nom", `${data.firstName} ${data.lastName}`)}
         ${field("Email", data.email)}
         ${field("Téléphone", data.phone)}
         ${field("Entreprise", data.company)}
         ${field("Service", data.service)}
         ${field("Budget", data.budget)}
         <hr class="divider"/>
         ${field("Message", data.message.replace(/\n/g, "<br/>"))}`
      ),
    }),
    send({
      to: data.email,
      subject: `Votre message a bien été reçu — ${SITE}`,
      html: wrap(
        "Confirmation de réception",
        `<p>Bonjour ${data.firstName},</p>
         <p>Nous avons bien reçu votre message et nous vous répondrons dans les meilleurs délais.</p>
         <p>Cordialement,<br/><strong>L'équipe ${SITE}</strong></p>`
      ),
    }),
  ]);
}

// ─── Devis (quote request) ────────────────────────────────────────────────────

export async function sendQuoteNotification(data: {
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
  await Promise.all([
    send({
      to: ADMIN,
      subject: `[${SITE}] Nouvelle demande de devis — ${data.projectName}`,
      html: wrap(
        "Nouvelle demande de devis",
        `${field("Nom", `${data.firstName} ${data.lastName}`)}
         ${field("Email", data.email)}
         ${field("Téléphone", data.phone)}
         ${field("Entreprise", data.company)}
         <hr class="divider"/>
         ${field("Service", data.serviceType)}
         ${field("Projet", data.projectName)}
         ${field("Description", data.projectDesc.replace(/\n/g, "<br/>"))}
         ${field("Objectifs", data.projectGoals?.replace(/\n/g, "<br/>"))}
         ${field("Budget", data.budget)}
         ${field("Délai", data.deadline)}`
      ),
    }),
    send({
      to: data.email,
      subject: `Votre demande de devis a été reçue — ${SITE}`,
      html: wrap(
        "Demande de devis reçue",
        `<p>Bonjour ${data.firstName},</p>
         <p>Nous avons bien reçu votre demande de devis pour le projet <strong>${data.projectName}</strong>.</p>
         <p>Notre équipe l'étudiera et vous contactera très prochainement.</p>
         <p>Cordialement,<br/><strong>L'équipe ${SITE}</strong></p>`
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
      subject: `[${SITE}] Nouvelle candidature — ${data.name}`,
      html: wrap(
        "Nouvelle candidature",
        `${field("Nom", data.name)}
         ${field("Email", data.email)}
         ${field("Téléphone", data.phone)}
         ${field("Poste visé", data.position)}
         <hr class="divider"/>
         ${field("Message", data.message.replace(/\n/g, "<br/>"))}`
      ),
    }),
    send({
      to: data.email,
      subject: `Votre candidature a été reçue — ${SITE}`,
      html: wrap(
        "Candidature reçue",
        `<p>Bonjour ${data.name},</p>
         <p>Nous avons bien reçu votre candidature et nous l'examinerons avec attention.</p>
         <p>Si votre profil correspond à nos besoins, nous vous contacterons pour un entretien.</p>
         <p>Cordialement,<br/><strong>L'équipe ${SITE}</strong></p>`
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
      subject: `[${SITE}] Nouvelle demande de partenariat — ${data.company}`,
      html: wrap(
        "Nouvelle demande de partenariat",
        `${field("Contact", data.name)}
         ${field("Entreprise", data.company)}
         ${field("Email", data.email)}
         ${field("Téléphone", data.phone)}
         ${field("Type de partenariat", data.partnerType)}
         <hr class="divider"/>
         ${field("Message", data.message.replace(/\n/g, "<br/>"))}`
      ),
    }),
    send({
      to: data.email,
      subject: `Votre demande de partenariat a été reçue — ${SITE}`,
      html: wrap(
        "Demande de partenariat reçue",
        `<p>Bonjour ${data.name},</p>
         <p>Nous avons bien reçu votre demande de partenariat et nous reviendrons vers vous prochainement.</p>
         <p>Cordialement,<br/><strong>L'équipe ${SITE}</strong></p>`
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
      "Inscription confirmée",
      `<p>Merci pour votre inscription à notre newsletter !</p>
       <p>Vous recevrez désormais nos dernières actualités, articles et offres directement dans votre boîte mail.</p>
       <p>Cordialement,<br/><strong>L'équipe ${SITE}</strong></p>`
    ),
  });
}
