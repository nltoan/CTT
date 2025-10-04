import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {NewsCollectionPage} from '@components/pages/NewsCollectionPage';
import {getNavigation, getPostFilters, getPostListing, getPostTagBySlug} from '@lib/pages';
import {createCollectionMetadata, buildNewsListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootPostTagStaticParams} from '@lib/static-paths';
import {readDraftModeState} from '@lib/preview';

import {pickParam, type SearchParams} from '../../utils';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export async function generateMetadata({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; tag: string; tenant?: string};
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const preview = readDraftModeState();
  const tagFacet = await getPostTagBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.tag,
    preview
  });

  if (!tagFacet) {
    return createCollectionMetadata({
      tenant,
      locale,
      tenantPath,
      slugSegments: ['news', 'tag', params.tag],
      title: locale === 'vi' ? 'Tin tức' : 'News',
      description:
        locale === 'vi'
          ? 'Cập nhật thông tin mới nhất về cuộc thi và các hoạt động âm nhạc.'
          : 'Stay updated with the latest announcements and stories.',
      settings
    });
  }

  const category = pickParam(searchParams?.['category']);
  const q = pickParam(searchParams?.['q']);
  const pageParam = pickParam(searchParams?.['page']);

  const metadataParams: Record<string, string> = {};
  if (category) metadataParams.category = category;
  if (q) metadataParams.q = q;
  if (pageParam && pageParam !== '1') {
    metadataParams.page = pageParam;
  }

  const title =
    locale === 'vi'
      ? `Tin tức gắn thẻ #${tagFacet.label}`
      : `News tagged #${tagFacet.label}`;
  const description =
    locale === 'vi'
      ? `Các bài viết có thẻ #${tagFacet.label} dành cho ${tenant.name}.`
      : `Stories tagged #${tagFacet.label} for ${tenant.name}.`;

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['news', 'tag', params.tag],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function NewsTagPage({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; tag: string; tenant?: string};
  searchParams?: SearchParams;
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const preview = readDraftModeState();
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const tagFacet = await getPostTagBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.tag,
    preview
  });

  if (!tagFacet) {
    notFound();
  }

  const category = pickParam(searchParams?.['category'])?.trim() || undefined;
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
      tag: tagFacet.label,
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

  const basePath = `/${locale}${tenantPath}/news/tag/${params.tag}`;

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
      activeFilters={{category, tag: tagFacet.label, q}}
      persistedFilters={{tag: tagFacet.label}}
      basePath={basePath}
      heading={
        locale === 'vi'
          ? `Tin tức gắn thẻ #${tagFacet.label}`
          : `News tagged #${tagFacet.label}`
      }
      description={
        locale === 'vi'
          ? `Tổng hợp bài viết có thẻ #${tagFacet.label} dành cho ${tenant.name}.`
          : `Curated stories tagged #${tagFacet.label} for ${tenant.name}.`
      }
      newsListJsonLd={newsListJsonLd}
      clearFiltersHref={`/${locale}${tenantPath}/news`}
      clearFiltersLabel={locale === 'vi' ? 'Xem tất cả tin tức' : 'View all news'}
      showTagFilter={false}
      emptyStateMessage={
        locale === 'vi'
          ? `Chưa có bài viết nào gắn thẻ #${tagFacet.label}.`
          : `No articles have been tagged #${tagFacet.label} yet.`
      }
    />
  );
}

export function generateStaticParams() {
  return getRootPostTagStaticParams();
}
