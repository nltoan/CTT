'use client';

import {useTransition} from 'react';
import {usePathname, useRouter} from 'next/navigation';

import {locales} from '@i18n/config';

export function getAlternateLocale(currentLocale: string, supportedLocales: readonly string[] = locales) {
  const fallback = supportedLocales[0] ?? currentLocale;
  return supportedLocales.find((locale) => locale !== currentLocale) ?? fallback;
}

export function getSwitchLocalePath(
  pathname: string,
  currentLocale: string,
  supportedLocales: readonly string[] = locales
) {
  const nextLocale = getAlternateLocale(currentLocale, supportedLocales);
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return `/${nextLocale}`;
  }
  segments[0] = nextLocale;
  return `/${segments.join('/')}`;
}

export function LanguageSwitcher({currentLocale}: {currentLocale: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const nextLocale = getAlternateLocale(currentLocale);

  const handleSwitch = () => {
    const nextPath = getSwitchLocalePath(pathname ?? '/', currentLocale);
    startTransition(() => router.push(nextPath));
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={pending}
      className="rounded-full border border-white/30 px-4 py-1 text-sm font-medium uppercase text-white transition hover:border-white"
    >
      {pending ? '…' : nextLocale}
    </button>
  );
}
