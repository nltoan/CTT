import {getPersonBySlug, getRelatedPeople} from '@lib/people';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request, context: {params: {slug: string}}) {
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
      ttl: 0
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
    cacheTags: [`tenant:${tenant.id}`, `person:${person.id}`]
  });
}
