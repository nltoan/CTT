import {headers} from 'next/headers';

import type React from 'react';

import {defaultLocale, locales} from '@i18n/config';
import {findTenantByDomain, findTenantBySlug, tenants} from '@data/tenants';
import type {Tenant} from '@types/cms';

export type TenantResolution = {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
};

function normalizeSlug(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return '';
  }
  return slug.join('/');
}

export function assertLocale(value: string | undefined): value is 'vi' | 'en' {
  return !!value && (locales as readonly string[]).includes(value);
}

export function resolveTenantByHost(host?: string | null) {
  if (!host) {
    return getDefaultTenant();
  }
  const hostname = host.split(':')[0];
  return findTenantByDomain(hostname) ?? getDefaultTenant();
}

export function resolveTenantFromParams({
  tenantParam,
  host
}: {
  tenantParam?: string;
  host?: string | null;
}) {
  if (tenantParam) {
    const tenant = findTenantBySlug(tenantParam);
    if (tenant) {
      return tenant;
    }
  }
  return resolveTenantByHost(host);
}

export function getDefaultTenant() {
  return findTenantBySlug('main') ?? tenants[0];
}

export function getTenantThemeCssVariables(tenant: Tenant) {
  return {
    '--color-primary': tenant.primaryColor ?? '#d72638',
    '--color-secondary': tenant.secondaryColor ?? '#292f36',
    '--color-accent': tenant.accentColor ?? '#f5a623',
    '--font-display': tenant.fontDisplay ?? 'Be Vietnam Pro',
    '--font-body': tenant.fontBody ?? 'Inter'
  } as React.CSSProperties;
}

export function readTenantResolutionFromRequest({
  params,
  locale
}: {
  params: {tenant?: string; slug?: string[]};
  locale?: string;
}) {
  const host = headers().get('host');
  const tenant = resolveTenantFromParams({tenantParam: params.tenant, host});
  const resolvedLocale = assertLocale(locale) ? locale : defaultLocale;
  const slug = normalizeSlug(params.slug);
  const tenantPath = params.tenant ? `/t/${params.tenant}` : '';
  return {tenant, locale: resolvedLocale, slug, tenantPath};
}
