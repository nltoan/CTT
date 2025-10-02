import {findPageBySlug} from '@data/pages';
import {findNavigation} from '@data/navigations';
import {
  findPostBySlug,
  findRelatedPosts,
  listPostCategories,
  listPostsByTenant,
  listPostTags,
  searchPostsByTenant
} from '@data/posts';
import {listEventsByTenant} from '@data/events';
import type {Page} from '@types/cms';

export async function getPageForTenant({
  tenantId,
  slug,
  locale
}: {
  tenantId: string;
  slug: string;
  locale: 'vi' | 'en';
}) {
  return findPageBySlug({tenantId, slug, locale});
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
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
}) {
  return listPostsByTenant({tenantId, locale, limit, category, tag, q});
}

export async function getPostListing({
  tenantId,
  locale,
  page,
  limit,
  category,
  tag,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
}) {
  return searchPostsByTenant({tenantId, locale, page, limit, category, tag, q});
}

export async function getPost({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return findPostBySlug({tenantId, locale, slug});
}

export async function getRelatedPosts({
  tenantId,
  locale,
  postId,
  category,
  tags,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  postId: string;
  category?: string;
  tags?: string[];
  limit?: number;
}) {
  return findRelatedPosts({tenantId, locale, postId, category, tags, limit});
}

export async function getEvents({
  tenantId,
  locale,
  from,
  to,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  from?: Date;
  to?: Date;
  limit?: number;
}) {
  const events = listEventsByTenant({tenantId, locale, from, to}).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  if (typeof limit === 'number') {
    return events.slice(0, limit);
  }

  return events;
}

export type PageWithNavigation = Page & {
  headerNavigation?: Awaited<ReturnType<typeof getNavigation>>;
  footerNavigation?: Awaited<ReturnType<typeof getNavigation>>;
};

export async function getPostFilters({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  const [categories, tags] = await Promise.all([
    listPostCategories({tenantId, locale}),
    listPostTags({tenantId, locale})
  ]);

  return {categories, tags};
}
