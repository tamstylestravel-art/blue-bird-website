"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const t = useTranslations("Cookie");

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
    // Here you would typically initialize analytics scripts (e.g. Google Analytics)
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in-up pointer-events-none flex justify-center">
      <div className="bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border)] shadow-2xl rounded-2xl p-6 md:p-8 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-[var(--color-brand-blue)] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

        <div className="flex-1 relative z-10">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
            {t("title")}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            {t("description")}
            <Link href="/privacy" className="text-[var(--color-brand-blue)] hover:underline ml-2 whitespace-nowrap">
              {t("policy")}
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <button
            onClick={declineCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-[var(--border)] text-gray-400 hover:text-[var(--foreground)] hover:bg-white/5 transition-all text-sm font-medium"
          >
            {t("decline")}
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-blue-dark)] shadow-lg shadow-brand-blue/20 transition-all text-sm font-medium transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
