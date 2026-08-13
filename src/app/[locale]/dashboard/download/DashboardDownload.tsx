"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardDownload() {
  const t = useTranslations("Dashboard");

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">{t("download")}</h1>
          <p className="text-gray-500 mt-2">Get the latest version of Blue Bird Composer for Premiere Pro.</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
          <Download size={32} className="text-brand-blue" />
        </div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Blue Bird Composer v1.0.0</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Compatible with Adobe Premiere Pro 2023 and above. Windows and macOS supported.
        </p>
        
        <button className="px-8 py-3 rounded-xl bg-[var(--color-brand-blue)] text-white font-semibold shadow-lg shadow-brand-blue/30 hover:bg-[var(--color-brand-blue-dark)] focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
          Download Extension (.zxp)
        </button>
      </div>
    </div>
  );
}
