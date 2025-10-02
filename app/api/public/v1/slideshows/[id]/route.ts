import {findSlideshowById} from '@data/slideshows';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request, context: {params: {id: string}}) {
  const slideshow = findSlideshowById(context.params.id);

  if (!slideshow) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Slideshow not found'},
      status: 404,
      ttl: 0
    });
  }

  const ttl = getApiCacheTtl({tenantId: slideshow.tenantId, locale: slideshow.locale});

  return jsonResponseWithCache({
    request,
    body: {data: slideshow},
    ttl,
    cacheTags: [`tenant:${slideshow.tenantId}`, `slideshow:${slideshow.id}`]
  });
}
