"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Home, Download, CreditCard, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Sidebar() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

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
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-navy text-white font-bold flex items-center justify-center">
            B
          </div>
          {!collapsed && <span className="font-bold text-lg text-[var(--foreground)] truncate">Blue Bird</span>}
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
