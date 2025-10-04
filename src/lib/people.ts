import {findPersonBySlug, listPeopleByTenant} from '@data/people';
import {listSponsorsByTenant} from '@data/sponsors';
import type {Person, Sponsor} from '@types/cms';

export async function getPeople({
  tenantId,
  locale,
  limit,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  preview?: boolean;
}): Promise<Person[]> {
  return listPeopleByTenant({tenantId, locale, limit, includeDrafts: preview});
}

export async function getPersonBySlug({
  tenantId,
  slug,
  locale,
  preview
}: {
  tenantId: string;
  slug: string;
  locale: 'vi' | 'en';
  preview?: boolean;
}): Promise<Person | undefined> {
  return findPersonBySlug({tenantId, slug, locale, includeDrafts: preview});
}

export async function getRelatedPeople({
  tenantId,
  locale,
  excludePersonId,
  limit = 3,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  excludePersonId: string;
  limit?: number;
  preview?: boolean;
}): Promise<Person[]> {
  const people = await getPeople({tenantId, locale, preview});
  return people.filter((person) => person.id !== excludePersonId).slice(0, limit);
}

export async function getPeopleBySlugs({
  tenantId,
  locale,
  slugs,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slugs?: string[];
  preview?: boolean;
}): Promise<Person[]> {
  if (!slugs || slugs.length === 0) {
    return [];
  }
  const normalized = slugs.map((slug) => slug.toLowerCase());
  const people = await getPeople({tenantId, locale, preview});
  return people.filter((person) => normalized.includes(person.slug.toLowerCase()));
}

export async function getSponsors({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}): Promise<Sponsor[]> {
  return listSponsorsByTenant({tenantId, locale});
}
