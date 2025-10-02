import {NextResponse} from 'next/server';

import {getRecentPosts} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const limit = searchParams.get('limit');

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const posts = await getRecentPosts({
    tenantId: tenant.id,
    locale,
    limit: limit ? Number.parseInt(limit, 10) : undefined
  });

  return NextResponse.json({data: posts});
}
