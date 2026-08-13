"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardOverview() {
  const t = useTranslations("Dashboard");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">{t("overview")}</h1>
          <p className="text-gray-500 mt-2">{t("welcome")}<span className="font-semibold text-[var(--foreground)]">{user?.email}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">{t("status")}</h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-medium">
            {t("freePlan")}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            You are currently on the Free Plan. Upgrade to Pro for unlimited features and priority support.
          </p>
        </div>
      </div>
    </div>
  );
}
