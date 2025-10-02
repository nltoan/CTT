import {getEvent} from '@lib/events';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request, {params}: {params: {slug: string}}) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const event = await getEvent({tenantId: tenant.id, locale, slug: params.slug});

  if (!event) {
    return new Response(JSON.stringify({error: 'Event not found'}), {
      status: 404,
      headers: {'content-type': 'application/json'}
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: event},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `event:${event.id}`]
  });
}
