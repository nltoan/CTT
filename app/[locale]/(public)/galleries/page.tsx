import type {Metadata} from 'next';

import {GalleryCollectionPage} from '@components/pages/GalleryCollectionPage';
import {getNavigation} from '@lib/pages';
import {
  getGalleryCategoryBySlug,
  getGalleryFilters,
  getGalleryListing,
  getGalleryTagBySlug
} from '@lib/galleries';
import {createCollectionMetadata, buildGalleryListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

import type {SearchParams} from './utils';
import {normalizeGallerySearchParams} from './utils';

export const dynamic = 'force-dynamic';

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

  const normalized = normalizeGallerySearchParams(searchParams);
  const metadataParams: Record<string, string> = {};
  if (normalized.categorySlug) metadataParams.category = normalized.categorySlug;
  if (normalized.tagSlug) metadataParams.tag = normalized.tagSlug;
  if (normalized.q) metadataParams.q = normalized.q;
  if (normalized.sort === 'oldest') metadataParams.sort = 'oldest';
  if (normalized.page > 1) metadataParams.page = String(normalized.page);

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['galleries'],
    title: locale === 'vi' ? 'Thư viện' : 'Galleries',
    description:
      locale === 'vi'
        ? 'Khám phá các bộ sưu tập hình ảnh và video nổi bật từ sự kiện CTT.'
        : 'Browse curated photo and video galleries from CTT performances and activities.',
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

  const normalized = normalizeGallerySearchParams(searchParams);
  const baseSegments = [locale, tenantPath.replace(/^\//, ''), 'galleries'].filter(Boolean);
  const basePath = `/${baseSegments.join('/')}`.replace(/\/+/, '/');

  const [listing, filters, headerNavigation, footerNavigation, settings, categoryFacet, tagFacet] = await Promise.all([
    getGalleryListing({
      tenantId: tenant.id,
      locale,
      category: normalized.categorySlug,
      tag: normalized.tagSlug,
      q: normalized.q,
      sort: normalized.sort,
      page: normalized.page,
      limit: 9
    }),
    getGalleryFilters({tenantId: tenant.id, locale}),
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getSettingsForTenant({tenantId: tenant.id, locale}),
    normalized.categorySlug
      ? getGalleryCategoryBySlug({tenantId: tenant.id, locale, slug: normalized.categorySlug})
      : Promise.resolve(null),
    normalized.tagSlug
      ? getGalleryTagBySlug({tenantId: tenant.id, locale, slug: normalized.tagSlug})
      : Promise.resolve(null)
  ]);

  const jsonLd = buildGalleryListJsonLd({
    galleries: listing.items,
    tenant,
    locale,
    tenantPath,
    settings
  });

  return (
    <GalleryCollectionPage
      tenant={tenant}
      locale={locale}
      tenantPath={tenantPath}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      galleries={listing.items}
      listing={{
        page: listing.meta.page,
        totalPages: listing.meta.totalPages,
        totalItems: listing.meta.totalItems,
        limit: listing.meta.limit
      }}
      filters={filters}
      activeFilters={{
        categorySlug: normalized.categorySlug,
        categoryFacet,
        tagSlug: normalized.tagSlug,
        tagFacet,
        q: normalized.q,
        sort: normalized.sort
      }}
      basePath={basePath}
      heading={locale === 'vi' ? 'Thư viện hình ảnh & video' : 'Photo & video galleries'}
      description={
        locale === 'vi'
          ? 'Tổng hợp các khoảnh khắc đáng nhớ từ cuộc thi và chương trình giao lưu âm nhạc CTT.'
          : 'Relive standout CTT performances, rehearsals, and behind-the-scenes moments.'
      }
      searchPlaceholder={locale === 'vi' ? 'Từ khóa, nội dung...' : 'Keyword, content...'}
      clearFiltersHref={basePath}
      galleryListJsonLd={jsonLd}
    />
  );
}
