import React from 'react';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const tFoot = await getTranslations("Footer");

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/images/bird.png" alt="Blue Bird Pictures Studio Logo" className="w-6 h-6 object-contain" />
          <span className="font-k2d font-extrabold text-sm text-[var(--foreground)]">Blue Bird Pictures Studio</span>
        </div>
        <p className="text-sm text-gray-400">© 2026 Blue Bird Pictures Studio. {tFoot("rights")}</p>
      </div>
    </footer>
  );
}
