"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function AuthNav({ loginText, dashboardText }: { loginText: string; dashboardText: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-20 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (user) {
    return (
      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[var(--border)] transition-colors border border-transparent hover:border-gray-200">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 border border-[var(--border)] flex items-center justify-center flex-shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-gray-500">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]">
          {user.displayName || dashboardText}
        </span>
      </Link>
    );
  }

  return (
    <Link href="/login" className="px-4 py-1.5 text-sm font-medium rounded-full bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--color-brand-blue)] hover:text-white transition-colors shadow-md">
      {loginText}
    </Link>
  );
}
