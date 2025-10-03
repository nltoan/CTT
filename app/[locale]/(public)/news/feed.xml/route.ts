import {buildNewsRssFeed} from '@lib/feeds';
import {textResponseWithCache} from '@lib/http';
import {getRecentPosts} from '@lib/pages';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export async function GET(
  request: Request,
  {params}: {params: {locale: 'vi' | 'en'}}
) {
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    identifier: `rss:${params.locale}`
  });

  if (!rateLimit.ok) {
    return tooManyRequestsResponse(rateLimit);
  }

  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {slug: ['news', 'feed.xml']},
    locale: params.locale
  });

  const [posts, settings] = await Promise.all([
    getRecentPosts({tenantId: tenant.id, locale, limit: 50}),
    getSettingsForTenant({tenantId: tenant.id, locale})
  ]);

  const rss = buildNewsRssFeed({tenant, locale, tenantPath, posts, settings});

  return textResponseWithCache({
    request,
    body: rss,
    ttl: settings.revalidateSeconds,
    contentType: 'application/rss+xml; charset=utf-8',
    headers: {
      ...rateLimit.headers,
      'Content-Disposition': `inline; filename="${tenant.slug}-news-${locale}.xml"`
    },
    cacheTags: ['news-feed', tenant.id]
  });
}
