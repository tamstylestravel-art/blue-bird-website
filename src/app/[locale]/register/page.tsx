import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import RegisterForm from './RegisterForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { Suspense } from 'react';

export default async function RegisterPage(props: { params: Promise<{ locale: string }> }) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
