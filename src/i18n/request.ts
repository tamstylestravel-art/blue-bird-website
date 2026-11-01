import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import enMessages from '../../messages/en.json';
import thMessages from '../../messages/th.json';
import jaMessages from '../../messages/ja.json';

const messagesMap: Record<string, typeof thMessages> = {
  en: enMessages,
  th: thMessages,
  ja: jaMessages as unknown as typeof thMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
 
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: messagesMap[locale] || enMessages
  };
});
