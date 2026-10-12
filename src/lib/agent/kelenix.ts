import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";
import { notifyAdmins } from "@/lib/push";
import { sendQuoteNotification } from "@/lib/email";
import { QUOTE_BUDGETS, QUOTE_DEADLINES, QUOTE_SERVICES } from "@/lib/quote-options";
import type { Tenant } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kelenix.com";

// Kelenix Tech, première entreprise servie par l'assistant. Tout vient du contenu géré dans l'admin
// (services, FAQ, chiffres, coordonnées) : l'assistant suit le site sans texte à maintenir ici.
export const kelenix: Tenant = {
  id: "kelenix",
  // Haiku 5.5 : rapide et économique, choisi par Lionel. AGENT_MODEL permet d'en essayer un autre.
  model: process.env.AGENT_MODEL || "claude-haiku-5-5",
  website: BASE_URL,

  leadOptions: (locale) => ({
    categories: QUOTE_SERVICES.map((service) => ({ value: service.value, label: service[locale] })),
    budgets: [...QUOTE_BUDGETS],
    timelines: [...QUOTE_DEADLINES[locale]],
  }),

  async loadKnowledge(locale) {
    const fr = locale === "fr";
    // Tri stable : un texte identique d'une conversation à l'autre profite du cache de l'API.
    const [services, faqs, settings, stats] = await Promise.all([
      prisma.service.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { titleFr: true, titleEn: true, shortDescFr: true, shortDescEn: true },
      }),
      prisma.faq.findMany({
        where: { published: true },
        orderBy: [{ category: "asc" }, { order: "asc" }, { id: "asc" }],
        select: { questionFr: true, questionEn: true, answerFr: true, answerEn: true },
      }),
      prisma.siteSettings.findMany({ where: { key: { in: ["company_email", "company_phone", "company_whatsapp"] } } }),
      getSiteStats(),
    ]);
    const s = Object.fromEntries(settings.map((row) => [row.key, row.value]));

    return {
      name: "Kelenix Tech",
      pitch: fr
        ? "Kelenix Tech accompagne les entreprises dans leur transformation numérique : développement logiciel, sites et applications web, applications mobiles, intelligence artificielle, conseil et formation."
        : "Kelenix Tech supports businesses in their digital transformation: software development, websites and web apps, mobile apps, artificial intelligence, consulting and training.",
      facts: fr
        ? [
            `Année de création : ${stats.founded}`,
            `Projets réalisés : ${stats.projects}`,
            `Clients accompagnés : ${stats.clients}`,
            `Clients satisfaits : ${stats.satisfaction}`,
            `Délai de réponse aux demandes : ${stats.response}`,
          ]
        : [
            `Founded: ${stats.founded}`,
            `Projects delivered: ${stats.projects}`,
            `Clients served: ${stats.clients}`,
            `Satisfied clients: ${stats.satisfaction}`,
            `Response time to requests: ${stats.response}`,
          ],
      services: services.map((service) => ({
        title: fr ? service.titleFr : service.titleEn,
        summary: fr ? service.shortDescFr : service.shortDescEn,
      })),
      faq: faqs.map((entry) => ({
        question: fr ? entry.questionFr : entry.questionEn,
        answer: fr ? entry.answerFr : entry.answerEn,
      })),
      // Seules les coordonnées réellement saisies dans l'admin sont données au visiteur.
      contacts: [
        `${fr ? "Formulaire de devis" : "Quote form"} : ${BASE_URL}/${locale}/devis`,
        `${fr ? "Page contact" : "Contact page"} : ${BASE_URL}/${locale}/contact`,
        s.company_whatsapp && `WhatsApp : https://wa.me/${s.company_whatsapp}`,
        s.company_email && `E-mail : ${s.company_email}`,
        s.company_phone && `${fr ? "Téléphone" : "Phone"} : ${s.company_phone}`,
      ].filter((line): line is string => Boolean(line)),
    };
  },

  // Une demande recueillie par l'assistant suit le même circuit qu'un devis du formulaire :
  // elle arrive dans Admin → Messages → Devis, avec notification et e-mails.
  async saveLead(lead, existingId) {
    const data = {
      serviceType: lead.category,
      projectName: lead.title,
      projectDesc: lead.need,
      projectGoals: lead.goals,
      budget: lead.budget,
      deadline: lead.timeline,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: "assistant",
    };

    if (existingId) {
      const { count } = await prisma.quoteRequest.updateMany({ where: { id: existingId }, data });
      if (count > 0) return existingId;
    }

    const created = await prisma.quoteRequest.create({ data, select: { id: true } });
    // La réponse au visiteur n'attend ni la notification ni les e-mails (aucun des deux ne lève d'erreur).
    void notifyAdmins({
      title: `Nouveau prospect via l'assistant — ${`${lead.firstName} ${lead.lastName}`.trim()}`,
      body: `${lead.title} · ${lead.budget}`,
      url: `/admin/messages?tab=devis&open=${created.id}`,
    });
    void sendQuoteNotification({ ...data, id: created.id });
    return created.id;
  },
};
