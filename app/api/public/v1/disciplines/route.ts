import {getDisciplineListing} from '@lib/disciplines';
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
    identifier: 'disciplines:list'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const limitParam = searchParams.get('limit');
  const pageParam = searchParams.get('page');
  const category = searchParams.get('category') ?? undefined;
  const level = searchParams.get('level') ?? undefined;
  const q = searchParams.get('q') ?? undefined;

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const listing = await getDisciplineListing({
    tenantId: tenant.id,
    locale,
    limit: limitParam ? Number.parseInt(limitParam, 10) || undefined : undefined,
    page: pageParam ? Number.parseInt(pageParam, 10) || undefined : undefined,
    category,
    level,
    q
  });

  const {items, ...meta} = listing;

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: items, meta},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:disciplines'],
    headers: rateLimit.headers
  });
}
