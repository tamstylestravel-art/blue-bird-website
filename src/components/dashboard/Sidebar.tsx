"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Home, Download, CreditCard, Settings, LogOut, ChevronLeft, ChevronRight, Shield, Moon, Sun, Monitor, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { useDashboardTheme } from "./DashboardThemeProvider";

export default function Sidebar() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const router = useRouter();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Theme state
  const { theme, toggleTheme } = useDashboardTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navGroups = [
    {
      title: "Project shortcuts",
      items: [
        { name: t("overview"), href: "/dashboard", icon: Home },
      ]
    },
    {
      title: "Product categories",
      items: [
        { name: t("download"), href: "/dashboard/download", icon: Download },
        { name: t("billing"), href: "/dashboard/billing", icon: CreditCard },
        { name: t("devices", { defaultMessage: "My Devices" }), href: "/dashboard/devices", icon: Monitor },
        { name: t("settings"), href: "/dashboard/settings", icon: Settings },
      ]
    }
  ];

  const adminEmails = ['tamstylestravel@gmail.com', 'tamstyles.travel@gmail.com'];
  if (user && adminEmails.includes(user.email || '')) {
    navGroups.push({
      title: "Administration",
      items: [
        { name: "Admin Panel", href: "/dashboard/admin/plugin", icon: Shield }
      ]
    });
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[var(--sidebar-bg)] border-b border-[var(--sidebar-border)] z-40 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
            <img src="/images/bird.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-[family-name:var(--font-k2d)] font-black uppercase text-[var(--sidebar-text)] text-[13px] sm:text-[14px] tracking-wide whitespace-nowrap">
            BLUE BIRD PICTURES STUDIO
          </span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-[var(--sidebar-text)] bg-[var(--sidebar-border)] rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-all duration-300 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] h-full ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${collapsed ? "md:w-20" : "md:w-64"} w-64 md:flex`}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)] bg-[var(--sidebar-border)] rounded-full z-10"
        >
          <X size={20} />
        </button>

        {/* Collapse Toggle (Desktop only) */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-8 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-full p-1 text-[var(--sidebar-text-muted)] hover:text-white hover:bg-[var(--sidebar-border)] transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
            <img src="/images/bird.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col font-[family-name:var(--font-k2d)] font-black uppercase text-[var(--sidebar-text)]">
              <span className="text-[18px] leading-none tracking-[0.07em]">BLUE BIRD</span>
              <span className="text-[10.5px] leading-none tracking-[0.06em] mt-[3px] opacity-80">PICTURES STUDIO</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 mb-2 text-xs font-semibold text-[var(--sidebar-text-muted)] uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] font-medium" 
                      : "text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-border)] hover:text-[var(--sidebar-text)]"
                  }`}
                  title={collapsed ? item.name : ""}
                >
                  <item.icon size={20} className={isActive ? "text-[var(--sidebar-active-text)]" : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)] transition-colors"} />
                  {!collapsed && <span className="truncate text-sm">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--sidebar-border)] space-y-2">
        {mounted && (
          <>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-border)] hover:text-[var(--sidebar-text)] transition-colors ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? "Toggle Theme" : ""}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              {!collapsed && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </>
        )}

        {user && (
          <div className={`flex items-center gap-3 py-2 ${collapsed ? "justify-center" : "px-2"}`}>
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[var(--sidebar-border)] flex-shrink-0 shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-[#8ab4f8]/50 to-[#8ab4f8]">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--sidebar-text)] truncate">
                  {user.displayName || "Studio Member"}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors group ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? t("logout") : ""}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">{t("logout")}</span>}
        </button>
      </div>
    </div>
    </>
  );
}
