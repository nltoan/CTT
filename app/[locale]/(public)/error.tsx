'use client';

import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

import {isSentryEnabled} from '@lib/monitoring/sentry';
import {buildLocalizedPath} from '@lib/url';

type ErrorProps = {
  error: Error & {digest?: string};
  reset: () => void;
};

type Params = {
  locale?: string;
  tenant?: string;
};

export default function Error({error, reset}: ErrorProps) {
  const t = useTranslations('error');
  const params = useParams<Params>();
  const [eventId, setEventId] = useState<string | undefined>();

  const locale = (params?.locale as 'vi' | 'en') ?? 'vi';
  const tenantPath = params?.tenant ? `/t/${params.tenant}` : '';

  const homeHref = useMemo(
    () => buildLocalizedPath({locale, tenantPath}),
    [locale, tenantPath]
  );
  const contactHref = useMemo(
    () => buildLocalizedPath({locale, tenantPath, slug: '/contact'}),
    [locale, tenantPath]
  );

  useEffect(() => {
    if (isSentryEnabled('browser')) {
      const id = Sentry.captureException(error);
      if (typeof id === 'string' && id.length > 0) {
        setEventId(id);
      }
    } else {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-gray-800">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="rounded-full bg-primary bg-opacity-10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
          {t('badge')}
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          {t('description')}
        </p>
        {eventId && (
          <div className="mt-4 rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-700">
            <p>
              <span className="font-medium">{t('eventIdLabel')}:</span> {eventId}
            </p>
            <p className="mt-2 text-xs text-gray-500">{t('eventIdHelp')}</p>
          </div>
        )}
        {error.digest && !eventId && (
          <p className="mt-4 text-sm text-gray-500">{t('digestLabel', {digest: error.digest})}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('retry')}
          </button>
          <Link
            href={homeHref}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('home')}
          </Link>
          <Link
            href={contactHref}
            className="rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-primary underline-offset-4 transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('contact')}
          </Link>
        </div>
      </div>
    </div>
  );
}
