"use client";

import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function SettingsTabs() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  const tabs = [
    { name: t("profile", { defaultMessage: "Profile" }), href: "/dashboard/settings" },
    { name: t("languages", { defaultMessage: "Languages" }), href: "/dashboard/settings/language" },
  ];

  return (
    <div className="flex space-x-6 border-b border-[var(--border)] mt-4">
      {tabs.map((tab) => {
        // Because href might match "/dashboard/settings", we need exact match for it
        // and startsWith for subpaths, but since we only have 2 paths, exact match is fine.
        const isActive = pathname === tab.href;
        
        return (
          <Link
            key={tab.href}
            href={tab.href as any}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              isActive 
                ? "text-sky-500" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.name}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-t-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
