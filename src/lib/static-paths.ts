import {listPagesByTenant} from '@data/pages';
import {listPostsByTenant, listPostCategories, listPostTags} from '@data/posts';
import {listEventsByTenant} from '@data/events';
import {listGalleriesByTenant, listGalleryCategories, listGalleryTags} from '@data/galleries';
import {listPeopleByTenant} from '@data/people';
import {listDisciplinesByTenant} from '@data/disciplines';
import {tenants} from '@data/tenants';
import type {Tenant} from '@types/cms';
import {getDefaultTenant} from '@lib/tenant';

type Locale = 'vi' | 'en';

type CatchAllParam = string[];

const RESERVED_PAGE_SLUGS = new Set(['people', 'partners', 'news', 'events', 'galleries']);

function toSegments(slug: string): CatchAllParam {
  if (!slug) {
    return [];
  }
  return slug.split('/').filter(Boolean);
}

function tenantLocales(tenant: Tenant): Locale[] {
  return tenant.locales as Locale[];
}

function nonReservedPages(tenant: Tenant, locale: Locale) {
  return listPagesByTenant({tenantId: tenant.id, locale}).filter(
    (page) => !RESERVED_PAGE_SLUGS.has(page.slug.split('/')[0] ?? '')
  );
}

export function getRootPageStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    nonReservedPages(tenant, locale).map((page) => ({
      locale,
      slug: toSegments(page.slug)
    }))
  );
}

export function getTenantPageStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      nonReservedPages(tenant, locale).map((page) => ({
        locale,
        tenant: tenant.slug,
        slug: toSegments(page.slug)
      }))
    )
  );
}

export function getRootPostStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listPostsByTenant({tenantId: tenant.id, locale}).map((post) => ({
      locale,
      slug: post.slug
    }))
  );
}

export function getTenantPostStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listPostsByTenant({tenantId: tenant.id, locale}).map((post) => ({
        locale,
        tenant: tenant.slug,
        slug: post.slug
      }))
    )
  );
}

export function getRootPostCategoryStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listPostCategories({tenantId: tenant.id, locale}).map((category) => ({
      locale,
      category: category.slug
    }))
  );
}

export function getTenantPostCategoryStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listPostCategories({tenantId: tenant.id, locale}).map((category) => ({
        tenant: tenant.slug,
        locale,
        category: category.slug
      }))
    )
  );
}

export function getRootPostTagStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listPostTags({tenantId: tenant.id, locale}).map((tag) => ({
      locale,
      tag: tag.slug
    }))
  );
}

export function getTenantPostTagStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listPostTags({tenantId: tenant.id, locale}).map((tag) => ({
        tenant: tenant.slug,
        locale,
        tag: tag.slug
      }))
    )
  );
}

export function getRootEventStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listEventsByTenant({tenantId: tenant.id, locale}).map((event) => ({
      locale,
      slug: event.slug
    }))
  );
}

export function getTenantEventStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listEventsByTenant({tenantId: tenant.id, locale}).map((event) => ({
        locale,
        tenant: tenant.slug,
        slug: event.slug
      }))
    )
  );
}

export function getRootDisciplineStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listDisciplinesByTenant({tenantId: tenant.id, locale}).map((discipline) => ({
      locale,
      slug: discipline.slug
    }))
  );
}

export function getTenantDisciplineStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listDisciplinesByTenant({tenantId: tenant.id, locale}).map((discipline) => ({
        tenant: tenant.slug,
        locale,
        slug: discipline.slug
      }))
    )
  );
}

export function getRootGalleryStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listGalleriesByTenant({tenantId: tenant.id, locale}).map((gallery) => ({
      locale,
      slug: gallery.slug
    }))
  );
}

export function getTenantGalleryStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listGalleriesByTenant({tenantId: tenant.id, locale}).map((gallery) => ({
        locale,
        tenant: tenant.slug,
        slug: gallery.slug
      }))
    )
  );
}

export function getRootGalleryCategoryStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listGalleryCategories({tenantId: tenant.id, locale}).map((category) => ({
      locale,
      category: category.slug
    }))
  );
}

export function getTenantGalleryCategoryStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listGalleryCategories({tenantId: tenant.id, locale}).map((category) => ({
        tenant: tenant.slug,
        locale,
        category: category.slug
      }))
    )
  );
}

export function getRootGalleryTagStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listGalleryTags({tenantId: tenant.id, locale}).map((tag) => ({
      locale,
      tag: tag.slug
    }))
  );
}

export function getTenantGalleryTagStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listGalleryTags({tenantId: tenant.id, locale}).map((tag) => ({
        tenant: tenant.slug,
        locale,
        tag: tag.slug
      }))
    )
  );
}

export function getRootPeopleStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).map((locale) => ({locale}));
}

export function getTenantPeopleStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).map((locale) => ({
      tenant: tenant.slug,
      locale
    }))
  );
}

export function getRootPartnersStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).map((locale) => ({locale}));
}

export function getTenantPartnersStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).map((locale) => ({
      tenant: tenant.slug,
      locale
    }))
  );
}

export function getRootPersonStaticParams() {
  const tenant = getDefaultTenant();
  return tenantLocales(tenant).flatMap((locale) =>
    listPeopleByTenant({tenantId: tenant.id, locale}).map((person) => ({
      locale,
      slug: person.slug
    }))
  );
}

export function getTenantPersonStaticParams() {
  return tenants.flatMap((tenant) =>
    tenantLocales(tenant).flatMap((locale) =>
      listPeopleByTenant({tenantId: tenant.id, locale}).map((person) => ({
        tenant: tenant.slug,
        locale,
        slug: person.slug
      }))
    )
  );
}
