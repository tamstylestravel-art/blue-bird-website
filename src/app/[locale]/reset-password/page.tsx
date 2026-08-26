import { setRequestLocale } from "next-intl/server";
import ResetPasswordClient from "./ResetPasswordClient";

export function generateStaticParams() {
  return [{ locale: "th" }, { locale: "en" }];
}

import { Suspense } from 'react';

export default function ResetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
