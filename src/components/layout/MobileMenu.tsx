"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

interface MobileMenuProps {
  featuresText: string;
  downloadText: string;
  contactText: string;
  teamText: string;
}

export default function MobileMenu({ featuresText, downloadText, contactText, teamText }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 ml-1 text-slate-900 hover:text-[var(--color-brand-blue)] focus:outline-none transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg z-40 py-4 px-4 flex flex-col gap-2 animate-fade-in md:hidden">
          <Link href="/#features" onClick={() => setIsOpen(false)} className="text-slate-800 hover:text-[var(--color-brand-blue)] hover:bg-slate-50 font-medium text-base block py-3 px-4 rounded-lg transition-colors">{featuresText}</Link>
          <Link href="/#download" onClick={() => setIsOpen(false)} className="text-slate-800 hover:text-[var(--color-brand-blue)] hover:bg-slate-50 font-medium text-base block py-3 px-4 rounded-lg transition-colors">{downloadText}</Link>
          <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-slate-800 hover:text-[var(--color-brand-blue)] hover:bg-slate-50 font-medium text-base block py-3 px-4 rounded-lg transition-colors">{contactText}</Link>
          <Link href="/team" onClick={() => setIsOpen(false)} className="text-slate-800 hover:text-[var(--color-brand-blue)] hover:bg-slate-50 font-medium text-base block py-3 px-4 rounded-lg transition-colors">{teamText}</Link>
        </div>
      )}
    </div>
  );
}
