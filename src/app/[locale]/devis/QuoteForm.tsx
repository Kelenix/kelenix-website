"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, ChevronLeft, CheckCircle, Send, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const services = [
    { value: "software", label: locale === "fr" ? "Développement Logiciel" : "Software Development", icon: "💻" },
    { value: "web", label: locale === "fr" ? "Site Web" : "Website", icon: "🌐" },
    { value: "webapp", label: locale === "fr" ? "Application Web" : "Web App", icon: "📱" },
    { value: "mobile", label: locale === "fr" ? "App Mobile" : "Mobile App", icon: "📲" },
    { value: "ai", label: locale === "fr" ? "Intelligence Artificielle" : "AI Solution", icon: "🤖" },
    { value: "consulting", label: locale === "fr" ? "Consulting IT" : "IT Consulting", icon: "📊" },
    { value: "training", label: locale === "fr" ? "Formation" : "Training", icon: "🎓" },
  ];

  const budgets = ["< 1 000€", "1 000€ – 5 000€", "5 000€ – 10 000€", "10 000€ – 50 000€", "> 50 000€"];
  const deadlines = [
    locale === "fr" ? "Urgent (< 1 mois)" : "Urgent (< 1 month)",
    locale === "fr" ? "1 – 3 mois" : "1 – 3 months",
    locale === "fr" ? "3 – 6 mois" : "3 – 6 months",
    locale === "fr" ? "6 – 12 mois" : "6 – 12 months",
    locale === "fr" ? "Pas de contrainte" : "No constraint",
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
      <div className="flex flex-col items-center text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="font-heading font-bold text-navy text-2xl mb-3">{t("successTitle")}</h2>
        <p className="text-gray-500 max-w-md">{t("successMessage")}</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/10 transition-all";

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-1.5 rounded-full mx-0.5 transition-all",
                i + 1 <= step ? "bg-sky" : "bg-gray-100"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 text-right">{locale === "fr" ? `Étape ${step} sur ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</p>
      </div>

      {/* Step 1: Service Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-navy text-xl mb-6">{t("serviceType")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {services.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => update("serviceType", s.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-sm font-medium",
                  data.serviceType === s.value
                    ? "border-sky bg-sky/5 text-sky"
                    : "border-gray-100 hover:border-sky/30 text-gray-700"
                )}
              >
                <span className="text-2xl">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Project */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-heading font-bold text-navy text-xl mb-6">{locale === "fr" ? "Décrivez votre projet" : "Describe your project"}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("projectName")} *</label>
            <input type="text" required value={data.projectName} onChange={e => update("projectName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("projectDesc")} *</label>
            <textarea required rows={4} value={data.projectDesc} onChange={e => update("projectDesc", e.target.value)} className={cn(inputClass, "resize-none")} />
            <p className={cn(
              "text-xs mt-1.5",
              data.projectDesc.trim().length > 0 && data.projectDesc.trim().length < 10 ? "text-red-500" : "text-gray-400"
            )}>
              {locale === "fr"
                ? `${data.projectDesc.trim().length} / 10 caractères minimum`
                : `${data.projectDesc.trim().length} / 10 characters minimum`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("projectGoals")}</label>
            <textarea rows={3} value={data.projectGoals} onChange={e => update("projectGoals", e.target.value)} className={cn(inputClass, "resize-none")} />
          </div>
        </div>
      )}

      {/* Step 3: Budget & Deadline */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-navy text-xl mb-6">{locale === "fr" ? "Budget & délais" : "Budget & timeline"}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t("budget")} *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {budgets.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => update("budget", b)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all",
                    data.budget === b ? "border-sky bg-sky/5 text-sky" : "border-gray-100 hover:border-sky/30 text-gray-700"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t("deadline")}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deadlines.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update("deadline", d)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all",
                    data.deadline === d ? "border-sky bg-sky/5 text-sky" : "border-gray-100 hover:border-sky/30 text-gray-700"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contact */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="font-heading font-bold text-navy text-xl mb-6">{locale === "fr" ? "Vos coordonnées" : "Your contact details"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("firstName")} *</label>
              <input type="text" required value={data.firstName} onChange={e => update("firstName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("lastName")} *</label>
              <input type="text" required value={data.lastName} onChange={e => update("lastName", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")} *</label>
            <input type="email" required value={data.email} onChange={e => update("email", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("phone")}</label>
              <input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("company")}</label>
              <input type="text" value={data.company} onChange={e => update("company", e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {status === "error" && errorMsg && (
        <div className="mt-6 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <ChevronLeft size={16} /> {t("prev")}
          </button>
        ) : <div />}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky text-white rounded-xl text-sm font-semibold hover:bg-sky-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("next")} <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center gap-2 px-8 py-3 bg-gold text-navy rounded-xl font-bold hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {status === "loading" ? (
              <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            ) : <Send size={16} />}
            {t("submit")}
          </button>
        )}
      </div>
    </form>
  );
}
