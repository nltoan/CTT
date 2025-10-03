import {getSponsors} from '@lib/people';
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
    identifier: 'sponsors:list'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const sponsors = await getSponsors({tenantId: tenant.id, locale});

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: sponsors},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:sponsors'],
    headers: rateLimit.headers
  });
}
