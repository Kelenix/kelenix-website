"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("kelenix_cookies");
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (data: ConsentState) => {
    localStorage.setItem("kelenix_cookies", JSON.stringify(data));
    localStorage.setItem("kelenix_cookies_date", new Date().toISOString());
    setVisible(false);
  };

  const acceptAll = () => save({ essential: true, analytics: true, marketing: true });
  const declineAll = () => save({ essential: true, analytics: false, marketing: false });
  const saveCustom = () => save(consent);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto",
        "bg-navy border border-white/10 rounded-2xl shadow-2xl",
        "animate-slide-up"
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center flex-shrink-0">
            <Cookie size={20} className="text-sky" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300 leading-relaxed">
              {t("message")}{" "}
              <Link href="/cookies" className="text-sky hover:underline">
                {t("policyLink")}
              </Link>
              .
            </p>
          </div>
          <button
            onClick={declineAll}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customization Panel */}
        {customizing && (
          <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-3">
            {(["essential", "analytics", "marketing"] as const).map((key) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm text-white font-medium capitalize">
                    {t(key)}
                  </span>
                  {key === "essential" && (
                    <span className="ml-2 text-xs text-gray-400">(requis)</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={consent[key]}
                    disabled={key === "essential"}
                    onChange={(e) => setConsent(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div
                    onClick={() => {
                      if (key !== "essential") {
                        setConsent(prev => ({ ...prev, [key]: !prev[key] }));
                      }
                    }}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors cursor-pointer",
                      consent[key] ? "bg-sky" : "bg-white/20",
                      key === "essential" && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5",
                      consent[key] ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={acceptAll}
            className="flex-1 sm:flex-none px-5 py-2 bg-sky text-white font-medium text-sm rounded-lg hover:bg-sky-dark transition-colors"
          >
            {t("accept")}
          </button>
          <button
            onClick={declineAll}
            className="flex-1 sm:flex-none px-5 py-2 bg-white/10 text-white font-medium text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/10"
          >
            {t("decline")}
          </button>
          <button
            onClick={() => setCustomizing(!customizing)}
            className="flex items-center gap-1.5 px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            {t("customize")}
            {customizing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {customizing && (
            <button
              onClick={saveCustom}
              className="px-5 py-2 bg-gold text-navy font-medium text-sm rounded-lg hover:bg-gold-dark transition-colors"
            >
              {t("save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
