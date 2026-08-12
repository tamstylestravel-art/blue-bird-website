import {createNavigation} from 'next-intl/navigation';

export const routing = {
  locales: ['en', 'th'],
  defaultLocale: 'th'
} as const;

export type Locale = (typeof routing.locales)[number];

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
