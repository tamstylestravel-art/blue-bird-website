"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select 
      value={locale}
      onChange={handleLanguageChange}
      disabled={isPending}
      className="px-3 py-1.5 rounded-md glass-panel text-[var(--foreground)] text-sm font-medium hover:bg-[var(--border)] transition-colors border border-[var(--border)] outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer appearance-none bg-white"
    >
      <option value="en">English (EN)</option>
      <option value="th">ภาษาไทย (TH)</option>
    </select>
  );
}
