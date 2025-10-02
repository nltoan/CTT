import {getEvents} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const events = await getEvents({
    tenantId: tenant.id,
    locale,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: events},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:events']
  });
}
