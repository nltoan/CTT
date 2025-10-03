import {NextRequest} from 'next/server';

import {getGallery} from '@lib/galleries';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: NextRequest, context: {params: {slug: string}}) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});

  const gallery = await getGallery({
    tenantId: tenant.id,
    locale,
    slug: context.params.slug
  });

  if (!gallery) {
    return jsonResponseWithCache({
      request,
      status: 404,
      ttl: 0,
      body: {error: 'Gallery not found'}
    });
  }

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `gallery:${gallery.id}`],
    body: {data: gallery}
  });
}
