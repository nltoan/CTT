import {getPostListing} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const limit = searchParams.get('limit');
  const pageParam = searchParams.get('page');
  const category = searchParams.get('category') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;
  const query = searchParams.get('q') ?? undefined;

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
  const normalizedLimit =
    typeof parsedLimit === 'number' && !Number.isNaN(parsedLimit) ? parsedLimit : undefined;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : undefined;
  const normalizedPage =
    typeof parsedPage === 'number' && !Number.isNaN(parsedPage) ? parsedPage : undefined;
  const normalizedCategory = category?.trim() || undefined;
  const normalizedTag = tag?.trim() || undefined;
  const normalizedQuery = query?.trim() || undefined;

  const result = await getPostListing({
    tenantId: tenant.id,
    locale,
    limit: normalizedLimit,
    page: normalizedPage,
    category: normalizedCategory,
    tag: normalizedTag,
    q: normalizedQuery
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        filters: {
          category: normalizedCategory ?? null,
          tag: normalizedTag ?? null,
          q: normalizedQuery ?? null
        }
      }
    },
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:posts']
  });
}
