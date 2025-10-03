import {listPagesByTenant} from '@data/pages';
import {listPostsByTenant} from '@data/posts';
import {listEventsByTenant} from '@data/events';
import {tenants} from '@data/tenants';
import type {Tenant} from '@types/cms';
import {getDefaultTenant} from '@lib/tenant';

type Locale = 'vi' | 'en';

type CatchAllParam = string[];

const RESERVED_PAGE_SLUGS = new Set(['people', 'partners', 'news', 'events']);

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
