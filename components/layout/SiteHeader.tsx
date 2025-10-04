"use client";

import {useEffect, useId, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';

import {LanguageSwitcher} from './LanguageSwitcher';

import type {Navigation} from '@types/cms';
import type {Tenant} from '@types/cms';

export function SiteHeader({
  tenant,
  navigation,
  locale,
  tenantPath = ''
}: {
  tenant: Tenant;
  navigation?: Navigation;
  locale: string;
  tenantPath?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const navItems = navigation?.items ?? [];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-secondary/90 text-white backdrop-blur supports-backdrop-blur:bg-secondary/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}${tenantPath}`} className="flex items-center gap-3 focus:outline-none">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.name} className="h-10 w-auto" />
            ) : (
              <span className="font-display text-lg font-semibold uppercase tracking-wide md:text-xl">
                {tenant.name}
              </span>
            )}
          </Link>
        </div>
        {navItems.length > 0 && (
          <nav
            id={menuId}
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm font-medium md:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${tenantPath}${item.href}`}
                className="transition hover:text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          {navItems.length > 0 && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-white/30 px-3 py-2 text-sm font-medium uppercase text-white transition hover:border-white focus:outline-none md:hidden"
              aria-expanded={mobileOpen}
              aria-controls={`${menuId}-mobile`}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span className="sr-only">{locale === 'vi' ? 'Mở menu' : 'Open menu'}</span>
              <svg
                aria-hidden="true"
                focusable="false"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {navItems.length > 0 && (
        <div
          className={clsx(
            'md:hidden',
            'fixed inset-x-0 top-0 z-30 flex min-h-screen flex-col bg-black/60 backdrop-blur-sm transition',
            mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          )}
          aria-hidden={!mobileOpen}
          role="presentation"
        >
          <div
            id={`${menuId}-mobile`}
            className="ml-auto flex w-full max-w-xs flex-1 flex-col bg-secondary text-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-display text-base font-semibold uppercase tracking-wide">
                {tenant.name}
              </span>
              <button
                type="button"
                className="rounded-md border border-white/30 p-2 transition hover:border-white focus:outline-none"
                onClick={() => setMobileOpen(false)}
              >
                <span className="sr-only">{locale === 'vi' ? 'Đóng menu' : 'Close menu'}</span>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.id}`}
                  href={`/${locale}${tenantPath}${item.href}`}
                  className="rounded-md px-3 py-2 transition hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 px-5 py-4 text-xs uppercase tracking-wide text-white/60">
              {tenant.socialLinks && tenant.socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {tenant.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="transition hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p>{locale === 'vi' ? 'Kết nối cùng chúng tôi' : 'Connect with us'}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-hidden="true"
            className="flex-1"
            onClick={() => setMobileOpen(false)}
          >
            <span className="sr-only">{locale === 'vi' ? 'Đóng menu' : 'Close menu'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
