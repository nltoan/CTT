import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Pagination} from '@components/layout/Pagination';
import type {Navigation, Post, Tenant} from '@types/cms';
import type {ResolvedSiteSettings} from '@lib/settings';
import type {PostCategoryFacet, PostTagFacet} from '@data/posts';

import {buildQueryString} from '@lib/url';

export type ActiveNewsFilters = {
  category?: string;
  tag?: string;
  q?: string;
};

export type PersistedNewsFilters = {
  category?: string;
  tag?: string;
};

export type NewsCollectionPageProps = {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings: ResolvedSiteSettings;
  headerNavigation?: Navigation;
  footerNavigation?: Navigation;
  posts: Post[];
  listing: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasMore: boolean;
  };
  filters: {
    categories: PostCategoryFacet[];
    tags: PostTagFacet[];
  };
  activeFilters: ActiveNewsFilters;
  persistedFilters?: PersistedNewsFilters;
  basePath: string;
  heading: string;
  description: string;
  searchPlaceholder?: string;
  newsListJsonLd?: unknown;
  clearFiltersHref?: string;
  clearFiltersLabel?: string;
  showCategoryFilter?: boolean;
  showTagFilter?: boolean;
  emptyStateMessage?: string;
  canonicalLabel?: string;
};

export function NewsCollectionPage({
  tenant,
  locale,
  tenantPath,
  settings,
  headerNavigation,
  footerNavigation,
  posts,
  listing,
  filters,
  activeFilters,
  persistedFilters,
  basePath,
  heading,
  description,
  searchPlaceholder,
  newsListJsonLd,
  clearFiltersHref,
  clearFiltersLabel,
  showCategoryFilter = true,
  showTagFilter = true,
  emptyStateMessage,
  canonicalLabel
}: NewsCollectionPageProps) {
  const category = activeFilters.category;
  const tag = activeFilters.tag;
  const q = activeFilters.q;

  const hiddenCategory = persistedFilters?.category ?? category;
  const hiddenTag = persistedFilters?.tag ?? tag;

  const sanitizedQuery = buildQueryString({
    page: listing.page,
    category: hiddenCategory ?? null,
    tag: hiddenTag ?? null,
    q: q ?? null
  });

  const hasActiveFilters = Boolean(category || tag || q);

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {newsListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(newsListJsonLd)}} />
      )}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <header className="space-y-3 text-center">
            <h1 className="font-display text-4xl text-secondary">{heading}</h1>
            <p className="text-base text-gray-600">{description}</p>
          </header>

          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <form className="flex flex-wrap items-center gap-3" action={basePath} method="get">
              {hiddenCategory && <input type="hidden" name="category" value={hiddenCategory} />}
              {hiddenTag && <input type="hidden" name="tag" value={hiddenTag} />}
              <label className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                <span className="text-sm text-gray-500">{locale === 'vi' ? 'Tìm kiếm' : 'Search'}</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={q ?? ''}
                  placeholder={
                    searchPlaceholder
                      ?? (locale === 'vi'
                        ? 'Nhập từ khóa, ví dụ: vòng chung kết'
                        : 'Search by keyword, e.g. finals')
                  }
                  className="flex-1 border-none bg-transparent text-sm text-secondary outline-none"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80"
              >
                {locale === 'vi' ? 'Lọc bài viết' : 'Apply'}
              </button>
              {clearFiltersHref && hasActiveFilters && (
                <Link
                  href={clearFiltersHref}
                  className="text-sm font-medium text-secondary underline-offset-4 hover:opacity-80"
                >
                  {clearFiltersLabel ?? (locale === 'vi' ? 'Xóa bộ lọc' : 'Clear filters')}
                </Link>
              )}
            </form>

            {showCategoryFilter && filters.categories.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {locale === 'vi' ? 'Chủ đề' : 'Categories'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map((item) => {
                    const isActive = item.label === category;
                    const href = `${basePath}${buildQueryString({
                      page: 1,
                      category: isActive ? null : item.label,
                      tag: tag ?? null,
                      q: q ?? null
                    })}`;
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {showTagFilter && filters.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {locale === 'vi' ? 'Thẻ' : 'Tags'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((item) => {
                    const isActive = item.label === tag;
                    const href = `${basePath}${buildQueryString({
                      page: 1,
                      category: category ?? null,
                      tag: isActive ? null : item.label,
                      q: q ?? null
                    })}`;
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? 'border-secondary bg-secondary/10 text-secondary'
                            : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        #{item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <p className="text-xs text-gray-500">
                {locale === 'vi'
                  ? `Đang hiển thị kết quả với ${[
                      category ? `chủ đề "${category}"` : null,
                      tag ? `thẻ #${tag}` : null,
                      q ? `từ khóa "${q}"` : null
                    ]
                      .filter(Boolean)
                      .join(', ')}.`
                  : `Showing results filtered by ${[
                      category ? `category "${category}"` : null,
                      tag ? `#${tag}` : null,
                      q ? `keyword "${q}"` : null
                    ]
                      .filter(Boolean)
                      .join(', ')}.`}
              </p>
            )}
          </section>

          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="space-y-3 p-6">
                    <time className="text-xs font-semibold uppercase text-primary">
                      {new Date(post.publishedAt).toLocaleDateString(
                        locale === 'en' ? 'en-US' : 'vi-VN'
                      )}
                    </time>
                    <h2 className="text-xl font-semibold text-secondary">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-gray-600">{post.excerpt}</p>}
                    <Link
                      href={`/${locale}${tenantPath}/news/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                    >
                      {locale === 'vi' ? 'Đọc thêm' : 'Read more'} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              {emptyStateMessage
                ?? (locale === 'vi'
                  ? 'Chưa có bài viết nào phù hợp với bộ lọc hiện tại. Thử thay đổi tiêu chí để tìm thêm nội dung.'
                  : 'No articles match the selected filters. Try adjusting your criteria to discover more content.')}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {locale === 'vi'
                ? `Tổng cộng ${listing.total} bài viết`
                : `${listing.total} articles in total`}
            </span>
            <span>
              {locale === 'vi'
                ? `Trang ${listing.page}/${listing.totalPages}`
                : `Page ${listing.page} of ${listing.totalPages}`}
            </span>
          </div>

          <Pagination
            currentPage={listing.page}
            totalPages={listing.totalPages}
            locale={locale}
            makeHref={(pageNumber) =>
              `${basePath}${buildQueryString({
                page: pageNumber,
                category: hiddenCategory ?? null,
                tag: hiddenTag ?? null,
                q: q ?? null
              })}`
            }
          />

          <div className="text-center text-xs text-gray-400">
            {canonicalLabel ?? (locale === 'vi' ? 'Đường dẫn chuẩn: ' : 'Canonical query: ')}
            <code className="rounded bg-gray-100 px-2 py-1">{`${basePath}${sanitizedQuery}`}</code>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
