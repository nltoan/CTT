import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {defaultLocale, locales} from '@i18n/config';

export async function generateMetadata({
  params
}: {
  params: {locale: string};
}): Promise<Metadata> {
  if (!locales.includes(params.locale as (typeof locales)[number])) {
    notFound();
  }

  return {
    alternates: {
      canonical: params.locale === defaultLocale ? '/' : `/${params.locale}`
    }
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!locales.includes(params.locale as (typeof locales)[number])) {
    notFound();
  }

  return <>{children}</>;
}
