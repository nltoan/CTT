import {getPersonBySlug, getRelatedPeople} from '@lib/people';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request, context: {params: {slug: string}}) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'people:detail'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const person = await getPersonBySlug({
    tenantId: tenant.id,
    locale,
    slug: context.params.slug
  });

  if (!person) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Person not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const related = await getRelatedPeople({
    tenantId: tenant.id,
    locale,
    excludePersonId: person.id,
    limit: 4
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: person, related},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `person:${person.id}`],
    headers: rateLimit.headers
  });
}
