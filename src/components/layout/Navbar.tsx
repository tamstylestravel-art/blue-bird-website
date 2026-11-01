"use client";

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import AuthNav from "@/components/layout/AuthNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/layout/MobileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const tNav = useTranslations("Navigation");

  // Normalized path check (strips locale prefix if present, e.g. /th/login -> /login)
  const cleanPath = (pathname || '/').replace(/^\/(?:th|en|ja)(?=\/|$)/, '') || '/';

  // Suppress Navbar on authentication pages and dashboard
  const isAuthOrDashboard =
    cleanPath === '/login' ||
    cleanPath.startsWith('/login/') ||
    cleanPath === '/register' ||
    cleanPath.startsWith('/register/') ||
    cleanPath === '/reset-password' ||
    cleanPath.startsWith('/reset-password/') ||
    cleanPath === '/plugin-auth' ||
    cleanPath.startsWith('/plugin-auth/') ||
    cleanPath === '/dashboard' ||
    cleanPath.startsWith('/dashboard/');

  if (isAuthOrDashboard) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/75 backdrop-blur-2xl border-b border-gray-200 opacity-0 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <img src="/images/bird.png" alt="Blue Bird Pictures Studio Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
            <span className="font-k2d font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 hidden sm:block">
              Blue Bird Pictures Studio
            </span>
            <span className="font-k2d font-extrabold text-lg tracking-tight text-slate-900 block sm:hidden">
              Blue Bird
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/#features" className="text-slate-800 hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("features")}</Link>
              <Link href="/#download" className="text-slate-800 hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("download")}</Link>
              <Link href="/#contact" className="text-slate-800 hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("contact")}</Link>
              <Link href="/team" className="text-slate-800 hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("team")}</Link>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 border-l border-gray-200 pl-2 sm:pl-4">
              <LanguageSwitcher />
              <AuthNav loginText={tNav("login")} signupText={tNav("register")} dashboardText="Dashboard" />
              <MobileMenu 
                featuresText={tNav("features")} 
                downloadText={tNav("download")} 
                contactText={tNav("contact")} 
                teamText={tNav("team")} 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
