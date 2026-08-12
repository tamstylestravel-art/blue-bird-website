"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'th' ? 'en' : 'th';
    
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button 
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-3 py-1.5 rounded-md glass-panel text-[var(--foreground)] text-sm font-medium hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
    >
      {locale === 'th' ? 'EN' : 'TH'}
    </button>
  );
}
