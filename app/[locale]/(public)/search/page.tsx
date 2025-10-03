import type {Metadata} from 'next';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {getNavigation} from '@lib/pages';
import {searchAllContent, type SearchBucket} from '@lib/search';
import {createCollectionMetadata, buildSearchResultsJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';
import type {Post, Event, Gallery, Person, Discipline} from '@types/cms';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function pickParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function createEmptyBucket<T>(): SearchBucket<T> {
  return {
    items: [],
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 1,
    hasMore: false
  } satisfies SearchBucket<T>;
}

function formatDate(value: string | undefined, locale: 'vi' | 'en') {
  if (!value) {
    return undefined;
  }
  try {
    return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      dateStyle: 'medium'
    }).format(new Date(value));
  } catch (error) {
    return undefined;
  }
}

function viewAllHref({
  type,
  locale,
  tenantPath,
  query
}: {
  type: 'posts' | 'events' | 'people' | 'galleries' | 'disciplines';
  locale: 'vi' | 'en';
  tenantPath: string;
  query: string;
}) {
  const base = `/${locale}${tenantPath}`;
  const encodedQuery = encodeURIComponent(query);
  switch (type) {
    case 'posts':
      return `${base}/news?q=${encodedQuery}`;
    case 'events':
      return `${base}/events?q=${encodedQuery}`;
    case 'disciplines':
      return `${base}/disciplines?q=${encodedQuery}`;
    case 'galleries':
      return `${base}/galleries?q=${encodedQuery}`;
    case 'people':
    default:
      return `${base}/people`;
  }
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

  const baseTitle = locale === 'vi' ? 'Tìm kiếm' : 'Search';
  const description =
    locale === 'vi'
      ? 'Tìm nội dung sự kiện, tin tức, giám khảo và bộ sưu tập trong toàn bộ hệ thống.'
      : 'Search events, news, jury profiles and galleries across the platform.';

  const query = pickParam(searchParams?.['q']);
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const metadataParams: Record<string, string> = {};
  if (query) {
    metadataParams.q = query;
  }

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['search'],
    title: baseTitle,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function SearchPage({
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

  const query = pickParam(searchParams?.['q'])?.trim() ?? '';
  const hasQuery = query.length > 0;

  const [headerNavigation, footerNavigation, settings, results] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    Promise.resolve(getSettingsForTenant({tenantId: tenant.id, locale})),
    hasQuery
      ? searchAllContent({tenantId: tenant.id, locale, query})
      : Promise.resolve(undefined)
  ]);

  const postsBucket = results?.posts ?? createEmptyBucket<Post>();
  const eventsBucket = results?.events ?? createEmptyBucket<Event>();
  const disciplinesBucket = results?.disciplines ?? createEmptyBucket<Discipline>();
  const galleriesBucket = results?.galleries ?? createEmptyBucket<Gallery>();
  const peopleBucket = results?.people ?? createEmptyBucket<Person>();
  const totalResults = results?.totalResults ?? 0;

  const searchJsonLd =
    hasQuery && results
      ? buildSearchResultsJsonLd({
          tenant,
          locale,
          tenantPath,
          query,
          results,
          settings
        })
      : null;

  const sectionTitle = {
    posts: locale === 'vi' ? 'Tin tức & bài viết' : 'News & articles',
    events: locale === 'vi' ? 'Sự kiện' : 'Events',
    disciplines: locale === 'vi' ? 'Bộ môn & hạng mục' : 'Disciplines & categories',
    galleries: locale === 'vi' ? 'Bộ sưu tập' : 'Galleries',
    people: locale === 'vi' ? 'Giám khảo & cố vấn' : 'Jury & mentors'
  } as const;

  const suggestionKeywords =
    locale === 'vi'
      ? ['piano', 'giám khảo', 'vòng chung kết', 'nhà tài trợ']
      : ['piano', 'jury', 'grand finale', 'sponsors'];

  const suggestionLabel = locale === 'vi' ? 'Gợi ý từ khóa:' : 'Try searching for:';

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {searchJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(searchJsonLd)}} />
      )}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <header className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {locale === 'vi' ? 'Tìm kiếm nội dung' : 'Search the platform'}
            </h1>
            <p className="mt-3 text-base text-slate-600">
              {locale === 'vi'
                ? 'Nhập từ khóa để tìm bài viết, sự kiện, giám khảo hoặc thư viện ảnh theo tenant hiện tại.'
                : 'Enter keywords to explore articles, events, jury members or galleries for this tenant.'}
            </p>
          </header>

          <form
            className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
            role="search"
          >
            <label className="text-sm font-medium text-slate-700" htmlFor="search-query">
              {locale === 'vi' ? 'Từ khóa' : 'Keyword'}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="search-query"
                name="q"
                defaultValue={query}
                placeholder={locale === 'vi' ? 'Ví dụ: piano, giám khảo...' : 'e.g. piano, jury...'}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                type="search"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring focus-visible:ring-primary/30"
              >
                {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
              </button>
            </div>
            <p className="text-sm text-slate-500">{suggestionLabel}</p>
            <div className="flex flex-wrap gap-2">
              {suggestionKeywords.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/${locale}${tenantPath}/search?q=${encodeURIComponent(keyword)}`}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 transition hover:border-primary hover:text-primary"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </form>

          {!hasQuery && (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600">
              <p className="text-base">
                {locale === 'vi'
                  ? 'Hãy nhập từ khóa ở trên để bắt đầu tìm kiếm trong toàn bộ nội dung của tenant.'
                  : 'Enter a keyword above to start searching across all content for this tenant.'}
              </p>
              <p className="mt-3 text-sm">
                {locale === 'vi'
                  ? 'Bạn có thể tìm theo tên giám khảo, bộ môn, chủ đề bài viết hoặc từ khóa sự kiện.'
                  : 'You can search by jury name, discipline, article topic, or event keywords.'}
              </p>
            </div>
          )}

          {hasQuery && totalResults === 0 && (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-800">
                {locale === 'vi'
                  ? `Không tìm thấy kết quả phù hợp cho “${query}”.`
                  : `No results found for “${query}”.`}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                {locale === 'vi'
                  ? 'Thử điều chỉnh từ khóa, bỏ dấu tiếng Việt hoặc duyệt các chuyên mục bên dưới.'
                  : 'Try adjusting the keyword, removing accents, or browse the featured sections below.'}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {[
                  {href: `/${locale}${tenantPath}/news`, label: locale === 'vi' ? 'Tin tức' : 'News'},
                  {href: `/${locale}${tenantPath}/events`, label: locale === 'vi' ? 'Sự kiện' : 'Events'},
                  {href: `/${locale}${tenantPath}/disciplines`, label: locale === 'vi' ? 'Bộ môn' : 'Disciplines'},
                  {href: `/${locale}${tenantPath}/people`, label: locale === 'vi' ? 'Giám khảo' : 'Jury'},
                  {href: `/${locale}${tenantPath}/galleries`, label: locale === 'vi' ? 'Thư viện' : 'Galleries'}
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hasQuery && totalResults > 0 && (
            <div className="space-y-12">
              <div className="rounded-2xl bg-white/80 p-6 text-center shadow-sm">
                <p className="text-sm uppercase tracking-wide text-primary">
                  {locale === 'vi' ? 'Kết quả' : 'Results'}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {locale === 'vi'
                    ? `${totalResults} kết quả cho “${query}”`
                    : `${totalResults} results for “${query}”`}
                </p>
              </div>

              {postsBucket.total > 0 && (
                <section className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle.posts}</h2>
                    {postsBucket.hasMore && (
                      <Link
                        href={viewAllHref({type: 'posts', locale, tenantPath, query})}
                        className="text-sm font-medium text-primary transition hover:opacity-80"
                      >
                        {locale === 'vi' ? 'Xem tất cả bài viết' : 'View all articles'}
                      </Link>
                    )}
                  </div>
                  <ul className="grid gap-6 md:grid-cols-2">
                    {postsBucket.items.map((post) => (
                      <li
                        key={post.id}
                        className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-md"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {locale === 'vi' ? 'Tin tức' : 'Article'}
                        </span>
                        <h3 className="text-xl font-semibold text-slate-900">
                          <Link href={`/${locale}${tenantPath}/news/${post.slug}`} className="hover:text-primary">
                            {post.title}
                          </Link>
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                        )}
                        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          {formatDate(post.publishedAt, locale) && (
                            <span>{formatDate(post.publishedAt, locale)}</span>
                          )}
                          {post.category && <span>{post.category}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {eventsBucket.total > 0 && (
                <section className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle.events}</h2>
                    {eventsBucket.hasMore && (
                      <Link
                        href={viewAllHref({type: 'events', locale, tenantPath, query})}
                        className="text-sm font-medium text-primary transition hover:opacity-80"
                      >
                        {locale === 'vi' ? 'Xem tất cả sự kiện' : 'View all events'}
                      </Link>
                    )}
                  </div>
                  <ul className="grid gap-6 md:grid-cols-2">
                    {eventsBucket.items.map((event) => (
                      <li
                        key={event.id}
                        className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-md"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {locale === 'vi' ? 'Sự kiện' : 'Event'}
                        </span>
                        <h3 className="text-xl font-semibold text-slate-900">
                          <Link href={`/${locale}${tenantPath}/events/${event.slug}`} className="hover:text-primary">
                            {event.title}
                          </Link>
                        </h3>
                        {event.summary && (
                          <p className="text-sm leading-relaxed text-slate-600">{event.summary}</p>
                        )}
                        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          {formatDate(event.startsAt, locale) && (
                            <span>{formatDate(event.startsAt, locale)}</span>
                          )}
                          {event.location && <span>{event.location}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {disciplinesBucket.total > 0 && (
                <section className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle.disciplines}</h2>
                    {disciplinesBucket.hasMore && (
                      <Link
                        href={viewAllHref({type: 'disciplines', locale, tenantPath, query})}
                        className="text-sm font-medium text-primary transition hover:opacity-80"
                      >
                        {locale === 'vi' ? 'Xem tất cả bộ môn' : 'View all disciplines'}
                      </Link>
                    )}
                  </div>
                  <ul className="grid gap-6 md:grid-cols-2">
                    {disciplinesBucket.items.map((discipline) => (
                      <li
                        key={discipline.id}
                        className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-md"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {locale === 'vi' ? 'Bộ môn' : 'Discipline'}
                        </span>
                        <h3 className="text-xl font-semibold text-slate-900">
                          <Link
                            href={`/${locale}${tenantPath}/disciplines/${discipline.slug}`}
                            className="hover:text-primary"
                          >
                            {discipline.name}
                          </Link>
                        </h3>
                        {discipline.shortDescription && (
                          <p className="text-sm leading-relaxed text-slate-600">{discipline.shortDescription}</p>
                        )}
                        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          {discipline.category && <span>{discipline.category}</span>}
                          {discipline.level && <span>{discipline.level}</span>}
                          {discipline.ageRange && <span>{discipline.ageRange}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {peopleBucket.total > 0 && (
                <section className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle.people}</h2>
                    {peopleBucket.hasMore && (
                      <Link
                        href={viewAllHref({type: 'people', locale, tenantPath, query})}
                        className="text-sm font-medium text-primary transition hover:opacity-80"
                      >
                        {locale === 'vi' ? 'Xem toàn bộ danh sách' : 'View full roster'}
                      </Link>
                    )}
                  </div>
                  <ul className="grid gap-6 md:grid-cols-2">
                    {peopleBucket.items.map((person) => (
                      <li
                        key={person.id}
                        className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-md"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {locale === 'vi' ? 'Giám khảo' : 'Jury'}
                        </span>
                        <h3 className="text-xl font-semibold text-slate-900">
                          <Link href={`/${locale}${tenantPath}/people/${person.slug}`} className="hover:text-primary">
                            {person.name}
                          </Link>
                        </h3>
                        {person.title && <p className="text-sm text-slate-600">{person.title}</p>}
                        {person.disciplines && person.disciplines.length > 0 && (
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            {person.disciplines.join(' • ')}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {galleriesBucket.total > 0 && (
                <section className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle.galleries}</h2>
                    {galleriesBucket.hasMore && (
                      <Link
                        href={viewAllHref({type: 'galleries', locale, tenantPath, query})}
                        className="text-sm font-medium text-primary transition hover:opacity-80"
                      >
                        {locale === 'vi' ? 'Xem thêm thư viện' : 'View more galleries'}
                      </Link>
                    )}
                  </div>
                  <ul className="grid gap-6 md:grid-cols-2">
                    {galleriesBucket.items.map((gallery) => (
                      <li
                        key={gallery.id}
                        className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-primary/60 hover:shadow-md"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {locale === 'vi' ? 'Thư viện' : 'Gallery'}
                        </span>
                        <h3 className="text-xl font-semibold text-slate-900">
                          <Link href={`/${locale}${tenantPath}/galleries/${gallery.slug}`} className="hover:text-primary">
                            {gallery.title}
                          </Link>
                        </h3>
                        {gallery.description && (
                          <p className="text-sm leading-relaxed text-slate-600">{gallery.description}</p>
                        )}
                        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          {gallery.category && <span>{gallery.category}</span>}
                          {gallery.tags && gallery.tags.length > 0 && (
                            <span>{gallery.tags.slice(0, 3).join(', ')}</span>
                          )}
                          <span>
                            {locale === 'vi'
                              ? `${gallery.items.length} mục media`
                              : `${gallery.items.length} media items`}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
