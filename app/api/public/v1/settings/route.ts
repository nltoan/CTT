import {jsonResponseWithCache} from '@lib/http';
import {getSettingsForTenant} from '@lib/settings';
import {resolveTenantFromParams} from '@lib/tenant';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'settings:get'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: settings},
    ttl: settings.revalidateSeconds,
    cacheTags: [`tenant:${tenant.id}`, 'collection:settings'],
    headers: rateLimit.headers
  });
}
