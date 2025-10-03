import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

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
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootGalleryCategoryStaticParams} from '@lib/static-paths';

import type {SearchParams} from '../../utils';
import {normalizeGallerySearchParams} from '../../utils';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getRootGalleryCategoryStaticParams();
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; category: string};
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const normalized = normalizeGallerySearchParams(searchParams);

  const categoryFacet = await getGalleryCategoryBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.category
  });

  const metadataParams: Record<string, string> = {};
  if (normalized.tagSlug) metadataParams.tag = normalized.tagSlug;
  if (normalized.q) metadataParams.q = normalized.q;
  if (normalized.sort === 'oldest') metadataParams.sort = 'oldest';
  if (normalized.page > 1) metadataParams.page = String(normalized.page);

  if (!categoryFacet) {
    return createCollectionMetadata({
      tenant,
      locale,
      tenantPath,
      slugSegments: ['galleries', 'category', params.category],
      title: locale === 'vi' ? 'Thư viện' : 'Galleries',
      description:
        locale === 'vi'
          ? 'Khám phá các bộ sưu tập hình ảnh và video nổi bật từ sự kiện CTT.'
          : 'Browse curated photo and video galleries from CTT performances and activities.',
      settings,
      searchParams: metadataParams
    });
  }

  const title =
    locale === 'vi'
      ? `Thư viện chủ đề ${categoryFacet.label}`
      : `Galleries in ${categoryFacet.label}`;
  const description =
    categoryFacet.description ??
    (locale === 'vi'
      ? `Khám phá các bộ sưu tập thuộc chủ đề "${categoryFacet.label}".`
      : `Discover galleries filed under "${categoryFacet.label}".`);

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['galleries', 'category', params.category],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function GalleryCategoryPage({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; category: string};
  searchParams?: SearchParams;
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const normalized = normalizeGallerySearchParams(searchParams);

  const categoryFacet = await getGalleryCategoryBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.category
  });

  if (!categoryFacet) {
    notFound();
  }

  const baseSegments = [locale, tenantPath.replace(/^\//, ''), 'galleries', 'category', params.category].filter(Boolean);
  const basePath = `/${baseSegments.join('/')}`.replace(/\/+/, '/');

  const [listing, filters, headerNavigation, footerNavigation, settings, tagFacet] = await Promise.all([
    getGalleryListing({
      tenantId: tenant.id,
      locale,
      category: params.category,
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
        categorySlug: params.category,
        categoryFacet,
        tagSlug: normalized.tagSlug,
        tagFacet,
        q: normalized.q,
        sort: normalized.sort
      }}
      basePath={basePath}
      heading={
        locale === 'vi'
          ? `Thư viện chủ đề ${categoryFacet.label}`
          : `Galleries in ${categoryFacet.label}`
      }
      description={
        categoryFacet.description ??
        (locale === 'vi'
          ? `Khám phá các bộ sưu tập thuộc chủ đề "${categoryFacet.label}".`
          : `Discover galleries filed under "${categoryFacet.label}".`)
      }
      clearFiltersHref={basePath}
      galleryListJsonLd={jsonLd}
      lockCategorySelect
    />
  );
}
