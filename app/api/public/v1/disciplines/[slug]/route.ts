import {
  getDiscipline,
  getRelatedDisciplines,
  getDisciplineTranslationLinks
} from '@lib/disciplines';
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
    identifier: 'disciplines:detail'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const discipline = await getDiscipline({
    tenantId: tenant.id,
    locale,
    slug: context.params.slug
  });

  if (!discipline) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Discipline not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const [related, translations] = await Promise.all([
    getRelatedDisciplines({
      tenantId: tenant.id,
      locale,
      excludeSlug: discipline.slug,
      limit: 4
    }),
    getDisciplineTranslationLinks({
      translationKey: discipline.translationKey,
      disciplineId: discipline.id
    })
  ]);

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: discipline, related, translations},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `discipline:${discipline.id}`],
    headers: rateLimit.headers
  });
}
