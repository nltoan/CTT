import {getFormView} from '@lib/forms';
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

export async function GET(request: Request, context: {params: {key: string}}) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: `forms:detail:${context.params.key}`
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantParam = searchParams.get('tenant');
  const locale = resolveLocale(searchParams.get('locale'));

  const tenant = resolveTenantFromParams({tenantParam: tenantParam ?? undefined});
  const form = getFormView({tenantId: tenant.id, key: context.params.key, locale});

  if (!form) {
    return jsonResponseWithCache({
      request,
      status: 404,
      ttl: 0,
      body: {error: 'Form not found'},
      headers: rateLimit.headers
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: form},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `form:${form.key}`],
    headers: rateLimit.headers
  });
}
