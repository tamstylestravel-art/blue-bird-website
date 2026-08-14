"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Home, Download, CreditCard, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";

export default function Sidebar() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: t("overview"), href: "/dashboard", icon: Home },
    { name: t("download"), href: "/dashboard/download", icon: Download },
    { name: t("billing"), href: "/dashboard/billing", icon: CreditCard },
    { name: t("settings"), href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className={`flex flex-col bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-300 relative ${collapsed ? "w-20" : "w-64"}`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 text-[var(--foreground)] hover:bg-[var(--border)] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src="/images/bird.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {!collapsed && <span className="font-bold text-base text-[var(--foreground)] truncate">Blue Bird Pictures Studio</span>}
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-brand-blue/10 text-brand-blue font-medium" 
                  : "text-gray-500 hover:bg-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-brand-blue" : "text-gray-400 group-hover:text-[var(--foreground)] transition-colors"} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        {user && (
          <div className={`flex items-center gap-3 mb-4 ${collapsed ? "justify-center" : "px-2"}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--surface)] border-2 border-[var(--color-brand-blue)] flex-shrink-0 shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--foreground)] font-bold text-lg bg-gradient-to-br from-[var(--color-brand-blue)]/10 to-[var(--color-brand-blue)]/30">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {user.displayName || "Studio Member"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors group ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? t("logout") : ""}
        >
          <LogOut size={20} />
          {!collapsed && <span>{t("logout")}</span>}
        </button>
      </div>
    </div>
  );
}
