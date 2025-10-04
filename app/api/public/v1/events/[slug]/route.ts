import {getEvent} from '@lib/events';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request, {params}: {params: {slug: string}}) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'events:detail'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const event = await getEvent({tenantId: tenant.id, locale, slug: params.slug});

  if (!event) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Event not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: event},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `event:${event.id}`],
    headers: rateLimit.headers
  });
}
