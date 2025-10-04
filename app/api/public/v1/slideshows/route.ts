import {getSlideshows} from '@lib/slideshows';
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
    identifier: 'slideshows:list'
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
  const slideshows = await getSlideshows({
    tenantId: tenant.id,
    locale,
    limit: normalizedLimit
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {
      data: slideshows,
      meta: {
        total: slideshows.length
      }
    },
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'slideshows:list'],
    headers: rateLimit.headers
  });
}
