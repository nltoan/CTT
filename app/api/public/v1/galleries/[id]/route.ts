import {findGalleryById} from '@data/galleries';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request, context: {params: {id: string}}) {
  const gallery = findGalleryById(context.params.id);

  if (!gallery) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Gallery not found'},
      status: 404,
      ttl: 0
    });
  }

  const ttl = getApiCacheTtl({tenantId: gallery.tenantId, locale: gallery.locale});

  return jsonResponseWithCache({
    request,
    body: {data: gallery},
    ttl,
    cacheTags: [`tenant:${gallery.tenantId}`, `gallery:${gallery.id}`]
  });
}
