import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {GalleryCollectionPage} from '@components/pages/GalleryCollectionPage';
import {getNavigation} from '@lib/pages';
import {
  getGalleryFilters,
  getGalleryListing,
  getGalleryTagBySlug,
  getGalleryCategoryBySlug
} from '@lib/galleries';
import {createCollectionMetadata, buildGalleryListJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootGalleryTagStaticParams} from '@lib/static-paths';

import type {SearchParams} from '../../utils';
import {normalizeGallerySearchParams} from '../../utils';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getRootGalleryTagStaticParams();
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; tag: string};
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const normalized = normalizeGallerySearchParams(searchParams);

  const tagFacet = await getGalleryTagBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.tag
  });

  const metadataParams: Record<string, string> = {};
  if (normalized.categorySlug) metadataParams.category = normalized.categorySlug;
  if (normalized.q) metadataParams.q = normalized.q;
  if (normalized.sort === 'oldest') metadataParams.sort = 'oldest';
  if (normalized.page > 1) metadataParams.page = String(normalized.page);

  if (!tagFacet) {
    return createCollectionMetadata({
      tenant,
      locale,
      tenantPath,
      slugSegments: ['galleries', 'tag', params.tag],
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
      ? `Thư viện thẻ #${tagFacet.label}`
      : `Galleries tagged #${tagFacet.label}`;
  const description =
    locale === 'vi'
      ? `Các bộ sưu tập được gắn thẻ #${tagFacet.label}.`
      : `Galleries filed under the #${tagFacet.label} tag.`;

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['galleries', 'tag', params.tag],
    title,
    description,
    settings,
    searchParams: metadataParams
  });
}

export default async function GalleryTagPage({
  params,
  searchParams
}: {
  params: {locale: 'vi' | 'en'; tag: string};
  searchParams?: SearchParams;
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const normalized = normalizeGallerySearchParams(searchParams);

  const tagFacet = await getGalleryTagBySlug({
    tenantId: tenant.id,
    locale,
    slug: params.tag
  });

  if (!tagFacet) {
    notFound();
  }

  const baseSegments = [locale, tenantPath.replace(/^\//, ''), 'galleries', 'tag', params.tag].filter(Boolean);
  const basePath = `/${baseSegments.join('/')}`.replace(/\/+/, '/');

  const [listing, filters, headerNavigation, footerNavigation, settings, categoryFacet] = await Promise.all([
    getGalleryListing({
      tenantId: tenant.id,
      locale,
      category: normalized.categorySlug,
      tag: params.tag,
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
        tagSlug: params.tag,
        tagFacet,
        q: normalized.q,
        sort: normalized.sort
      }}
      basePath={basePath}
      heading={
        locale === 'vi'
          ? `Thư viện thẻ #${tagFacet.label}`
          : `Galleries tagged #${tagFacet.label}`
      }
      description={
        locale === 'vi'
          ? `Các bộ sưu tập được gắn thẻ #${tagFacet.label}.`
          : `Galleries filed under the #${tagFacet.label} tag.`
      }
      clearFiltersHref={basePath}
      galleryListJsonLd={jsonLd}
      lockTagSelect
    />
  );
}
