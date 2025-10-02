import {getNavigation} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const key = (searchParams.get('key') as 'header' | 'footer') ?? 'header';
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const navigation = await getNavigation({tenantId: tenant.id, key, locale});

  if (!navigation) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Navigation not found'},
      status: 404,
      ttl: 0
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: navigation},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `navigation:${navigation.key}`]
  });
}
