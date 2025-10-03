import {findTenantBySlug} from '@data/tenants';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {defaultLocale} from '@i18n/config';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request, context: {params: {slug: string}}) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'tenant:detail'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const tenant = findTenantBySlug(context.params.slug);

  if (!tenant) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Tenant not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale: defaultLocale});

  return jsonResponseWithCache({
    request,
    body: {data: tenant},
    ttl,
    cacheTags: [`tenant:${tenant.id}`],
    headers: rateLimit.headers
  });
}
