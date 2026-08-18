"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth");
  const tErr = useTranslations("Errors");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { signOut } = await import('firebase/auth');
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error(t("unverifiedEmail"));
      }
      
      router.push(`/dashboard${window.location.search}`);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError(tErr("invalidCredential"));
      } else if (err.code === 'auth/user-not-found') {
        setError(tErr("userNotFound"));
      } else if (err.code === 'auth/too-many-requests') {
        setError(tErr("tooManyRequests"));
      } else {
        setError(err.message || tErr("default"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(`/dashboard${window.location.search}`);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return; // User cancelled
      }
      setError(err.message || tErr("default"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          locale: document.documentElement.lang || 'th'
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reset link');
      }

      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || tErr("default"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat transition-colors duration-300 relative"
      style={{ backgroundImage: "url('/images/User_requesting_cloud.jpeg')" }}
    >
      {/* No dark overlay */}

      <div className="absolute top-6 right-6 flex items-center gap-4 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <Link href="/" className="relative inline-block mb-1 animate-float-soft group">
              <Image src="/images/BLUE-BIRD-PGS03.png" alt="Blue Bird Logo" width={200} height={200} className="drop-shadow-2xl h-auto w-auto max-h-40" priority />
              {/* Shine Sweep Effect masked to the logo shape */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  WebkitMaskImage: "url('/images/BLUE-BIRD-PGS03.png')",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full h-full animate-shine"></div>
              </div>
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-white/90 drop-shadow-md mb-0 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Blue Bird Pictures Studio</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t("loginTitle")}</h2>
        </div>

        <div className="glass-panel p-8 rounded-2xl shadow-xl border border-[var(--border)] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          {resetSuccess ? (
            <div className="text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{t("resetSuccessTitle")}</h3>
              <p className="text-gray-500 mb-6">{t("resetSuccessDesc")}</p>
              <button
                onClick={() => { setIsResetMode(false); setResetSuccess(false); }}
                className="w-full py-3.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-semibold hover:bg-[var(--color-brand-blue-dark)] transition-all"
              >
                {t("backToLogin")}
              </button>
            </div>
          ) : isResetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{t("resetTitle")}</h3>
                <p className="text-sm text-gray-500">{t("resetDesc")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("emailLabel")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailLabel")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                  required
                />
              </div>
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-semibold shadow-lg shadow-brand-blue/30 hover:bg-[var(--color-brand-blue-dark)] focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? "..." : t("sendResetBtn")}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsResetMode(false); setError(""); }}
                  className="w-full py-3.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-black/5 transition-colors"
                >
                  {t("backToLogin")}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("emailLabel")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailLabel")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("passwordLabel")}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordLabel")}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all pr-12"
                    required
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-[var(--foreground)] focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
                <div className="mt-2 flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)} 
                        className="peer appearance-none w-4 h-4 rounded-full border border-[var(--border)] bg-[var(--surface)] checked:bg-[var(--color-brand-blue)] checked:border-[var(--color-brand-blue)] transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/50" 
                      />
                      <svg 
                        className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 group-hover:text-[var(--foreground)] transition-colors">{t("rememberMe")}</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => { setIsResetMode(true); setError(""); setResetSuccess(false); }}
                    className="text-sm text-[var(--color-brand-blue)] font-medium hover:underline transition-all"
                  >
                    {t("forgotPassword")}
                  </button>
                </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-semibold shadow-lg shadow-brand-blue/30 hover:bg-[var(--color-brand-blue-dark)] focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                t("loginBtn")
              )}
            </button>
          </form>
          )}
          {!isResetMode && !resetSuccess && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t("continueWithGoogle")}
              </button>
            </>
          )}

          <div className="mt-6 text-center text-base text-gray-500">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-[var(--color-brand-blue)] font-semibold hover:underline">
              {t("createOne")}
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
            {t("agreeToTerms")}{" "}
            <Link href="/terms" className="underline hover:text-[var(--foreground)] transition-colors">
              {t("terms")}
            </Link>{" "}
            {t("and")}{" "}
            <Link href="/privacy" className="underline hover:text-[var(--foreground)] transition-colors">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
