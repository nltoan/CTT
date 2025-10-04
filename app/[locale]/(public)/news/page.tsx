import type {Metadata} from 'next';
import {NewsCollectionPage} from '@components/pages/NewsCollectionPage';
import {getNavigation, getPostFilters, getPostListing} from '@lib/pages';
import {createCollectionMetadata, buildNewsListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';
import {readDraftModeState} from '@lib/preview';

import {pickParam, type SearchParams} from './utils';

export const dynamic = 'force-dynamic';

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
  const preview = readDraftModeState();
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

  const basePath = `/${locale}${tenantPath}/news`;
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
      activeFilters={{category, tag, q}}
      basePath={basePath}
      heading={locale === 'vi' ? 'Tin tức' : 'News'}
      description={
        locale === 'vi'
          ? 'Cập nhật thông tin mới nhất về cuộc thi và các hoạt động âm nhạc.'
          : 'Stay updated with the latest announcements and stories.'
      }
      newsListJsonLd={newsListJsonLd}
      clearFiltersHref={basePath}
    />
  );
}
