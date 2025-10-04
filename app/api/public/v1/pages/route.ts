import {getPageForTenant} from '@lib/pages';
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
    identifier: 'pages:get'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const slug = searchParams.get('slug') ?? '';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale});

  if (!page) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Page not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: page},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `page:${page.id}`],
    headers: rateLimit.headers
  });
}
