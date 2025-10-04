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
  sort,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  limit?: number;
  sort?: 'latest' | 'oldest';
  preview?: boolean;
}) {
  const gallery = findGalleryBySlug({tenantId, locale, slug, includeDrafts: preview});
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
  slug,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  preview?: boolean;
}) {
  return findGalleryBySlug({tenantId, locale, slug, includeDrafts: preview});
}

export async function getGalleryListing({
  tenantId,
  locale,
  page,
  limit,
  category,
  tag,
  q,
  sort,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  sort?: 'latest' | 'oldest';
  preview?: boolean;
}) {
  return searchGalleriesByTenant({
    tenantId,
    locale,
    page,
    limit,
    category,
    tag,
    q,
    sort,
    includeDrafts: preview
  });
}

export async function getGallerySummaries({
  tenantId,
  locale,
  limit,
  category,
  tag,
  q,
  sort,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  sort?: 'latest' | 'oldest';
  preview?: boolean;
}) {
  return listGalleriesByTenant({
    tenantId,
    locale,
    limit,
    category,
    tag,
    q,
    sort,
    includeDrafts: preview
  });
}

export async function getGalleryFilters({
  tenantId,
  locale,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  preview?: boolean;
}) {
  const [categories, tags] = await Promise.all([
    listGalleryCategories({tenantId, locale, includeDrafts: preview}),
    listGalleryTags({tenantId, locale, includeDrafts: preview})
  ]);

  return {categories, tags};
}

export async function getGalleryCategoryBySlug({
  tenantId,
  locale,
  slug,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  preview?: boolean;
}): Promise<GalleryCategoryFacet | null> {
  return findGalleryCategoryBySlug({tenantId, locale, slug, includeDrafts: preview});
}

export async function getGalleryTagBySlug({
  tenantId,
  locale,
  slug,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  preview?: boolean;
}): Promise<GalleryTagFacet | null> {
  return findGalleryTagBySlug({tenantId, locale, slug, includeDrafts: preview});
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
