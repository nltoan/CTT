import type {Metadata} from 'next';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Pagination} from '@components/layout/Pagination';
import {EventList} from '@components/blocks/EventList';
import {getNavigation} from '@lib/pages';
import {getEventFilters, getEventListing} from '@lib/events';
import {createCollectionMetadata, buildEventsGraphJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS: {
  value: 'upcoming' | 'past' | 'all';
  labelVi: string;
  labelEn: string;
}[] = [
  {value: 'upcoming', labelVi: 'Sắp diễn ra', labelEn: 'Upcoming'},
  {value: 'past', labelVi: 'Đã diễn ra', labelEn: 'Past'},
  {value: 'all', labelVi: 'Tất cả', labelEn: 'All'}
];

type SearchParams = Record<string, string | string[] | undefined>;

function pickParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function buildQueryString(params: Record<string, string | undefined>) {
  const filtered = Object.entries(params).filter(([, value]) => value && value.trim().length > 0) as [string, string][];
  if (!filtered.length) {
    return '';
  }
  return `?${new URLSearchParams(filtered).toString()}`;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; tenant?: string};
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const title = locale === 'vi' ? 'Sự kiện & lịch trình' : 'Events & schedule';
  const description =
    locale === 'vi'
      ? 'Khám phá toàn bộ audition, workshop và concert dành cho thí sinh âm nhạc.'
      : 'Discover every audition, workshop, and concert for the competition.';

  const status = pickParam(searchParams?.status);
  const category = pickParam(searchParams?.category);
  const q = pickParam(searchParams?.q);
  const pageParam = pickParam(searchParams?.page);

  const metadataParams: Record<string, string> = {};
  if (status && status !== 'upcoming') metadataParams.status = status;
  if (category) metadataParams.category = category;
  if (q) metadataParams.q = q;
  if (pageParam && pageParam !== '1') metadataParams.page = pageParam;

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['events'],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function EventsIndex({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; tenant?: string};
  searchParams?: SearchParams;
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const status = (pickParam(searchParams?.status) as 'upcoming' | 'past' | 'all' | undefined) ?? 'upcoming';
  const category = pickParam(searchParams?.category)?.trim() || undefined;
  const q = pickParam(searchParams?.q)?.trim() || undefined;
  const pageParam = pickParam(searchParams?.page);
  const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10) || 1) : 1;
  const limit = 6;

  const [headerNavigation, footerNavigation, listing, filters] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getEventListing({
      tenantId: tenant.id,
      locale,
      page,
      limit,
      status,
      category,
      q
    }),
    getEventFilters({tenantId: tenant.id, locale})
  ]);

  const events = listing.items;
  const basePath = `/${locale}${tenantPath}/events`;
  const filtersQueryString = buildQueryString({
    status: status !== 'upcoming' ? status : undefined,
    category: category ?? undefined,
    q: q ?? undefined
  });

  const eventsJsonLd = buildEventsGraphJsonLd({
    events,
    tenant,
    locale,
    tenantPath,
    settings
  });

  const hasFilters = Boolean((status && status !== 'upcoming') || category || q);

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {eventsJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(eventsJsonLd)}} />
      )}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <header className="space-y-3 text-center">
            <h1 className="font-display text-4xl text-secondary">
              {locale === 'vi' ? 'Sự kiện & lịch trình' : 'Events & schedule'}
            </h1>
            <p className="text-base text-gray-600">
              {locale === 'vi'
                ? 'Khám phá audition, workshop và concert quan trọng dành cho thí sinh.'
                : 'Explore the key auditions, workshops, and concerts for participants.'}
            </p>
          </header>

          <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <form action={basePath} method="get" className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                  <span className="text-sm text-gray-500">{locale === 'vi' ? 'Tìm kiếm' : 'Search'}</span>
                  <input
                    type="search"
                    name="q"
                    defaultValue={q ?? ''}
                    placeholder={
                      locale === 'vi'
                        ? 'Nhập từ khóa, ví dụ: concert, workshop'
                        : 'Enter keywords, e.g. concert, workshop'
                    }
                    className="flex-1 border-none bg-transparent text-sm text-secondary outline-none"
                  />
                </label>
                <select
                  name="status"
                  defaultValue={status}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-secondary focus:border-primary focus:outline-none"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {locale === 'vi' ? option.labelVi : option.labelEn}
                    </option>
                  ))}
                </select>
                {category && <input type="hidden" name="category" value={category} />}
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80"
                >
                  {locale === 'vi' ? 'Áp dụng' : 'Apply'}
                </button>
              </div>
            </form>

            {filters.categories.length ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-secondary">
                  {locale === 'vi' ? 'Danh mục:' : 'Category:'}
                </span>
                <Link
                  href={`${basePath}${buildQueryString({
                    status: status !== 'upcoming' ? status : undefined,
                    q: q ?? undefined
                  })}`}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    !category
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {locale === 'vi' ? 'Tất cả' : 'All'}
                </Link>
                {filters.categories.map((cat) => {
                  const isActive = category === cat;
                  const href = `${basePath}${buildQueryString({
                    status: status !== 'upcoming' ? status : undefined,
                    category: cat,
                    q: q ?? undefined
                  })}`;
                  return (
                    <Link
                      key={cat}
                      href={href}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span>{locale === 'vi' ? 'Bộ lọc đang áp dụng:' : 'Active filters:'}</span>
                {status && status !== 'upcoming' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                    {locale === 'vi'
                      ? STATUS_OPTIONS.find((option) => option.value === status)?.labelVi
                      : STATUS_OPTIONS.find((option) => option.value === status)?.labelEn}
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">{category}</span>
                )}
                {q && <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">{q}</span>}
                <Link
                  href={basePath}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-secondary hover:bg-gray-100"
                >
                  {locale === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <EventList
              block={{
                type: 'event-list',
                title: undefined,
                description: undefined,
                showDetailLinks: true,
                detailLabel: locale === 'vi' ? 'Xem chi tiết' : 'View details',
                ctaLabel: events.length ? (locale === 'vi' ? 'Xem toàn bộ lịch' : 'View full schedule') : undefined
              }}
              events={events}
              locale={locale}
              tenantPath={tenantPath}
            />
            {events.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                {locale === 'vi'
                  ? 'Hiện chưa có sự kiện phù hợp với bộ lọc. Hãy thử điều chỉnh điều kiện tìm kiếm.'
                  : 'No events match the current filters. Try adjusting your search.'}
              </p>
            )}
            {listing.totalPages > 1 && (
              <Pagination
                currentPage={listing.page}
                totalPages={listing.totalPages}
                basePath={basePath}
                queryString={filtersQueryString}
                locale={locale}
              />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
