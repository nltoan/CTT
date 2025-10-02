'use client';

import {useEffect, useState} from 'react';
import clsx from 'clsx';

import type {CookieBannerSettings, Tenant} from '@types/cms';

const CONSENT_EVENT = 'cookie-consent-change';

type ConsentValue = 'accepted' | 'declined' | 'unknown';

type CookieBannerProps = {
  storageKey: string;
  settings: CookieBannerSettings;
  tenant: Tenant;
  locale: string;
};

export function CookieBanner({storageKey, settings, tenant, locale}: CookieBannerProps) {
  const [consent, setConsent] = useState<ConsentValue>('unknown');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!settings.enabled) {
      return;
    }

    try {
      const stored = window.localStorage.getItem(storageKey) as ConsentValue | null;
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored);
      }
    } catch (error) {
      // ignore storage errors, keep banner visible
    } finally {
      setReady(true);
    }
  }, [settings.enabled, storageKey]);

  const isVisible = settings.enabled !== false && ready && consent === 'unknown';

  const updateConsent = (value: Exclude<ConsentValue, 'unknown'>) => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      // ignore storage write issues
    }
    setConsent(value);
    window.dispatchEvent(new CustomEvent<Exclude<ConsentValue, 'unknown'>>(CONSENT_EVENT, {detail: value}));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-md">
      <div
        role="dialog"
        aria-live="polite"
        aria-label={`${tenant.name} cookie notice (${locale})`}
        className={clsx(
          'rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur',
          'bg-[var(--color-secondary)] text-white'
        )}
      >
        <p className="text-sm leading-relaxed text-white/90">{settings.message}</p>
        {settings.moreInfoUrl && (
          <a
            href={settings.moreInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center text-sm font-medium text-white underline underline-offset-4 transition hover:opacity-80"
          >
            {settings.moreInfoLabel ?? 'Tìm hiểu thêm'}
          </a>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateConsent('accepted')}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          >
            {settings.acceptLabel ?? 'Đồng ý'}
          </button>
          <button
            type="button"
            onClick={() => updateConsent('declined')}
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white/90 transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            {settings.rejectLabel ?? 'Từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
}
