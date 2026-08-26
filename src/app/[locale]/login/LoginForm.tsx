"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { SpotlightWrapper, MagneticButton, ParticleInput } from "@/components/ui/auth-effects";

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-x-hidden w-full pb-40">
      {/* Fixed Background that doesn't resize with virtual keyboard */}
      <div 
        className="fixed top-0 left-0 w-[100vw] h-[100lvh] bg-cover bg-center bg-no-repeat -z-10 transition-colors duration-300"
        style={{ backgroundImage: "url('/images/User_requesting_cloud.webp')" }}
      />
      {/* No dark overlay */}

      <div className="absolute top-6 right-6 flex items-center gap-4 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md relative z-10 mt-12 md:mt-16">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <Link href="/" className="relative inline-block mb-1 animate-float-soft group">
              <div className="relative w-[200px] h-[200px] max-h-40 flex items-center justify-center">
                <Image 
                  src="/images/BLUE-BIRD-PGS03.png" 
                  alt="Blue Bird Logo" 
                  width={200} 
                  height={200} 
                  className={`drop-shadow-2xl h-auto w-auto max-h-40 absolute transition-all duration-500 ease-in-out ${showPassword ? 'opacity-0 scale-95 rotate-[-5deg]' : 'opacity-100 scale-100 rotate-0'}`} 
                  priority 
                />
                <Image 
                  src="/images/BLUE-BIRD-PGS03-B.png" 
                  alt="Blue Bird Logo Hiding" 
                  width={200} 
                  height={200} 
                  className={`drop-shadow-2xl h-auto w-auto max-h-40 absolute transition-all duration-500 ease-in-out ${showPassword ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-95 rotate-[5deg]'}`} 
                  priority 
                />
              </div>
              {/* Shine Sweep Effect masked to the logo shape */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-all duration-500"
                style={{
                  WebkitMaskImage: `url('${showPassword ? "/images/BLUE-BIRD-PGS03-B.png" : "/images/BLUE-BIRD-PGS03.png"}')`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full h-full animate-shine"></div>
              </div>
            </Link>
          </div>
          <h1 className="font-k2d text-2xl md:text-3xl font-black text-[#041d46] drop-shadow-md mb-0 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Blue Bird Pictures Studio</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t("loginTitle")}</h2>
        </div>

        <div className="glass-panel rounded-2xl shadow-xl border border-[var(--border)] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <SpotlightWrapper className="p-8 h-full w-full">
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
            <form onSubmit={handleLogin} className={`space-y-4 ${error ? 'animate-shake' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("emailLabel")}</label>
                <ParticleInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailLabel")}
                  className={`w-full px-4 py-3 pl-12 rounded-xl bg-[var(--surface)] border ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:ring-brand-blue/50 focus:border-brand-blue'} text-[var(--foreground)] text-base placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                  required
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("passwordLabel")}</label>
                <div className="relative">
                  <ParticleInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordLabel")}
                    className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl bg-[var(--surface)] border ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:ring-brand-blue/50 focus:border-brand-blue'} text-[var(--foreground)] text-base placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                    required
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    }
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-[var(--color-brand-blue)] focus:outline-none transition-colors"
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
                    <span className="text-sm text-gray-300 group-hover:text-[var(--foreground)] transition-colors">{t("rememberMe")}</span>
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

            <MagneticButton
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-semibold shadow-lg shadow-brand-blue/30 hover:bg-[var(--color-brand-blue-dark)] focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                t("loginBtn")
              )}
            </MagneticButton>
          </form>
          )}
          {!isResetMode && !resetSuccess && (
            <>
              <div className="mt-4 mb-2 flex items-center justify-center">
                <span className="flex-1 border-b border-gray-600/50"></span>
                <span className="px-3 text-xs text-center text-gray-400 uppercase">{t("or")}</span>
                <span className="flex-1 border-b border-gray-600/50"></span>
              </div>
              <MagneticButton
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-medium hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t("continueWithGoogle")}
              </MagneticButton>
            </>
          )}

          <div className="mt-6 text-center text-base text-gray-300">
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
          </SpotlightWrapper>
        </div>

        <div className="mt-4 w-full opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link href="/" className="w-full flex items-center justify-center text-white/90 hover:text-white transition-colors font-medium text-base bg-black/20 hover:bg-black/40 px-4 py-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("backToHome")}
          </Link>
        </div>
      </div>

      {/* Professional Footer with Social Icons */}
      <div className="fixed bottom-0 w-full py-6 px-6 md:px-12 bg-white/10 backdrop-blur-md border-t border-white/20 flex flex-col justify-center items-center gap-4 z-20">
        <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">Facebook</span>
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">Instagram</span>
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">X (Twitter)</span>
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">TikTok</span>
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.39-2.92 5.74-1.6 1.22-3.66 1.63-5.63 1.3-1.95-.31-3.76-1.44-4.88-3.05-1.15-1.64-1.45-3.8-1.01-5.74.43-1.89 1.63-3.55 3.3-4.52 1.72-.99 3.86-1.13 5.73-.53V14.5c-1.3-.39-2.8-.2-3.88.64-1.07.82-1.57 2.22-1.3 3.52.26 1.25 1.34 2.33 2.61 2.64 1.31.31 2.75-.02 3.65-.98.88-.93 1.21-2.31 1.2-3.6V.02z" />
            </svg>
          </a>
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">YouTube</span>
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">Discord</span>
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
          <a href="#" className="text-[#041d46] opacity-75 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300">
            <span className="sr-only">LINE</span>
            <svg className="w-6 h-6 md:w-7 md:h-7 scale-[1.35]" fill="currentColor" viewBox="-5.5 0 32 32" aria-hidden="true">
              <path d="M10.656 5.938c5.938 0 10.719 3.875 10.719 8.688 0 2.344-1.156 4.406-2.969 6.031-2.938 2.906-8 5.844-8.531 5.625-0.875-0.344 0.656-2.219 0.031-3.031-0.094-0.125-0.438-0.094-1.063-0.188-5.156-0.688-8.844-4.094-8.844-8.469 0-4.813 4.75-8.656 10.656-8.656zM4.563 17.5h1.813c0.313 0 0.5-0.25 0.5-0.563 0-0.219-0.156-0.5-0.563-0.5h-1.469c-0.125 0-0.125-0.125-0.125-0.563v-3.156c0-0.281-0.188-0.563-0.531-0.563-0.313 0-0.531 0.25-0.531 0.563v3.813c0 0.844 0.406 0.969 0.906 0.969zM8.656 17.063v-4.344c0-0.281-0.219-0.563-0.563-0.563-0.281 0-0.531 0.25-0.531 0.563v4.344c0 0.281 0.219 0.5 0.563 0.5 0.281 0 0.531-0.219 0.531-0.5zM13.781 16.469v-3.813c0-0.281-0.219-0.5-0.563-0.5-0.25 0-0.531 0.156-0.531 0.5v2.75l-1.813-2.531c-0.25-0.438-0.563-0.719-0.938-0.719-0.469 0-0.5 0.375-0.5 0.906v4c0 0.281 0.219 0.5 0.531 0.5 0.281 0 0.531-0.188 0.531-0.5v-2.844l1.813 2.531c0.406 0.531 0.5 0.813 1 0.813 0.344 0 0.469-0.313 0.469-1.094zM17.281 14.313h-1.594v-0.906c0-0.094 0.031-0.219 0.188-0.219h1.406c0.344 0 0.563-0.188 0.563-0.531 0-0.406-0.313-0.531-0.594-0.531h-1.813c-0.563 0-0.844 0.375-0.844 0.875v3.531c0 0.625 0.25 0.969 0.844 0.969h1.844c0.406 0 0.563-0.25 0.563-0.563 0-0.406-0.313-0.531-0.563-0.531h-1.375c-0.125 0-0.219-0.094-0.219-0.188v-0.875h1.656c0.406 0 0.469-0.313 0.469-0.531 0-0.313-0.25-0.5-0.531-0.5z" />
            </svg>
          </a>
        </div>
        <div className="text-[#041d46] text-xs md:text-sm font-bold tracking-wide text-center">
          &copy; {new Date().getFullYear()} Blue Bird Pictures Studio. {t("allRightsReserved")}
        </div>
      </div>
    </div>
  );
}
