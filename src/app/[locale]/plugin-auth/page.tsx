import { setRequestLocale } from 'next-intl/server';
import PluginAuthClient from './PluginAuthClient';

export function generateStaticParams() {
  return [{ locale: 'th' }, { locale: 'en' }];
}

export default function PluginAuthPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <PluginAuthClient />;
}
