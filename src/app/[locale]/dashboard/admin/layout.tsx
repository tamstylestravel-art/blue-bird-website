'use client';

import React from 'react';
import { usePathname, Link } from '@/i18n/routing';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Plugin Update', href: '/dashboard/admin/plugin' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        
        <div className="flex space-x-6 border-b border-[var(--border)] mt-4">
          {tabs.map((tab) => {
            // Need to handle localized paths (e.g., /en/dashboard/admin/plugin)
            // But we can check if it ends with the href, or exactly matches
            const isActive = pathname.endsWith(tab.href) || pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href as any}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  isActive 
                    ? 'text-sky-500' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
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
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}