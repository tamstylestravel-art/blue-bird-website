import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/context/AuthContext";
import CookieConsent from "@/components/CookieConsent";

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'thai'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: "Blue Bird Pictures Studio",
  description: "The ultimate Premiere Pro extension for seamless workflow.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { setRequestLocale } from 'next-intl/server';

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${kanit.variable} ${kanit.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <CookieConsent />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
