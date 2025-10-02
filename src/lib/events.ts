import {findEventBySlug, findEventTranslations, listEventCategories, listEventsByTenant, searchEventsByTenant} from '@data/events';
import type {Event} from '@types/cms';

export async function getEvents({
  tenantId,
  locale,
  from,
  to,
  limit,
  status,
  category,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  from?: Date;
  to?: Date;
  limit?: number;
  status?: 'upcoming' | 'past' | 'all';
  category?: string;
  q?: string;
}) {
  return listEventsByTenant({tenantId, locale, from, to, limit, status, category, q});
}

export async function getEventListing({
  tenantId,
  locale,
  page,
  limit,
  status,
  category,
  q,
  from,
  to
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  status?: 'upcoming' | 'past' | 'all';
  category?: string;
  q?: string;
  from?: Date;
  to?: Date;
}) {
  return searchEventsByTenant({tenantId, locale, page, limit, status, category, q, from, to});
}

export async function getEvent({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return findEventBySlug({tenantId, locale, slug});
}

export async function getEventFilters({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  const categories = listEventCategories({tenantId, locale});
  return {categories};
}

export async function getEventTranslations({
  translationKey,
  eventId
}: {
  translationKey: string;
  eventId?: string;
}) {
  return findEventTranslations({translationKey, eventId});
}

export type EventListing = Awaited<ReturnType<typeof getEventListing>>;
export type EventFilters = Awaited<ReturnType<typeof getEventFilters>>;
export type EventDetail = Event | undefined;
