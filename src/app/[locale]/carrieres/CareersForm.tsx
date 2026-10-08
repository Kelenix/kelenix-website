"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/tracking";
import { btnPrimary, input, label } from "@/components/site/styles";

export default function CareersForm({ locale }: { locale: string }) {
  const t = useTranslations("careers");
  const isEn = locale === "en";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        track({ name: "candidature" });
        setForm({ name: "", email: "", phone: "", position: "", message: "" });
      } else {
        setError(isEn ? "An error occurred. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError(isEn ? "An error occurred. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check size={30} strokeWidth={3} />
        </div>
        <h3 className="font-display text-3xl font-medium tracking-[-0.02em] text-navy">{isEn ? "Application submitted!" : "Candidature envoyée !"}</h3>
        <p className="mt-2 text-muted">
          {isEn
            ? "Thank you! We'll review your application and get back to you soon."
            : "Merci ! Nous examinerons votre candidature et vous répondrons prochainement."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="career-name" className={label}>{t("form.name")} *</label>
          <input id="career-name" type="text" name="name" autoComplete="name" value={form.name} onChange={handleChange} required className={input} />
        </div>
        <div>
          <label htmlFor="career-email" className={label}>{t("form.email")} *</label>
          <input id="career-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required className={input} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="career-phone" className={label}>{t("form.phone")}</label>
          <input id="career-phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} className={input} />
        </div>
        <div>
          <label htmlFor="career-position" className={label}>{t("form.position")}</label>
          <input
            id="career-position"
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder={isEn ? "e.g. Full-Stack Developer" : "ex. Développeur Full-Stack"}
            className={input}
          />
        </div>
      </div>
      <div>
        <label htmlFor="career-message" className={label}>{t("form.message")} *</label>
        <textarea
          id="career-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder={isEn ? "Tell us about your experience and motivation..." : "Parlez-nous de votre expérience et de votre motivation..."}
          className={cn(input, "resize-none")}
        />
      </div>
      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className={cn(btnPrimary, "w-full")}>
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {isEn ? "Sending..." : "Envoi en cours..."}
          </>
        ) : (
          <>
            <Send size={18} />
            {t("form.submit")}
          </>
        )}
      </button>
    </form>
  );
}
