"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardOverview() {
  const t = useTranslations("Dashboard");
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const [appConnected, setAppConnected] = useState(false);

  useEffect(() => {
    setUser(auth.currentUser);
    
    // Desktop App Connection Logic
    const appPort = searchParams.get('app_port');
    if (appPort && auth.currentUser) {
      auth.currentUser.getIdToken().then(token => {
        fetch(`http://localhost:${appPort}/callback?idToken=${token}`)
          .then(() => setAppConnected(true))
          .catch(err => console.error("Desktop app connection failed:", err));
      });
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {appConnected && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-fade-in-up">
          <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">เชื่อมต่อกับ Blue Bird Hub สำเร็จแล้ว!</h2>
          <p className="text-gray-500">คุณสามารถปิดหน้าต่างนี้และกลับไปที่โปรแกรมได้เลยครับ</p>
        </div>
      )}
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
