import { setRequestLocale } from 'next-intl/server';
import PluginAuthClient from './PluginAuthClient';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';

export default function PluginAuthPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PluginAuthClient />
    </Suspense>
  );
}
