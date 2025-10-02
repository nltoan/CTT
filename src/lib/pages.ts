import {findPageBySlug} from '@data/pages';
import {findNavigation} from '@data/navigations';
import {findPostBySlug, listPostsByTenant} from '@data/posts';
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
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
}) {
  return listPostsByTenant({tenantId, locale, limit});
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

export async function getEvents({
  tenantId,
  locale,
  from,
  to
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  from?: Date;
  to?: Date;
}) {
  return listEventsByTenant({tenantId, locale, from, to});
}

export type PageWithNavigation = Page & {
  headerNavigation?: Awaited<ReturnType<typeof getNavigation>>;
  footerNavigation?: Awaited<ReturnType<typeof getNavigation>>;
};
