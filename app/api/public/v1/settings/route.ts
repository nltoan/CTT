import {jsonResponseWithCache} from '@lib/http';
import {getSettingsForTenant} from '@lib/settings';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: settings},
    ttl: settings.revalidateSeconds,
    cacheTags: [`tenant:${tenant.id}`, 'collection:settings']
  });
}
