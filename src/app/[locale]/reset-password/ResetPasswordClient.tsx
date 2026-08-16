"use client";

import { useState, Suspense, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const t = useTranslations("ResetPassword");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(true);

  // Optional: Verify code is valid before showing the form
  useEffect(() => {
    if (!oobCode) {
      setError(t("err_missing_code"));
      setVerifyingCode(false);
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        setVerifyingCode(false);
      })
      .catch((err) => {
        console.error("Invalid reset code", err);
        setError(t("err_missing_code"));
        setVerifyingCode(false);
      });
  }, [oobCode, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(t("err_match"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("err_length"));
      return;
    }

    if (!oobCode) {
      setError(t("err_missing_code"));
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (verifyingCode) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <svg className="animate-spin h-8 w-8 text-[var(--color-brand-blue)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-400 text-sm">Verifying link...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-500 mb-2">{t("success_title")}</h2>
        <p className="text-gray-400 mb-8">{t("success_desc")}</p>
        <Link 
          href={`/${locale}/login`}
          className="inline-block w-full text-center bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue-hover)] text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
        >
          {t("back_to_login")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 text-center">{t("title")}</h2>
      <p className="text-gray-400 text-sm mb-8 text-center">
        {t("subtitle")}
      </p>

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      {!oobCode ? (
        <div className="text-center mt-6">
          <Link href={`/${locale}/login`} className="text-[var(--color-brand-blue)] hover:underline text-sm font-semibold">
            {t("back_to_login")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("new_password")}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirm_password")}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue-hover)] text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("saving") : t("save_btn")}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordClient() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/sky-clouds.jpeg)' }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
      </div>
      
      <div className="relative z-10 w-full flex justify-center">
        <div className="flex flex-col items-center justify-center w-full max-w-md bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fade-in-up">
          {/* Subtle glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-brand-blue)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          
          <Image 
            src="/images/BLUE-BIRD-PGS.png" 
            alt="Blue Bird Logo" 
            width={260} 
            height={80} 
            className="mb-8 drop-shadow-2xl object-contain"
            priority
          />
          
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
