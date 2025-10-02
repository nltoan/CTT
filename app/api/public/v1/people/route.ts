import {getPeople} from '@lib/people';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const limitParam = searchParams.get('limit');

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const people = await getPeople({
    tenantId: tenant.id,
    locale,
    limit: limitParam ? Number.parseInt(limitParam, 10) : undefined
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: people},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:people']
  });
}
