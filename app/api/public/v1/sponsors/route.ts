import {NextResponse} from 'next/server';

import {getSponsors} from '@lib/people';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const sponsors = await getSponsors({tenantId: tenant.id, locale});

  return NextResponse.json({data: sponsors});
}
