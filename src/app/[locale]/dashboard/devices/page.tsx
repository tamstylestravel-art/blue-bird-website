"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useSession } from "@/context/SessionContext";
import { Monitor, Smartphone, Laptop, Trash2, MapPin } from "lucide-react";
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

export default function DevicesPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const t = useTranslations("Dashboard");
  const { deviceId: currentDeviceId } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: any = null;
    let unsubscribeAuth: any = null;

    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user) {
          if (unsubscribeSnapshot) unsubscribeSnapshot();
          setSessions([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "users", user.uid, "sessions"),
          orderBy("lastActive", "desc")
        );

        if (unsubscribeSnapshot) unsubscribeSnapshot();
        
        unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const activeSessions: Session[] = [];
            snapshot.forEach((doc) => {
              activeSessions.push({ id: doc.id, ...doc.data() } as Session);
            });
            setSessions(activeSessions);
            setLoading(false);
          },
          (error) => {
            console.error("Session snapshot error:", error);
            setLoading(false);
          }
        );
      });
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleRevoke = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "sessions", id));
    } catch (error) {
      console.error("Error revoking device:", error);
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    const lower = deviceName.toLowerCase();
    if (lower.includes("ios") || lower.includes("android") || lower.includes("mobile")) {
      return <Smartphone className="w-8 h-8 text-gray-500" />;
    }
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("linux")) {
      return <Laptop className="w-8 h-8 text-gray-500" />;
    }
    return <Monitor className="w-8 h-8 text-gray-500" />;
  };

  const dateLocale = params.locale === 'th' ? th : enUS;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t("devices")}</h1>
      <p className="text-gray-500 mb-8">{t("devicesDesc")}</p>

      <div className="space-y-4">
        {sessions.map((session) => {
          const isCurrent = session.deviceId === currentDeviceId;
          let lastActiveText = t("justNow");
          if (session.lastActive?.toDate) {
            lastActiveText = formatDistanceToNow(session.lastActive.toDate(), { addSuffix: true, locale: dateLocale });
          }

          return (
            <div 
              key={session.id} 
              className={`p-6 rounded-2xl border ${isCurrent ? 'border-brand-blue/50 bg-brand-blue/5' : 'border-[var(--border)] bg-[var(--surface)]'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--background)] rounded-xl">
                  {getDeviceIcon(session.deviceName)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{session.deviceName || t("unknownDevice")}</h3>
                    {isCurrent && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                        {t("currentDevice")}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {session.location !== "Unknown, Unknown" ? session.location : t("locationUnknown")} 
                      {session.ip && session.ip !== "Unknown" ? ` (${session.ip})` : ""}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{t("lastActive")} {lastActiveText}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {session.deviceId}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRevoke(session.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent 
                    ? "text-red-500 hover:bg-red-500/10" 
                    : "border border-[var(--border)] text-[var(--foreground)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {t("revoke")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
