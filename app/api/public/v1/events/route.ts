import {getEventListing} from '@lib/events';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limitParam = searchParams.get('limit');
  const pageParam = searchParams.get('page');
  const statusParam = searchParams.get('status');
  const status: 'upcoming' | 'past' | 'all' | null =
    statusParam === 'upcoming' || statusParam === 'past' || statusParam === 'all'
      ? statusParam
      : null;
  const category = searchParams.get('category');
  const q = searchParams.get('q');

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const listing = await getEventListing({
    tenantId: tenant.id,
    locale,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    limit: limitParam ? Number.parseInt(limitParam, 10) || undefined : undefined,
    page: pageParam ? Number.parseInt(pageParam, 10) || undefined : undefined,
    status: status ?? undefined,
    category: category ?? undefined,
    q: q ?? undefined
  });
  const {items, ...meta} = listing;

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: items, meta},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, 'collection:events']
  });
}
