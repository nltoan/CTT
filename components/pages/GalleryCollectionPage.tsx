import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Pagination} from '@components/layout/Pagination';
import type {Navigation, Gallery, Tenant} from '@types/cms';
import type {ResolvedSiteSettings} from '@lib/settings';
import type {GalleryCategoryFacet, GalleryTagFacet} from '@lib/galleries';

export type GalleryCollectionListing = {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
};

export type GalleryCollectionPageProps = {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings: ResolvedSiteSettings;
  headerNavigation?: Navigation;
  footerNavigation?: Navigation;
  galleries: Gallery[];
  listing: GalleryCollectionListing;
  filters: {
    categories: GalleryCategoryFacet[];
    tags: GalleryTagFacet[];
  };
  activeFilters: {
    categorySlug?: string;
    categoryFacet?: GalleryCategoryFacet | null;
    tagSlug?: string;
    tagFacet?: GalleryTagFacet | null;
    q?: string;
    sort: 'latest' | 'oldest';
  };
  basePath: string;
  heading: string;
  description: string;
  searchPlaceholder?: string;
  clearFiltersHref?: string;
  galleryListJsonLd?: unknown;
  emptyStateMessage?: string;
  lockCategorySelect?: boolean;
  lockTagSelect?: boolean;
  canonicalLabel?: string;
};

function buildHref({
  basePath,
  page,
  category,
  tag,
  q,
  sort
}: {
  basePath: string;
  page: number;
  category?: string | null;
  tag?: string | null;
  q?: string | null;
  sort?: 'latest' | 'oldest';
}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  if (q) params.set('q', q);
  if (sort && sort === 'oldest') params.set('sort', sort);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function GalleryCollectionPage({
  tenant,
  locale,
  tenantPath,
  settings,
  headerNavigation,
  footerNavigation,
  galleries,
  listing,
  filters,
  activeFilters,
  basePath,
  heading,
  description,
  searchPlaceholder,
  clearFiltersHref,
  galleryListJsonLd,
  emptyStateMessage,
  lockCategorySelect = false,
  lockTagSelect = false,
  canonicalLabel
}: GalleryCollectionPageProps) {
  const categorySlug = activeFilters.categorySlug;
  const tagSlug = activeFilters.tagSlug;
  const categoryFacet = activeFilters.categoryFacet;
  const tagFacet = activeFilters.tagFacet;
  const query = activeFilters.q;
  const sort = activeFilters.sort;
  const hasActiveFilters = Boolean(categorySlug || tagSlug || query || sort === 'oldest');

  const makeHref = (page: number) =>
    buildHref({
      basePath,
      page,
      category: categorySlug ?? null,
      tag: tagSlug ?? null,
      q: query ?? null,
      sort
    });

  const summaryText =
    locale === 'vi'
      ? `${listing.totalItems} bộ sưu tập`
      : `${listing.totalItems} galleries`;

  const defaultEmptyState =
    locale === 'vi'
      ? 'Chưa có bộ sưu tập phù hợp với điều kiện lọc hiện tại.'
      : 'No galleries match the current filters yet.';

  const resolvedEmptyState = emptyStateMessage ?? defaultEmptyState;

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {galleryListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(galleryListJsonLd)}} />
      )}
      <section className="bg-white py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          <header className="flex flex-col gap-4 text-center">
            <h1 className="font-display text-4xl text-secondary">{heading}</h1>
            <p className="text-base text-gray-600">{description}</p>
          </header>

          <form className="grid gap-4 rounded-3xl bg-slate-50 p-6 shadow-sm md:grid-cols-2 lg:grid-cols-4" action={basePath} method="get">
            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
              <input
                type="search"
                name="q"
                defaultValue={query ?? ''}
                placeholder={
                  searchPlaceholder ??
                  (locale === 'vi' ? 'Từ khóa, nội dung...' : 'Keyword, content...')
                }
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Danh mục' : 'Category'}
              {lockCategorySelect && categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
              <select
                name="category"
                defaultValue={categorySlug ?? ''}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={lockCategorySelect}
              >
                <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
                {filters.categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              {locale === 'vi' ? 'Thẻ' : 'Tag'}
              {lockTagSelect && tagSlug ? <input type="hidden" name="tag" value={tagSlug} /> : null}
              <select
                name="tag"
                defaultValue={tagSlug ?? ''}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={lockTagSelect}
              >
                <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
                {filters.tags.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
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
                    href={clearFiltersHref ?? basePath}
                    className="text-sm font-medium text-primary underline-offset-4 hover:opacity-80"
                  >
                    {locale === 'vi' ? 'Bỏ lọc' : 'Clear filters'}
                  </Link>
                ) : null}
              </div>
              <p className="text-xs font-normal text-gray-500">{summaryText}</p>
            </div>
          </form>

          {hasActiveFilters ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600">
              {locale === 'vi'
                ? `Đang hiển thị kết quả với ${[
                    categoryFacet ? `chủ đề "${categoryFacet.label}"` : null,
                    tagFacet ? `thẻ #${tagFacet.label}` : null,
                    query ? `từ khóa "${query}"` : null,
                    sort === 'oldest' ? 'sắp xếp cũ nhất' : null
                  ]
                    .filter(Boolean)
                    .join(', ') || 'bộ lọc mặc định.'}`
                : `Showing results with ${[
                    categoryFacet ? `category "${categoryFacet.label}"` : null,
                    tagFacet ? `tag #${tagFacet.label}` : null,
                    query ? `keyword "${query}"` : null,
                    sort === 'oldest' ? 'oldest first' : null
                  ]
                    .filter(Boolean)
                    .join(', ') || 'default filters.'}`}
              {canonicalLabel ? (
                <span className="block pt-2 text-xs text-gray-400">
                  {locale === 'vi'
                    ? `Liên kết chuẩn: ${canonicalLabel}`
                    : `Canonical label: ${canonicalLabel}`}
                </span>
              ) : null}
            </div>
          ) : null}

          {galleries.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galleries.map((gallery) => {
                const detailHref = `${basePath}/${gallery.slug}`.replace(/\/+/, '/');
                const categoryLabel = gallery.category
                  ? filters.categories.find((facet) => facet.key === gallery.category)?.label ?? gallery.category
                  : null;

                return (
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
                      {categoryLabel ? (
                        <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          {categoryLabel}
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
                          {gallery.tags.map((tagItem) => {
                            const resolvedLabel =
                              filters.tags.find((facet) => facet.key === tagItem)?.label ?? tagItem;
                            return (
                              <span
                                key={tagItem}
                                className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                              >
                                #{resolvedLabel}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                      <div className="mt-auto pt-4">
                        <Link
                          href={detailHref}
                          className="inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:opacity-80"
                        >
                          {locale === 'vi' ? 'Xem bộ sưu tập' : 'View gallery'} →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center text-sm text-gray-500">
              {resolvedEmptyState}
            </div>
          )}

          <Pagination currentPage={listing.page} totalPages={listing.totalPages} makeHref={makeHref} locale={locale} />
        </div>
      </section>
    </PageShell>
  );
}
