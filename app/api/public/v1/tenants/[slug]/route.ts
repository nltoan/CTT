import {findTenantBySlug} from '@data/tenants';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {defaultLocale} from '@i18n/config';

export async function GET(request: Request, context: {params: {slug: string}}) {
  const tenant = findTenantBySlug(context.params.slug);

  if (!tenant) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Tenant not found'},
      status: 404,
      ttl: 0
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale: defaultLocale});

  return jsonResponseWithCache({
    request,
    body: {data: tenant},
    ttl,
    cacheTags: [`tenant:${tenant.id}`]
  });
}
