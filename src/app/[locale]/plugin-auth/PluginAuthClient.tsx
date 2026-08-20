"use client";

import { useEffect, useState, Suspense } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

function AuthContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback");
  const t = useTranslations("PluginAuth");

  useEffect(() => {
    if (!callbackUrl) {
      setError(t("err_missing_callback"));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('/api/auth/custom-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(t("err_get_token"));
          }

          const data = await response.json();
          if (data.customToken) {
            setSuccess(true);
            window.location.href = `${callbackUrl}?token=${data.customToken}`;
          } else {
            throw new Error(t("err_get_token"));
          }
        } catch (err: any) {
          console.error(err);
          setError(err.message || t("err_get_token"));
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [callbackUrl, t]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-500 mb-2">{t("success_title")}</h2>
        <p className="text-gray-400">{t("success_subtitle")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fade-in-up">
      {/* Subtle glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-brand-blue)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <Image 
        src="/images/BLUE-BIRD-PGS.png" 
        alt="Blue Bird Logo" 
        width={260} 
        height={80} 
        className="mb-6 drop-shadow-2xl object-contain"
        priority
      />
      
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">{t("title")}</h2>
      <p className="text-gray-400 text-sm mb-8 text-center">
        {t("subtitle")}
      </p>

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <svg className="animate-spin h-8 w-8 text-[var(--color-brand-blue)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400 text-sm">{t("loading")}</p>
        </div>
      ) : (
        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {t("btn_google")}
        </button>
      )}
    </div>
  );
}

export default function PluginAuthClient() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/User_requesting_cloud.webp)' }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <AuthContent />
        </Suspense>
      </div>
    </div>
  );
}
