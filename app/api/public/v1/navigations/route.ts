import {NextResponse} from 'next/server';

import {getNavigation} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const key = (searchParams.get('key') as 'header' | 'footer') ?? 'header';
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const navigation = await getNavigation({tenantId: tenant.id, key, locale});

  if (!navigation) {
    return NextResponse.json({error: 'Navigation not found'}, {status: 404});
  }

  return NextResponse.json({data: navigation});
}
