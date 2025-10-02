import Link from 'next/link';

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
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-secondary/90 text-white backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href={`/${locale}${tenantPath}`} className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-10 w-auto" />
          ) : (
            <span className="font-display text-xl font-semibold tracking-wide uppercase">
              {tenant.name}
            </span>
          )}
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navigation?.items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${tenantPath}${item.href}`}
              className="text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
