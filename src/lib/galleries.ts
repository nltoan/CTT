import {
  findGalleryBySlug,
  findGalleryCategoryBySlug,
  findGalleryTagBySlug,
  findGalleryTranslations,
  listGalleriesByTenant,
  listGalleryCategories,
  listGalleryTags,
  searchGalleriesByTenant
} from '@data/galleries';
import type {Gallery} from '@types/cms';
import type {GalleryCategoryFacet, GalleryTagFacet} from '@data/galleries';

export async function getGalleryPreview({
  tenantId,
  locale,
  slug,
  limit,
  sort
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  limit?: number;
  sort?: 'latest' | 'oldest';
}) {
  const gallery = findGalleryBySlug({tenantId, locale, slug});
  if (!gallery) {
    return null;
  }

  const sourceItems = Array.isArray(gallery.items) ? gallery.items : [];
  const normalizedItems = sort === 'oldest' ? [...sourceItems].reverse() : [...sourceItems];
  const sliced = typeof limit === 'number' ? normalizedItems.slice(0, limit) : normalizedItems;

  return {
    ...gallery,
    items: sliced,
    totalItems: sourceItems.length,
    hasMore: typeof limit === 'number' ? sourceItems.length > sliced.length : false
  } satisfies Gallery & {totalItems: number; hasMore: boolean};
}

export async function getGallery({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return findGalleryBySlug({tenantId, locale, slug});
}

export async function getGalleryListing({
  tenantId,
  locale,
  page,
  limit,
  category,
  tag,
  q,
  sort
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  sort?: 'latest' | 'oldest';
}) {
  return searchGalleriesByTenant({tenantId, locale, page, limit, category, tag, q, sort});
}

export async function getGallerySummaries({
  tenantId,
  locale,
  limit,
  category,
  tag,
  q,
  sort
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  sort?: 'latest' | 'oldest';
}) {
  return listGalleriesByTenant({tenantId, locale, limit, category, tag, q, sort});
}

export async function getGalleryFilters({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  const [categories, tags] = await Promise.all([
    listGalleryCategories({tenantId, locale}),
    listGalleryTags({tenantId, locale})
  ]);

  return {categories, tags};
}

export async function getGalleryCategoryBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}): Promise<GalleryCategoryFacet | null> {
  return findGalleryCategoryBySlug({tenantId, locale, slug});
}

export async function getGalleryTagBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}): Promise<GalleryTagFacet | null> {
  return findGalleryTagBySlug({tenantId, locale, slug});
}

export async function getGalleryTranslations({
  translationKey,
  galleryId
}: {
  translationKey: string;
  galleryId?: string;
}) {
  return findGalleryTranslations({translationKey, galleryId});
}

export type GalleryPreview = Awaited<ReturnType<typeof getGalleryPreview>>;
export type GalleryListing = Awaited<ReturnType<typeof getGalleryListing>>;
export type GalleryFilters = Awaited<ReturnType<typeof getGalleryFilters>>;
export type {GalleryCategoryFacet, GalleryTagFacet};
