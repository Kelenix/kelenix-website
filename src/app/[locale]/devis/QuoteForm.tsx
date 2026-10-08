"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronRight, ChevronLeft, Check, Send, AlertCircle, Rocket,
  Code, Globe, Monitor, Smartphone, Brain, TrendingUp, GraduationCap, Sparkles,
  Sprout, Banknote, Wallet, Gem, Zap, Calendar, CalendarDays, CalendarRange, Infinity as InfinityIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/tracking";
import { btnDark, btnGhost, btnPrimary, input, label } from "@/components/site/styles";

type FormData = {
  serviceType: string;
  projectName: string;
  projectDesc: string;
  projectGoals: string;
  budget: string;
  deadline: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
};

const TOTAL_STEPS = 4;

export default function QuoteForm({ locale }: { locale: string }) {
  const t = useTranslations("quote.form");
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<FormData>({
    serviceType: "", projectName: "", projectDesc: "", projectGoals: "",
    budget: "", deadline: "", firstName: "", lastName: "", email: "", phone: "", company: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setData(d => ({ ...d, [field]: value }));

  const fr = locale === "fr";
  const services = [
    { value: "software", label: fr ? "Développement Logiciel" : "Software Development", desc: fr ? "Applications sur mesure" : "Custom applications", Icon: Code },
    { value: "web", label: fr ? "Site Web" : "Website", desc: fr ? "Vitrine, e-commerce" : "Showcase, e-commerce", Icon: Globe },
    { value: "webapp", label: fr ? "Application Web" : "Web App", desc: fr ? "Plateformes SaaS" : "SaaS platforms", Icon: Monitor },
    { value: "mobile", label: fr ? "App Mobile" : "Mobile App", desc: fr ? "iOS & Android" : "iOS & Android", Icon: Smartphone },
    { value: "ai", label: fr ? "Intelligence Artificielle" : "AI Solution", desc: fr ? "IA & automatisation" : "AI & automation", Icon: Brain },
    { value: "consulting", label: fr ? "Consulting IT" : "IT Consulting", desc: fr ? "Stratégie & audit" : "Strategy & audit", Icon: TrendingUp },
    { value: "training", label: fr ? "Formation" : "Training", desc: fr ? "Montée en compétences" : "Upskilling", Icon: GraduationCap },
    { value: "other", label: fr ? "Autre" : "Other", desc: fr ? "Parlons-en" : "Let's talk", Icon: Sparkles },
  ];

  const budgets = [
    { value: "< 1 000€", Icon: Sprout },
    { value: "1 000€ – 5 000€", Icon: Banknote },
    { value: "5 000€ – 10 000€", Icon: Wallet },
    { value: "10 000€ – 50 000€", Icon: Gem },
    { value: "> 50 000€", Icon: Rocket },
  ];
  const deadlines = [
    { value: fr ? "Urgent (< 1 mois)" : "Urgent (< 1 month)", Icon: Zap },
    { value: fr ? "1 – 3 mois" : "1 – 3 months", Icon: Calendar },
    { value: fr ? "3 – 6 mois" : "3 – 6 months", Icon: CalendarDays },
    { value: fr ? "6 – 12 mois" : "6 – 12 months", Icon: CalendarRange },
    { value: fr ? "Pas de contrainte" : "No constraint", Icon: InfinityIcon },
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Validation par étape : empêche d'avancer/envoyer avec des données invalides
  const canProceed = () => {
    if (step === 1) return data.serviceType !== "";
    if (step === 2) return data.projectName.trim() !== "" && data.projectDesc.trim().length >= 10;
    if (step === 3) return data.budget !== "";
    return true;
  };

  const fieldLabels: Record<string, string> =
    locale === "fr"
      ? {
          serviceType: "type de service",
          projectName: "nom du projet",
          projectDesc: "description du projet (min. 10 caractères)",
          budget: "budget",
          firstName: "prénom",
          lastName: "nom",
          email: "email",
        }
      : {
          serviceType: "service type",
          projectName: "project name",
          projectDesc: "project description (min. 10 characters)",
          budget: "budget",
          firstName: "first name",
          lastName: "last name",
          email: "email",
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Sur les étapes intermédiaires, "Entrée" fait avancer plutôt qu'envoyer
    if (step < TOTAL_STEPS) {
      if (canProceed()) nextStep();
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        track({ name: "lead", source: "devis" });
        return;
      }
      // Message d'erreur explicite selon le cas
      let msg =
        locale === "fr"
          ? "Une erreur est survenue. Veuillez réessayer."
          : "Something went wrong. Please try again.";
      if (res.status === 429) {
        msg =
          locale === "fr"
            ? "Trop de tentatives. Patientez une minute puis réessayez."
            : "Too many attempts. Please wait a minute and try again.";
      } else {
        try {
          const j = await res.json();
          if (
            res.status === 400 &&
            Array.isArray(j?.details) &&
            j.details.length > 0
          ) {
            const fields = [
              ...new Set(
                j.details
                  .map((d: { path?: string[] }) => {
                    const key = d?.path?.[0];
                    return key ? fieldLabels[key] ?? key : null;
                  })
                  .filter(Boolean)
              ),
            ];
            msg =
              (locale === "fr"
                ? "À corriger : "
                : "Please fix: ") + fields.join(", ") + ".";
          } else if (j?.error && typeof j.error === "string") {
            msg = j.error;
          }
        } catch {}
      }
      setErrorMsg(msg);
      setStatus("error");
    } catch {
      setErrorMsg(
        locale === "fr"
          ? "Erreur réseau. Vérifiez votre connexion internet."
          : "Network error. Please check your connection."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-10 text-center sm:py-14">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check size={30} strokeWidth={3} />
        </div>
        <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-navy">{t("successTitle")}</h2>
        <p className="mt-3 max-w-md text-muted">{t("successMessage")}</p>
      </div>
    );
  }

  // Tuile de choix (service, budget, délai) : même état sélectionné partout.
  const option = (selected: boolean) =>
    cn(
      "group relative cursor-pointer rounded-2xl border text-left transition-colors",
      selected ? "border-azure bg-azure/5 ring-1 ring-azure" : "border-line bg-white hover:border-sky/70"
    );
  const optionIcon = (selected: boolean) =>
    cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors", selected ? "bg-azure text-white" : "bg-mist text-azure");
  const stepTitle = "font-display text-2xl font-medium tracking-[-0.02em] text-navy sm:text-[1.75rem]";

  return (
    <form onSubmit={handleSubmit}>
      {/* Progression */}
      <div className="mb-8">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i + 1 <= step ? "bg-azure" : "bg-line")} />
          ))}
        </div>
        <p className="mt-2.5 text-sm text-muted">{locale === "fr" ? `Étape ${step} sur ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</p>
      </div>

      {/* Étape 1 : type de service */}
      {step === 1 && (
        <div>
          <h2 className={stepTitle}>{t("serviceType")}</h2>
          <p className="mb-6 mt-1.5 text-[15px] text-muted">{fr ? "Choisissez ce qui correspond le mieux à votre besoin." : "Pick what best matches your need."}</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {services.map((s) => {
              const selected = data.serviceType === s.value;
              return (
                <button key={s.value} type="button" onClick={() => update("serviceType", s.value)} aria-pressed={selected} className={cn(option(selected), "flex flex-col gap-3 p-4")}>
                  <span className={optionIcon(selected)}>
                    <s.Icon size={22} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold leading-tight text-navy">{s.label}</span>
                    <span className="mt-1 block text-[13px] leading-tight text-muted">{s.desc}</span>
                  </span>
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-azure text-white">
                      <Check size={12} strokeWidth={3.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Étape 2 : le projet */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className={stepTitle}>{fr ? "Décrivez votre projet" : "Describe your project"}</h2>
            <p className="mt-1.5 text-[15px] text-muted">{fr ? "Plus c'est précis, plus le devis sera juste." : "The more detail you give, the more accurate the quote."}</p>
          </div>
          <div>
            <label htmlFor="quote-name" className={label}>{t("projectName")} *</label>
            <input id="quote-name" type="text" required value={data.projectName} onChange={(e) => update("projectName", e.target.value)} className={input} />
          </div>
          <div>
            <label htmlFor="quote-desc" className={label}>{t("projectDesc")} *</label>
            <textarea id="quote-desc" required rows={4} value={data.projectDesc} onChange={(e) => update("projectDesc", e.target.value)} className={cn(input, "resize-none")} />
            <p className={cn("mt-1.5 text-[13px]", data.projectDesc.trim().length > 0 && data.projectDesc.trim().length < 10 ? "text-red-600" : "text-muted")}>
              {locale === "fr"
                ? `${data.projectDesc.trim().length} / 10 caractères minimum`
                : `${data.projectDesc.trim().length} / 10 characters minimum`}
            </p>
          </div>
          <div>
            <label htmlFor="quote-goals" className={label}>{t("projectGoals")}</label>
            <textarea id="quote-goals" rows={3} value={data.projectGoals} onChange={(e) => update("projectGoals", e.target.value)} className={cn(input, "resize-none")} />
          </div>
        </div>
      )}

      {/* Étape 3 : budget et délais */}
      {step === 3 && (
        <div className="space-y-7">
          <div>
            <h2 className={stepTitle}>{fr ? "Budget & délais" : "Budget & timeline"}</h2>
            <p className="mt-1.5 text-[15px] text-muted">{fr ? "Une estimation suffit — tout reste négociable." : "An estimate is enough — everything is negotiable."}</p>
          </div>
          {[
            { field: "budget" as const, title: `${t("budget")} *`, options: budgets },
            { field: "deadline" as const, title: t("deadline"), options: deadlines },
          ].map((group) => (
            <fieldset key={group.field}>
              <legend className="mb-3 text-sm font-medium text-navy">{group.title}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.options.map((o) => {
                  const selected = data[group.field] === o.value;
                  return (
                    <button key={o.value} type="button" onClick={() => update(group.field, o.value)} aria-pressed={selected} className={cn(option(selected), "flex items-center gap-3 p-3")}>
                      <span className={optionIcon(selected)}>
                        <o.Icon size={20} />
                      </span>
                      <span className="flex-1 text-[15px] font-semibold text-navy">{o.value}</span>
                      {selected && (
                        <span className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-azure text-white">
                          <Check size={12} strokeWidth={3.5} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {/* Étape 4 : coordonnées */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <h2 className={stepTitle}>{fr ? "Vos coordonnées" : "Your contact details"}</h2>
            <p className="mt-1.5 text-[15px] text-muted">{fr ? "On vous répond sous 24h — vos données restent confidentielles." : "We reply within 24h — your data stays private."}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quote-first" className={label}>{t("firstName")} *</label>
              <input id="quote-first" type="text" required autoComplete="given-name" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor="quote-last" className={label}>{t("lastName")} *</label>
              <input id="quote-last" type="text" required autoComplete="family-name" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} className={input} />
            </div>
          </div>
          <div>
            <label htmlFor="quote-email" className={label}>{t("email")} *</label>
            <input id="quote-email" type="email" required autoComplete="email" value={data.email} onChange={(e) => update("email", e.target.value)} className={input} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quote-phone" className={label}>{t("phone")}</label>
              <input id="quote-phone" type="tel" autoComplete="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor="quote-company" className={label}>{t("company")}</label>
              <input id="quote-company" type="text" autoComplete="organization" value={data.company} onChange={(e) => update("company", e.target.value)} className={input} />
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {status === "error" && errorMsg && (
        <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className={cn(btnGhost, "px-5 py-3 text-[15px]")}>
            <ChevronLeft size={16} /> {t("prev")}
          </button>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS ? (
          <button type="button" onClick={nextStep} disabled={!canProceed()} className={cn(btnDark, "px-6 py-3 text-[15px]")}>
            {t("next")} <ChevronRight size={16} />
          </button>
        ) : (
          <button type="submit" disabled={status === "loading"} className={cn(btnPrimary, "px-6 py-3 text-[15px]")}>
            {status === "loading" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send size={16} />}
            {t("submit")}
          </button>
        )}
      </div>
    </form>
  );
}
