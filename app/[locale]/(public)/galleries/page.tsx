import type {Metadata} from 'next';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Pagination} from '@components/layout/Pagination';
import {getNavigation} from '@lib/pages';
import {getGalleryFilters, getGalleryListing} from '@lib/galleries';
import {createCollectionMetadata, buildGalleryListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

type NormalizedSearch = {
  category?: string;
  tag?: string;
  q?: string;
  sort: 'latest' | 'oldest';
  page: number;
};

function pickParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function normalizeSearchParams(searchParams?: SearchParams): NormalizedSearch {
  const category = pickParam(searchParams?.category)?.trim() || undefined;
  const tag = pickParam(searchParams?.tag)?.trim() || undefined;
  const q = pickParam(searchParams?.q)?.trim() || undefined;
  const sortParam = pickParam(searchParams?.sort);
  const pageParam = pickParam(searchParams?.page);
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
  const sort = sortParam === 'oldest' ? 'oldest' : 'latest';

  return {category, tag, q, sort, page};
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'};
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const {category, tag, q, sort, page} = normalizeSearchParams(searchParams);

  const description =
    locale === 'vi'
      ? 'Khám phá các bộ sưu tập hình ảnh và video nổi bật từ sự kiện CTT.'
      : 'Browse curated photo and video galleries from CTT performances and activities.';

  const metadataParams: Record<string, string> = {};
  if (category) metadataParams.category = category;
  if (tag) metadataParams.tag = tag;
  if (q) metadataParams.q = q;
  if (sort === 'oldest') metadataParams.sort = 'oldest';
  if (page > 1) metadataParams.page = String(page);

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['galleries'],
    title: locale === 'vi' ? 'Thư viện' : 'Galleries',
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function GalleriesPage({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'};
  searchParams?: SearchParams;
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const {category, tag, q, sort, page} = normalizeSearchParams(searchParams);

  const [listing, filters, headerNavigation, footerNavigation, settings] = await Promise.all([
    getGalleryListing({
      tenantId: tenant.id,
      locale,
      category,
      tag,
      q,
      sort,
      page,
      limit: 9
    }),
    getGalleryFilters({tenantId: tenant.id, locale}),
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getSettingsForTenant({tenantId: tenant.id, locale})
  ]);

  const jsonLd = buildGalleryListJsonLd({
    galleries: listing.items,
    tenant,
    locale,
    tenantPath,
    settings
  });

  const hasActiveFilters = Boolean(category || tag || q || sort === 'oldest');
  const basePath = `/${[locale, tenantPath.replace(/^\//, ''), 'galleries'].filter(Boolean).join('/')}`.replace(/\/+/, '/');
  const baseParams = new URLSearchParams();
  if (category) baseParams.set('category', category);
  if (tag) baseParams.set('tag', tag);
  if (q) baseParams.set('q', q);
  if (sort === 'oldest') baseParams.set('sort', 'oldest');

  const makeHref = (targetPage: number) => {
    const paramsForPage = new URLSearchParams(baseParams);
    if (targetPage > 1) {
      paramsForPage.set('page', String(targetPage));
    }
    const queryString = paramsForPage.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      <section className="bg-white py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          <header className="flex flex-col gap-4 text-center">
            {jsonLd ? (
              <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
            ) : null}
            <h1 className="font-display text-4xl text-secondary">
              {locale === 'vi' ? 'Thư viện hình ảnh & video' : 'Photo & video galleries'}
            </h1>
            <p className="text-base text-gray-600">
              {locale === 'vi'
                ? 'Tổng hợp các khoảnh khắc đáng nhớ từ cuộc thi và chương trình giao lưu âm nhạc CTT.'
                : 'Relive standout CTT performances, rehearsals, and behind-the-scenes moments.'}
            </p>
          </header>

          <form className="grid gap-4 rounded-3xl bg-slate-50 p-6 shadow-sm md:grid-cols-2 lg:grid-cols-4" method="get">
            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
              <input
                type="search"
                name="q"
                defaultValue={q ?? ''}
                placeholder={locale === 'vi' ? 'Từ khóa, nội dung...' : 'Keyword, content...'}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Danh mục' : 'Category'}
              <select
                name="category"
                defaultValue={category ?? ''}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
                {filters.categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Thẻ' : 'Tag'}
              <select
                name="tag"
                defaultValue={tag ?? ''}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
                {filters.tags.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Sắp xếp' : 'Sort by'}
              <select
                name="sort"
                defaultValue={sort}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="latest">{locale === 'vi' ? 'Mới nhất' : 'Newest first'}</option>
                <option value="oldest">{locale === 'vi' ? 'Cũ nhất' : 'Oldest first'}</option>
              </select>
            </label>
            <div className="flex flex-col gap-2 text-sm font-medium text-secondary md:col-span-2 lg:col-span-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  {locale === 'vi' ? 'Áp dụng' : 'Apply filters'}
                </button>
                {hasActiveFilters ? (
                  <Link
                    href={basePath}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {locale === 'vi' ? 'Bỏ lọc' : 'Clear filters'}
                  </Link>
                ) : null}
              </div>
              <p className="text-xs font-normal text-gray-500">
                {locale === 'vi'
                  ? `${listing.meta.totalItems} bộ sưu tập`
                  : `${listing.meta.totalItems} galleries`}
              </p>
            </div>
          </form>

          {listing.items.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listing.items.map((gallery) => (
                <article
                  key={gallery.id}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {gallery.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={gallery.coverImage.url}
                      alt={gallery.coverImage.alt ?? gallery.title}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    {gallery.category ? (
                      <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {gallery.category}
                      </span>
                    ) : null}
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-secondary">{gallery.title}</h2>
                      {gallery.description ? (
                        <p className="text-sm text-gray-600 line-clamp-3">{gallery.description}</p>
                      ) : null}
                    </div>
                    {gallery.tags?.length ? (
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {gallery.tags.map((tagItem) => (
                          <span
                            key={tagItem}
                            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                          >
                            #{tagItem}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-auto pt-4">
                      <Link
                        href={`${basePath}/${gallery.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-primary hover:opacity-80"
                      >
                        {locale === 'vi' ? 'Xem bộ sưu tập' : 'View gallery'} →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center text-sm text-gray-500">
              {locale === 'vi'
                ? 'Chưa có bộ sưu tập phù hợp với điều kiện lọc hiện tại.'
                : 'No galleries match the current filters yet.'}
            </div>
          )}

          <Pagination
            currentPage={listing.meta.page}
            totalPages={listing.meta.totalPages}
            makeHref={makeHref}
            locale={locale}
          />
        </div>
      </section>
    </PageShell>
  );
}
