"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function Footer() {
  const pathname = usePathname();
  const locale = useLocale();
  const tFoot = useTranslations("Footer");

  // Normalized path check (strips locale prefix if present, e.g. /th/login -> /login)
  const cleanPath = (pathname || '/').replace(/^\/(?:th|en|ja)(?=\/|$)/, '') || '/';

  // Suppress footer on authentication pages and dashboard
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
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/images/bird.png" alt="Blue Bird Pictures Studio Logo" className="w-6 h-6 object-contain" />
          <span className="font-k2d font-extrabold text-sm text-[var(--foreground)]">Blue Bird Pictures Studio</span>
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <Link href="/team" className="hover:text-blue-400 transition-colors">
            Team
          </Link>
          <Link href="/terms" className="hover:text-blue-400 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-blue-400 transition-colors">
            Privacy
          </Link>
        </nav>

        <p className="text-sm text-gray-400">© 2026 Blue Bird Pictures Studio. {tFoot("rights")}</p>
      </div>
    </footer>
  );
}
