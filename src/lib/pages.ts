import {findPageBySlug} from '@data/pages';
import {findNavigation} from '@data/navigations';
import {
  findPostBySlug,
  findPostCategoryBySlug,
  findPostTagBySlug,
  findRelatedPosts,
  listPostCategories,
  listPostsByTenant,
  listPostTags,
  searchPostsByTenant
} from '@data/posts';
import type {Page} from '@types/cms';

export async function getPageForTenant({
  tenantId,
  slug,
  locale,
  preview
}: {
  tenantId: string;
  slug: string;
  locale: 'vi' | 'en';
  preview?: boolean;
}) {
  return findPageBySlug({tenantId, slug, locale, includeDrafts: preview});
}

export async function getNavigation({
  tenantId,
  key,
  locale
}: {
  tenantId: string;
  key: 'header' | 'footer';
  locale: 'vi' | 'en';
}) {
  return findNavigation({tenantId, key, locale});
}

export async function getRecentPosts({
  tenantId,
  locale,
  limit,
  category,
  tag,
  q,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  preview?: boolean;
}) {
  return listPostsByTenant({
    tenantId,
    locale,
    limit,
    category,
    tag,
    q,
    includeDrafts: preview
  });
}

export async function getPostListing({
  tenantId,
  locale,
  page,
  limit,
  category,
  tag,
  q,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  preview?: boolean;
}) {
  return searchPostsByTenant({
    tenantId,
    locale,
    page,
    limit,
    category,
    tag,
    q,
    includeDrafts: preview
  });
}

export async function getPost({
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
  return findPostBySlug({tenantId, locale, slug, includeDrafts: preview});
}

export async function getRelatedPosts({
  tenantId,
  locale,
  postId,
  category,
  tags,
  limit,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  postId: string;
  category?: string;
  tags?: string[];
  limit?: number;
  preview?: boolean;
}) {
  return findRelatedPosts({
    tenantId,
    locale,
    postId,
    category,
    tags,
    limit,
    includeDrafts: preview
  });
}

export type PageWithNavigation = Page & {
  headerNavigation?: Awaited<ReturnType<typeof getNavigation>>;
  footerNavigation?: Awaited<ReturnType<typeof getNavigation>>;
};

export async function getPostFilters({
  tenantId,
  locale,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  preview?: boolean;
}) {
  const [categories, tags] = await Promise.all([
    listPostCategories({tenantId, locale, includeDrafts: preview}),
    listPostTags({tenantId, locale, includeDrafts: preview})
  ]);

  return {categories, tags};
}

export async function getPostCategoryBySlug({
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
  return findPostCategoryBySlug({tenantId, locale, slug, includeDrafts: preview});
}

export async function getPostTagBySlug({
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
  return findPostTagBySlug({tenantId, locale, slug, includeDrafts: preview});
}
