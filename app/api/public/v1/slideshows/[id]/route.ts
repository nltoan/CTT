import {getSlideshow} from '@lib/slideshows';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request, context: {params: {id: string}}) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'slideshows:detail'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const limitParam = searchParams.get('limit');

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
  const normalizedLimit =
    typeof parsedLimit === 'number' && !Number.isNaN(parsedLimit) ? parsedLimit : undefined;
  const slideshow = await getSlideshow({
    tenantId: tenant.id,
    locale,
    id: context.params.id,
    limit: normalizedLimit
  });

  if (!slideshow) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Slideshow not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: slideshow},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `slideshow:${slideshow.id}`],
    headers: rateLimit.headers
  });
}
