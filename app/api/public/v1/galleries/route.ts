import {getGalleryFilters, getGalleryListing} from '@lib/galleries';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';
import {resolveTenantFromParams} from '@lib/tenant';

function parseNumber(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') ?? undefined;
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const limit = parseNumber(searchParams.get('limit'));
  const page = parseNumber(searchParams.get('page'));
  const category = searchParams.get('category')?.trim() || undefined;
  const tag = searchParams.get('tag')?.trim() || undefined;
  const q = searchParams.get('q')?.trim() || undefined;
  const sortParam = searchParams.get('sort');
  const includeFilters = searchParams.get('includeFilters');

  const sort = sortParam === 'oldest' ? 'oldest' : 'latest';
  const tenant = resolveTenantFromParams({tenantParam: tenantSlug});

  const listing = await getGalleryListing({
    tenantId: tenant.id,
    locale,
    limit,
    page,
    category,
    tag,
    q,
    sort
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});
  const meta = listing.meta;
  const hasMore = meta.page < meta.totalPages;

  let filters: Awaited<ReturnType<typeof getGalleryFilters>> | undefined;
  if (includeFilters && ['1', 'true', 'yes'].includes(includeFilters.toLowerCase())) {
    filters = await getGalleryFilters({tenantId: tenant.id, locale});
  }

  return jsonResponseWithCache({
    request,
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:galleries'],
    body: {
      data: listing.items,
      meta: {
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
        page: meta.page,
        limit: meta.limit,
        hasMore,
        appliedFilters: {
          category: category ?? null,
          tag: tag ?? null,
          q: q ?? null,
          sort
        }
      },
      filters
    }
  });
}
