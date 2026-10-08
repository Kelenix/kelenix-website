"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/tracking";
import { btnPrimary, input, label } from "@/components/site/styles";

type PartnerType = { valueFr: string; valueEn: string };

export default function PartnerForm({
  locale,
  partnerTypes,
}: {
  locale: string;
  partnerTypes: PartnerType[];
}) {
  const t = useTranslations("partners");
  const isEn = locale === "en";

  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    partnerType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        track({ name: "lead", source: "partenaire" });
        setForm({ company: "", name: "", email: "", phone: "", partnerType: "", message: "" });
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
        <h3 className="font-display text-3xl font-medium tracking-[-0.02em] text-navy">{isEn ? "Request submitted!" : "Demande envoyée !"}</h3>
        <p className="mt-2 text-muted">
          {isEn
            ? "Thank you! Our partner team will contact you within 48 hours."
            : "Merci ! Notre équipe partenaires vous contactera sous 48h."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="partner-company" className={label}>{t("form.company")} *</label>
          <input id="partner-company" type="text" name="company" autoComplete="organization" value={form.company} onChange={handleChange} required className={input} />
        </div>
        <div>
          <label htmlFor="partner-name" className={label}>{t("form.name")} *</label>
          <input id="partner-name" type="text" name="name" autoComplete="name" value={form.name} onChange={handleChange} required className={input} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="partner-email" className={label}>{t("form.email")} *</label>
          <input id="partner-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required className={input} />
        </div>
        <div>
          <label htmlFor="partner-phone" className={label}>{t("form.phone")}</label>
          <input id="partner-phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="partner-type" className={label}>{t("form.partnerType")} *</label>
        <select id="partner-type" name="partnerType" value={form.partnerType} onChange={handleChange} required className={input}>
          <option value="">{isEn ? "Select a type..." : "Sélectionner un type..."}</option>
          {partnerTypes.map((pt) => (
            <option key={pt.valueFr} value={isEn ? pt.valueEn : pt.valueFr}>
              {isEn ? pt.valueEn : pt.valueFr}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="partner-message" className={label}>{t("form.message")} *</label>
        <textarea
          id="partner-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={isEn ? "Describe your partnership project..." : "Décrivez votre projet de partenariat..."}
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
