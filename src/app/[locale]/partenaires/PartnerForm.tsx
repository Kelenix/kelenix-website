"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle, Loader2 } from "lucide-react";

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
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="font-heading text-2xl font-extrabold text-navy mb-3">
          {isEn ? "Request submitted!" : "Demande envoyée !"}
        </h3>
        <p className="text-gray-500">
          {isEn
            ? "Thank you! Our partner team will contact you within 48 hours."
            : "Merci ! Notre équipe partenaires vous contactera sous 48h."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">{t("form.company")} *</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">{t("form.name")} *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">{t("form.email")} *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">{t("form.phone")}</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">{t("form.partnerType")} *</label>
        <select
          name="partnerType"
          value={form.partnerType}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all bg-white"
        >
          <option value="">{isEn ? "Select a type..." : "Sélectionner un type..."}</option>
          {partnerTypes.map((pt) => (
            <option key={pt.valueFr} value={isEn ? pt.valueEn : pt.valueFr}>
              {isEn ? pt.valueEn : pt.valueFr}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">{t("form.message")} *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={isEn ? "Describe your partnership project..." : "Décrivez votre projet de partenariat..."}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 transition-all resize-none"
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-sky text-white font-bold rounded-xl hover:bg-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
      >
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
