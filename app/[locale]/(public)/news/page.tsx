import type {Metadata} from 'next';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Pagination} from '@components/layout/Pagination';
import {getNavigation, getPostFilters, getPostListing} from '@lib/pages';
import {createCollectionMetadata, buildNewsListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function pickParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function buildQueryString(base: {
  page?: number;
  category?: string | null;
  tag?: string | null;
  q?: string | null;
}) {
  const params = new URLSearchParams();
  if (base.category) {
    params.set('category', base.category);
  }
  if (base.tag) {
    params.set('tag', base.tag);
  }
  if (base.q) {
    params.set('q', base.q);
  }
  if (base.page && base.page > 1) {
    params.set('page', String(base.page));
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
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

  const title = locale === 'vi' ? 'Tin tức' : 'News';
  const description =
    locale === 'vi'
      ? 'Cập nhật thông tin mới nhất về cuộc thi và các hoạt động âm nhạc.'
      : 'Stay updated with the latest announcements and stories.';

  const category = pickParam(searchParams?.['category']);
  const tag = pickParam(searchParams?.['tag']);
  const q = pickParam(searchParams?.['q']);
  const pageParam = pickParam(searchParams?.['page']);

  const metadataParams: Record<string, string> = {};
  if (category) metadataParams.category = category;
  if (tag) metadataParams.tag = tag;
  if (q) metadataParams.q = q;
  if (pageParam && pageParam !== '1') {
    metadataParams.page = pageParam;
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['news'],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function NewsIndex({
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

  const category = pickParam(searchParams?.['category'])?.trim() || undefined;
  const tag = pickParam(searchParams?.['tag'])?.trim() || undefined;
  const q = pickParam(searchParams?.['q'])?.trim() || undefined;
  const pageParam = pickParam(searchParams?.['page']);
  const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10) || 1) : 1;
  const limit = 6;

  const [headerNavigation, footerNavigation, listing, filters] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getPostListing({
      tenantId: tenant.id,
      locale,
      page,
      limit,
      category,
      tag,
      q
    }),
    getPostFilters({tenantId: tenant.id, locale})
  ]);

  const posts = listing.items;
  const newsListJsonLd = buildNewsListJsonLd({
    posts,
    tenant,
    locale,
    tenantPath,
    settings
  });

  const basePath = `/${locale}${tenantPath}/news`;
  const hasActiveFilters = Boolean(category || tag || q);
  const sanitizedQuery = buildQueryString({
    page: listing.page,
    category: category ?? null,
    tag: tag ?? null,
    q: q ?? null
  });

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(newsListJsonLd)}}
        />
      )}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <header className="space-y-3 text-center">
            <h1 className="font-display text-4xl text-secondary">
              {locale === 'vi' ? 'Tin tức' : 'News'}
            </h1>
            <p className="text-base text-gray-600">
              {locale === 'vi'
                ? 'Cập nhật thông tin mới nhất về cuộc thi và các hoạt động âm nhạc.'
                : 'Stay updated with the latest announcements and stories.'}
            </p>
          </header>

          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <form
              className="flex flex-wrap items-center gap-3"
              action={basePath}
              method="get"
            >
              {category && <input type="hidden" name="category" value={category} />}
              {tag && <input type="hidden" name="tag" value={tag} />}
              <label className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                <span className="text-sm text-gray-500">
                  {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
                </span>
                <input
                  type="search"
                  name="q"
                  defaultValue={q ?? ''}
                  placeholder={
                    locale === 'vi'
                      ? 'Nhập từ khóa, ví dụ: vòng chung kết'
                      : 'Search by keyword, e.g. finals'
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
              {hasActiveFilters && (
                <Link
                  href={basePath}
                  className="text-sm font-medium text-secondary underline-offset-4 hover:opacity-80"
                >
                  {locale === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                </Link>
              )}
            </form>

            {filters.categories.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {locale === 'vi' ? 'Chủ đề' : 'Categories'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map((item) => {
                    const isActive = item === category;
                    const href = `${basePath}${buildQueryString({
                      category: isActive ? null : item,
                      tag: tag ?? null,
                      q: q ?? null
                    })}`;
                    return (
                      <Link
                        key={item}
                        href={href}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {filters.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {locale === 'vi' ? 'Thẻ' : 'Tags'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((item) => {
                    const isActive = item === tag;
                    const href = `${basePath}${buildQueryString({
                      category: category ?? null,
                      tag: isActive ? null : item,
                      q: q ?? null
                    })}`;
                    return (
                      <Link
                        key={item}
                        href={href}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? 'border-secondary bg-secondary/10 text-secondary'
                            : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        #{item}
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
              {locale === 'vi'
                ? 'Chưa có bài viết nào phù hợp với bộ lọc hiện tại. Thử thay đổi tiêu chí để tìm thêm nội dung.'
                : 'No articles match the selected filters. Try adjusting your criteria to discover more content.'}
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
                category: category ?? null,
                tag: tag ?? null,
                q: q ?? null
              })}`
            }
          />

          <div className="text-center text-xs text-gray-400">
            {locale === 'vi'
              ? 'Đường dẫn chuẩn: '
              : 'Canonical query: '}
            <code className="rounded bg-gray-100 px-2 py-1">{`${basePath}${sanitizedQuery}`}</code>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
