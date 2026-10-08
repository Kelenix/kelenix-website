"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/tracking";
import { btnGhost, btnPrimary, input, label } from "@/components/site/styles";

export default function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", service: "", budget: "", message: "",
  });

  const services = [
    { value: "software", label: locale === "fr" ? "Développement Logiciel" : "Software Development" },
    { value: "web", label: locale === "fr" ? "Création de Site Web" : "Website Creation" },
    { value: "webapp", label: locale === "fr" ? "Application Web" : "Web Application" },
    { value: "mobile", label: locale === "fr" ? "Application Mobile" : "Mobile Application" },
    { value: "ai", label: locale === "fr" ? "Intelligence Artificielle" : "Artificial Intelligence" },
    { value: "consulting", label: locale === "fr" ? "Consulting IT" : "IT Consulting" },
    { value: "training", label: locale === "fr" ? "Formation" : "Training" },
  ];

  const budgets = [
    { value: "< 1000€", label: "< 1 000€" },
    { value: "1000-5000€", label: "1 000€ - 5 000€" },
    { value: "5000-10000€", label: "5 000€ - 10 000€" },
    { value: "10000-50000€", label: "10 000€ - 50 000€" },
    { value: "> 50000€", label: "> 50 000€" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        track({ name: "lead", source: "contact" });
        setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check size={30} strokeWidth={3} />
        </div>
        <h3 className="font-display text-3xl font-medium tracking-[-0.02em] text-navy">{locale === "fr" ? "Message envoyé !" : "Message sent!"}</h3>
        <p className="mt-2 text-muted">{t("success")}</p>
        <button type="button" onClick={() => setStatus("idle")} className={cn(btnGhost, "mt-7 px-6 py-3 text-[15px]")}>
          {locale === "fr" ? "Envoyer un autre message" : "Send another message"}
        </button>
      </div>
    );
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-first" className={label}>{t("firstName")} *</label>
          <input id="contact-first" type="text" required autoComplete="given-name" value={form.firstName} onChange={set("firstName")} className={input} />
        </div>
        <div>
          <label htmlFor="contact-last" className={label}>{t("lastName")} *</label>
          <input id="contact-last" type="text" required autoComplete="family-name" value={form.lastName} onChange={set("lastName")} className={input} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={label}>{t("email")} *</label>
          <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={input} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={label}>{t("phone")}</label>
          <input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={input} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-company" className={label}>{t("company")}</label>
          <input id="contact-company" type="text" autoComplete="organization" value={form.company} onChange={set("company")} className={input} />
        </div>
        <div>
          <label htmlFor="contact-service" className={label}>{t("service")}</label>
          <select id="contact-service" value={form.service} onChange={set("service")} className={input}>
            <option value="">{t("selectService")}</option>
            {services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-budget" className={label}>{t("budget")}</label>
        <select id="contact-budget" value={form.budget} onChange={set("budget")} className={input}>
          <option value="">{t("selectBudget")}</option>
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={label}>{t("message")} *</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          className={cn(input, "resize-none")}
          placeholder={locale === "fr" ? "Décrivez votre projet ou votre demande..." : "Describe your project or request..."}
        />
      </div>

      {status === "error" && (
        <div role="alert" className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          {t("error")}
        </div>
      )}

      <button type="submit" disabled={status === "loading"} className={cn(btnPrimary, "w-full")}>
        {status === "loading" ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send size={18} />}
        {status === "loading" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
