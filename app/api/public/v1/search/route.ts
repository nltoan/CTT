import {findTenantBySlug} from '@data/tenants';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {getDefaultTenant, assertLocale} from '@lib/tenant';
import {searchAllContent, type SearchType} from '@lib/search';
import {defaultLocale} from '@i18n/config';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

function parseTypes(values: string[]): SearchType[] | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  const allowed: SearchType[] = ['posts', 'events', 'galleries', 'people'];
  const set = new Set<SearchType>();

  values.forEach((value) => {
    if (allowed.includes(value as SearchType)) {
      set.add(value as SearchType);
    }
  });

  return set.size > 0 ? Array.from(set) : undefined;
}

export async function GET(request: Request) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'search:query'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const localeParam = searchParams.get('locale') ?? undefined;
  const limitParam = searchParams.get('limit');
  const typeParams = searchParams.getAll('type');

  const tenant = tenantSlug ? findTenantBySlug(tenantSlug) ?? getDefaultTenant() : getDefaultTenant();
  const locale = assertLocale(localeParam ?? '') ? (localeParam as 'vi' | 'en') : defaultLocale;

  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
  const normalizedLimit =
    typeof parsedLimit === 'number' && !Number.isNaN(parsedLimit) ? parsedLimit : undefined;
  const requestedTypes = parseTypes(typeParams);

  const results = await searchAllContent({
    tenantId: tenant.id,
    locale,
    query,
    limit: normalizedLimit,
    types: requestedTypes
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {
      data: results,
      meta: {
        tenant: tenant.slug,
        locale,
        types: requestedTypes ?? ['posts', 'events', 'galleries', 'people']
      }
    },
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'search'],
    headers: rateLimit.headers
  });
}
