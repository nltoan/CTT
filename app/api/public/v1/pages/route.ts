import {NextResponse} from 'next/server';

import {getPageForTenant} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const slug = searchParams.get('slug') ?? '';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale});

  if (!page) {
    return NextResponse.json({error: 'Page not found'}, {status: 404});
  }

  return NextResponse.json({data: page});
}
