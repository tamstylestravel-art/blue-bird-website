import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import RegisterForm from './RegisterForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Register | Blue Bird Pictures Studio",
    robots: {
      index: false,
      follow: false,
    },
  };
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
