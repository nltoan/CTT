import {getPeople} from '@lib/people';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'people:list'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

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
    cacheTags: [`tenant:${tenant.id}`, 'collection:people'],
    headers: rateLimit.headers
  });
}
