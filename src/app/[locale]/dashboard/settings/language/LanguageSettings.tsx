"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";
import { Check } from "lucide-react";

export default function LanguageSettings() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const languages = [
    { code: "th", name: "ภาษาไทย", description: "Thai" },
    { code: "en", name: "English", description: "English" },
    { code: "ja", name: "日本語", description: "Japanese" },
  ];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Language / ภาษา</h2>
      
      <div className="space-y-4 max-w-xl">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            disabled={isPending}
            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
              locale === lang.code
                ? "border-sky-500 bg-sky-500/10"
                : "border-[var(--border)] hover:border-sky-500/50 hover:bg-[var(--sidebar-border)]"
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col items-start">
              <span className={`font-medium ${locale === lang.code ? "text-sky-500" : ""}`}>
                {lang.name}
              </span>
              <span className="text-sm text-gray-500">{lang.description}</span>
            </div>
            
            {locale === lang.code && (
              <div className="text-sky-500">
                <Check size={20} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
