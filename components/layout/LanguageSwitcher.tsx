'use client';

import {useTransition} from 'react';
import {usePathname, useRouter} from 'next/navigation';

import {locales} from '@i18n/config';

export function LanguageSwitcher({currentLocale}: {currentLocale: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const nextLocale = locales.find((locale) => locale !== currentLocale) ?? currentLocale;

  const handleSwitch = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      startTransition(() => router.push(`/${nextLocale}`));
      return;
    }
    segments[0] = nextLocale;
    const nextPath = `/${segments.join('/')}`;
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
