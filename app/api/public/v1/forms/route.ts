import {listFormViews} from '@lib/forms';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {resolveTenantFromParams} from '@lib/tenant';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';
import {defaultLocale, locales, type Locale} from '@i18n/config';

function resolveLocale(value: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }

  const maybeLocale = value as Locale;
  return (locales as readonly string[]).includes(maybeLocale) ? maybeLocale : defaultLocale;
}

export async function GET(request: Request) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'forms:list'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantParam = searchParams.get('tenant');
  const locale = resolveLocale(searchParams.get('locale'));

  const tenant = resolveTenantFromParams({tenantParam: tenantParam ?? undefined});
  const forms = listFormViews({tenantId: tenant.id, locale});
  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: forms},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, ...forms.map((form) => `form:${form.key}`)],
    headers: rateLimit.headers
  });
}
