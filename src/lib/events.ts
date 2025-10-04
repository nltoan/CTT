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
  q,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  from?: Date;
  to?: Date;
  limit?: number;
  status?: 'upcoming' | 'past' | 'all';
  category?: string;
  q?: string;
  preview?: boolean;
}) {
  return listEventsByTenant({
    tenantId,
    locale,
    from,
    to,
    limit,
    status,
    category,
    q,
    includeDrafts: preview
  });
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
  to,
  preview
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
  preview?: boolean;
}) {
  return searchEventsByTenant({
    tenantId,
    locale,
    page,
    limit,
    status,
    category,
    q,
    from,
    to,
    includeDrafts: preview
  });
}

export async function getEvent({
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
  return findEventBySlug({tenantId, locale, slug, includeDrafts: preview});
}

export async function getEventFilters({
  tenantId,
  locale,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  preview?: boolean;
}) {
  const categories = listEventCategories({tenantId, locale, includeDrafts: preview});
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
