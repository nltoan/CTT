import {NextRequest, NextResponse} from 'next/server';
import {draftMode} from 'next/headers';

import {defaultLocale, locales} from '@i18n/config';
import {buildPath} from '@lib/seo';
import {findTenantBySlug} from '@data/tenants';
import {getDefaultTenant} from '@lib/tenant';

function normalizeLocale(value: string | null) {
  if (!value || !locales.includes(value as (typeof locales)[number])) {
    return defaultLocale;
  }
  return value as 'vi' | 'en';
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const expected = process.env.PREVIEW_SECRET ?? 'dev-preview-secret';

  if (!secret || secret !== expected) {
    return new NextResponse('Invalid preview token', {status: 401});
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale'));
  const tenantSlug = request.nextUrl.searchParams.get('tenant') ?? undefined;
  const slug = request.nextUrl.searchParams.get('slug') ?? '';

  const fallbackTenant = getDefaultTenant();
  const tenant = tenantSlug ? findTenantBySlug(tenantSlug) ?? fallbackTenant : fallbackTenant;
  const tenantPath = tenantSlug ? `/t/${tenantSlug}` : '';
  const slugSegments = slug
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  draftMode().enable();

  const path = buildPath({locale, tenantPath, slugSegments});
  const redirect = new URL(path || '/', request.nextUrl.origin);

  return NextResponse.redirect(redirect);
}
