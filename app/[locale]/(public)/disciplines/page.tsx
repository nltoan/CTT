import type {Metadata} from 'next';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Pagination} from '@components/layout/Pagination';
import {getNavigation} from '@lib/pages';
import {getDisciplineFilters, getDisciplineListing} from '@lib/disciplines';
import {createCollectionMetadata, buildDisciplinesListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';
import {buildQueryString} from '@lib/url';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function pickParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
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

  const title = locale === 'vi' ? 'Bộ môn & hạng mục' : 'Disciplines & categories';
  const description =
    locale === 'vi'
      ? 'Danh sách bộ môn, hạng mục và chương trình dự thi dành cho từng tenant.'
      : 'Browse competition categories and disciplines available for this tenant.';

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const metadataParams: Record<string, string> = {};

  const category = pickParam(searchParams?.category);
  const level = pickParam(searchParams?.level);
  const q = pickParam(searchParams?.q);
  const pageParam = pickParam(searchParams?.page);

  if (category) metadataParams.category = category;
  if (level) metadataParams.level = level;
  if (q) metadataParams.q = q;
  if (pageParam && pageParam !== '1') metadataParams.page = pageParam;

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['disciplines'],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function DisciplinesIndex({
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

  const category = pickParam(searchParams?.category) ?? undefined;
  const level = pickParam(searchParams?.level) ?? undefined;
  const q = pickParam(searchParams?.q)?.trim() || undefined;
  const pageParam = pickParam(searchParams?.page);
  const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10) || 1) : 1;
  const limit = 9;

  const [headerNavigation, footerNavigation, settings, listing, filters] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    Promise.resolve(getSettingsForTenant({tenantId: tenant.id, locale})),
    getDisciplineListing({
      tenantId: tenant.id,
      locale,
      page,
      limit,
      category,
      level,
      q
    }),
    getDisciplineFilters({tenantId: tenant.id, locale})
  ]);

  const disciplines = listing.items;
  const basePath = `/${locale}${tenantPath}/disciplines`;

  const jsonLd = buildDisciplinesListJsonLd({
    disciplines,
    tenant,
    locale,
    tenantPath,
    settings
  });

  const hasActiveFilters = Boolean(category || level || q);

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />}

      <section className="bg-white py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          <header className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
              {locale === 'vi' ? 'Bộ môn' : 'Disciplines'}
            </p>
            <h1 className="text-4xl font-semibold text-slate-900">
              {locale === 'vi' ? 'Khám phá hạng mục dự thi' : 'Explore competition categories'}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600">
              {locale === 'vi'
                ? 'Thông tin chi tiết về yêu cầu, thời lượng, ban giám khảo và lịch trình của từng bộ môn.'
                : 'Discover detailed requirements, repertoire guidance, jury members and schedules for each discipline.'}
            </p>
          </header>

          <form className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm" role="search">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="discipline-q" className="text-sm font-medium text-slate-700">
                  {locale === 'vi' ? 'Từ khóa' : 'Keyword'}
                </label>
                <input
                  id="discipline-q"
                  name="q"
                  defaultValue={q ?? ''}
                  placeholder={locale === 'vi' ? 'Ví dụ: piano, vocal' : 'e.g. piano, vocal'}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                  type="search"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="discipline-category" className="text-sm font-medium text-slate-700">
                  {locale === 'vi' ? 'Phân loại' : 'Category'}
                </label>
                <select
                  id="discipline-category"
                  name="category"
                  defaultValue={category ?? ''}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                >
                  <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
                  {filters.categories.map((facet) => (
                    <option key={facet.slug} value={facet.label}>
                      {facet.label} ({facet.count})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="discipline-level" className="text-sm font-medium text-slate-700">
                  {locale === 'vi' ? 'Trình độ' : 'Level'}
                </label>
                <select
                  id="discipline-level"
                  name="level"
                  defaultValue={level ?? ''}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                >
                  <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
                  {filters.levels.map((facet) => (
                    <option key={facet.slug} value={facet.label}>
                      {facet.label} ({facet.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-slate-500">
                {hasActiveFilters
                  ? locale === 'vi'
                    ? 'Hiển thị kết quả theo bộ lọc đã chọn.'
                    : 'Showing disciplines that match your filters.'
                  : locale === 'vi'
                    ? 'Chọn bộ lọc để thu hẹp danh sách bộ môn.'
                    : 'Use filters to narrow down disciplines.'}
              </div>
              <div className="flex flex-wrap gap-3">
                {hasActiveFilters && (
                  <Link
                    href={basePath}
                    className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
                  >
                    {locale === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                  </Link>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  {locale === 'vi' ? 'Áp dụng' : 'Apply filters'}
                </button>
              </div>
            </div>
          </form>

          {disciplines.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-600">
              <h2 className="text-xl font-semibold text-slate-800">
                {locale === 'vi' ? 'Chưa có bộ môn phù hợp' : 'No disciplines match your filters'}
              </h2>
              <p className="mt-3 text-sm">
                {locale === 'vi'
                  ? 'Thử điều chỉnh từ khóa, chọn phân loại khác hoặc hiển thị toàn bộ danh sách.'
                  : 'Try adjusting the keyword, select a different category or view the full list.'}
              </p>
              <div className="mt-5 flex justify-center">
                <Link
                  href={basePath}
                  className="inline-flex items-center rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  {locale === 'vi' ? 'Xem tất cả bộ môn' : 'View all disciplines'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {disciplines.map((discipline) => (
                  <li
                    key={discipline.id}
                    className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
                  >
                    {discipline.coverImage?.url && (
                      <img
                        src={discipline.coverImage.url}
                        alt={discipline.coverImage.alt ?? discipline.name}
                        loading="lazy"
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {discipline.category ?? (locale === 'vi' ? 'Bộ môn' : 'Discipline')}
                      </span>
                      <h2 className="text-xl font-semibold text-slate-900">
                        <Link href={`${basePath}/${discipline.slug}`} className="hover:text-primary">
                          {discipline.name}
                        </Link>
                      </h2>
                      {discipline.shortDescription && (
                        <p className="text-sm leading-relaxed text-slate-600">{discipline.shortDescription}</p>
                      )}
                      <dl className="mt-auto grid grid-cols-1 gap-2 text-xs text-slate-500">
                        {discipline.level && (
                          <div>
                            <dt className="font-medium text-slate-600">{locale === 'vi' ? 'Trình độ' : 'Level'}</dt>
                            <dd>{discipline.level}</dd>
                          </div>
                        )}
                        {discipline.ageRange && (
                          <div>
                            <dt className="font-medium text-slate-600">{locale === 'vi' ? 'Độ tuổi' : 'Age range'}</dt>
                            <dd>{discipline.ageRange}</dd>
                          </div>
                        )}
                        {discipline.tags && discipline.tags.length > 0 && (
                          <div>
                            <dt className="font-medium text-slate-600">{locale === 'vi' ? 'Từ khóa' : 'Keywords'}</dt>
                            <dd>{discipline.tags.slice(0, 3).join(', ')}</dd>
                          </div>
                        )}
                      </dl>
                      <div>
                        <Link
                          href={`${basePath}/${discipline.slug}`}
                          className="inline-flex items-center text-sm font-semibold text-primary hover:opacity-80"
                        >
                          {locale === 'vi' ? 'Chi tiết bộ môn' : 'View details'} →
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={listing.page}
                totalPages={listing.totalPages}
                locale={locale}
                makeHref={(nextPage) =>
                  `${basePath}${buildQueryString({
                    category: category ?? null,
                    level: level ?? null,
                    q: q ?? null,
                    page: nextPage
                  })}`
                }
              />
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
