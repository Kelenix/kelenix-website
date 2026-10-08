"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, MOTION, EASE } from "@/lib/gsap";

type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const banner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!visible) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from(banner.current, { y: 40, opacity: 0, duration: 0.5, ease: EASE });
      });
    },
    { dependencies: [visible] }
  );
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
      ref={banner}
      className={cn(
        "fixed bottom-[calc(1rem+var(--quote-bar,0px))] left-4 right-4 z-50 max-w-2xl mx-auto",
        "bg-white border border-line rounded-3xl shadow-[0_24px_60px_-24px_rgba(11,31,58,0.4)]"
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center flex-shrink-0">
            <Cookie size={20} className="text-azure" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted leading-relaxed">
              {t("message")}{" "}
              <Link href="/cookies" className="font-medium text-azure hover:underline">
                {t("policyLink")}
              </Link>
              .
            </p>
          </div>
          <button
            onClick={declineAll}
            className="text-muted hover:text-navy transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customization Panel */}
        {customizing && (
          <div className="bg-mist rounded-2xl p-4 mb-4 space-y-3">
            {(["essential", "analytics", "marketing"] as const).map((key) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm text-navy font-medium capitalize">
                    {t(key)}
                  </span>
                  {key === "essential" && (
                    <span className="ml-2 text-xs text-muted">(requis)</span>
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
                      consent[key] ? "bg-azure" : "bg-[#C5D0DE]",
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
            className="flex-1 sm:flex-none px-5 py-2.5 bg-navy text-white font-semibold text-sm rounded-full hover:bg-azure transition-colors cursor-pointer"
          >
            {t("accept")}
          </button>
          <button
            onClick={declineAll}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-navy font-semibold text-sm rounded-full hover:bg-mist transition-colors border border-line cursor-pointer"
          >
            {t("decline")}
          </button>
          <button
            onClick={() => setCustomizing(!customizing)}
            className="flex items-center gap-1.5 px-4 py-2 text-muted hover:text-navy text-sm transition-colors cursor-pointer"
          >
            {t("customize")}
            {customizing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {customizing && (
            <button
              onClick={saveCustom}
              className="px-5 py-2.5 bg-azure text-white font-semibold text-sm rounded-full hover:bg-azure-dark transition-colors cursor-pointer"
            >
              {t("save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
