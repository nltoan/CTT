import {findSlideshowById} from '@data/slideshows';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export async function GET(request: Request, context: {params: {id: string}}) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: 'slideshows:detail'
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const slideshow = findSlideshowById(context.params.id);

  if (!slideshow) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Slideshow not found'},
      status: 404,
      ttl: 0,
      headers: rateLimit.headers
    });
  }

  const ttl = getApiCacheTtl({tenantId: slideshow.tenantId, locale: slideshow.locale});

  return jsonResponseWithCache({
    request,
    body: {data: slideshow},
    ttl,
    cacheTags: [`tenant:${slideshow.tenantId}`, `slideshow:${slideshow.id}`],
    headers: rateLimit.headers
  });
}
