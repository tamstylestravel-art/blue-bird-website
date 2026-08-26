"use client";

import { useTranslations, useLocale } from "next-intl";
import { Monitor, Smartphone, Laptop, Trash2, MapPin, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th, enUS } from "date-fns/locale";

interface Session {
  id: string;
  deviceId: string;
  deviceName: string;
  userAgent: string;
  ip: string;
  location: string;
  lastActive: any;
  createdAt: any;
}

interface DeviceLimitModalProps {
  sessions: Session[];
  onRevoke: (sessionId: string) => void;
  onCancel: () => void;
}

export default function DeviceLimitModal({ sessions, onRevoke, onCancel }: DeviceLimitModalProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const dateLocale = locale === 'th' ? th : enUS;

  const getDeviceIcon = (deviceName: string) => {
    const lower = deviceName?.toLowerCase() || "";
    if (lower.includes("ios") || lower.includes("android") || lower.includes("mobile")) {
      return <Smartphone className="w-8 h-8 text-gray-500" />;
    }
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("linux")) {
      return <Laptop className="w-8 h-8 text-gray-500" />;
    }
    return <Monitor className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("deviceLimitReached")}</h2>
          <p className="text-gray-500 max-w-lg">
            {t("deviceLimitDesc")}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {sessions.map((session) => {
            let lastActiveText = t("justNow");
            if (session.lastActive?.toDate) {
              lastActiveText = formatDistanceToNow(session.lastActive.toDate(), { addSuffix: true, locale: dateLocale });
            }

            return (
              <div 
                key={session.id} 
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                    {getDeviceIcon(session.deviceName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{session.deviceName || t("unknownDevice")}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {session.location !== "Unknown, Unknown" ? session.location : t("locationUnknown")} 
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{t("lastActive")} {lastActiveText}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRevoke(session.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--foreground)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-colors w-full sm:w-auto justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("logout")}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--foreground)] transition-colors"
          >
            <X className="w-4 h-4" />
            {t("cancelAndSignOut")}
          </button>
        </div>
      </div>
    </div>
  );
}
