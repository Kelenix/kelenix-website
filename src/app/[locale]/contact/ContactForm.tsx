"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle, AlertCircle, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

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
        setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={56} className="text-green-500 mb-4" />
        <h3 className="font-heading font-bold text-navy text-xl mb-2">{locale === "fr" ? "Message envoyé !" : "Message sent!"}</h3>
        <p className="text-gray-500">{t("success")}</p>
        <button onClick={() => setStatus("idle")} className="mt-6 px-6 py-2.5 bg-sky text-white rounded-xl text-sm font-medium">
          {locale === "fr" ? "Envoyer un autre message" : "Send another message"}
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/10 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("firstName")} *</label>
          <input type="text" required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("lastName")} *</label>
          <input type="text" required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")} *</label>
          <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("phone")}</label>
          <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("company")}</label>
          <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("service")}</label>
          <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className={inputClass}>
            <option value="">{t("selectService")}</option>
            {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("budget")}</label>
        <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className={inputClass}>
          <option value="">{t("selectBudget")}</option>
          {budgets.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("message")} *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className={cn(inputClass, "resize-none")}
          placeholder={locale === "fr" ? "Décrivez votre projet ou votre demande..." : "Describe your project or request..."}
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <AlertCircle size={16} />
          {t("error")}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-sky text-white font-bold rounded-xl hover:bg-sky-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === "loading" ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send size={18} />
        )}
        {status === "loading" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
