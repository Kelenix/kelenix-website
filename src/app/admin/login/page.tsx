"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Logo from "@/components/ui/Logo";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { input, label } from "@/components/admin/styles";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou mot de passe incorrect.");
      setLoading(false);
    } else {
      // Chargement complet : la coque de l'admin démarre avec la session toute neuve.
      window.location.assign("/admin");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-5 py-10">
      {/* Halo bleu, comme sur l'accueil du site */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-azure/20 via-sky/10 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[140%] -translate-x-1/2 rounded-[100%] bg-azure/25 blur-3xl" />

      <div className="relative w-full max-w-[26rem]">
        <div className="mb-8 text-center">
          <Logo tone="light" size="text-2xl" />
          <h1 className="mt-7 font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.03em] text-navy sm:text-[2.5rem]">Espace d&apos;administration</h1>
          <p className="mt-2 text-sm text-muted">Connectez-vous pour gérer le site et répondre aux demandes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-28px_rgba(11,31,58,0.35)] sm:p-8">
          <div>
            <label htmlFor="login-email" className={label}>E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="login-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={cn(input, "py-3 pl-10")}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className={label}>Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={cn(input, "py-3 pl-10 pr-12")}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-navy"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-azure py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-azure-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            Se connecter
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">&copy; {new Date().getFullYear()} Kelenix Tech. Accès réservé.</p>
      </div>
    </div>
  );
}
