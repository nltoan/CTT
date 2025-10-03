import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {NewsCollectionPage} from '@components/pages/NewsCollectionPage';
import {
  getNavigation,
  getPostCategoryBySlug,
  getPostFilters,
  getPostListing
} from '@lib/pages';
import {createCollectionMetadata, buildNewsListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootPostCategoryStaticParams} from '@lib/static-paths';
import {readDraftModeState} from '@lib/preview';

import {pickParam, type SearchParams} from '../../utils';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export async function generateMetadata({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; category: string; tenant?: string};
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const preview = readDraftModeState();
  const categoryFacet = await getPostCategoryBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.category,
    preview
  });

  if (!categoryFacet) {
    return createCollectionMetadata({
      tenant,
      locale,
      tenantPath,
      slugSegments: ['news', 'category', params.category],
      title: locale === 'vi' ? 'Tin tức' : 'News',
      description:
        locale === 'vi'
          ? 'Cập nhật thông tin mới nhất về cuộc thi và các hoạt động âm nhạc.'
          : 'Stay updated with the latest announcements and stories.',
      settings
    });
  }

  const tag = pickParam(searchParams?.['tag']);
  const q = pickParam(searchParams?.['q']);
  const pageParam = pickParam(searchParams?.['page']);

  const metadataParams: Record<string, string> = {};
  if (tag) metadataParams.tag = tag;
  if (q) metadataParams.q = q;
  if (pageParam && pageParam !== '1') {
    metadataParams.page = pageParam;
  }

  const title =
    locale === 'vi'
      ? `Tin tức chủ đề ${categoryFacet.label}`
      : `News in category ${categoryFacet.label}`;
  const description =
    locale === 'vi'
      ? `Các bài viết thuộc chủ đề "${categoryFacet.label}" dành cho tenant ${tenant.name}.`
      : `Stories in the "${categoryFacet.label}" category for ${tenant.name}.`;

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['news', 'category', params.category],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function NewsCategoryPage({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; category: string; tenant?: string};
  searchParams?: SearchParams;
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const preview = readDraftModeState();
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const categoryFacet = await getPostCategoryBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.category,
    preview
  });

  if (!categoryFacet) {
    notFound();
  }

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
      category: categoryFacet.label,
      tag,
      q,
      preview
    }),
    getPostFilters({tenantId: tenant.id, locale, preview})
  ]);

  const posts = listing.items;
  const newsListJsonLd = buildNewsListJsonLd({
    posts,
    tenant,
    locale,
    tenantPath,
    settings
  });

  const basePath = `/${locale}${tenantPath}/news/category/${params.category}`;

  return (
    <NewsCollectionPage
      tenant={tenant}
      locale={locale}
      tenantPath={tenantPath}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      posts={posts}
      listing={listing}
      filters={filters}
      activeFilters={{category: categoryFacet.label, tag, q}}
      persistedFilters={{category: categoryFacet.label}}
      basePath={basePath}
      heading={
        locale === 'vi'
          ? `Tin tức chủ đề ${categoryFacet.label}`
          : `News in ${categoryFacet.label}`
      }
      description={
        locale === 'vi'
          ? `Tổng hợp bài viết thuộc chủ đề "${categoryFacet.label}" dành cho ${tenant.name}.`
          : `Curated stories in the "${categoryFacet.label}" category for ${tenant.name}.`
      }
      newsListJsonLd={newsListJsonLd}
      clearFiltersHref={`/${locale}${tenantPath}/news`}
      clearFiltersLabel={locale === 'vi' ? 'Xem tất cả tin tức' : 'View all news'}
      showCategoryFilter={false}
      emptyStateMessage={
        locale === 'vi'
          ? `Chưa có bài viết nào trong chủ đề "${categoryFacet.label}".`
          : `No articles have been published in the "${categoryFacet.label}" category yet.`
      }
    />
  );
}

export function generateStaticParams() {
  return getRootPostCategoryStaticParams();
}
