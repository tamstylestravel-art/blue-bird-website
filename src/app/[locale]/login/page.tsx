import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import LoginForm from './LoginForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LoginPage(props: { params: Promise<{ locale: string }> }) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  return <LoginForm />;
}
