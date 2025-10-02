import {findPersonBySlug, listPeopleByTenant} from '@data/people';
import {listSponsorsByTenant} from '@data/sponsors';
import type {Person, Sponsor} from '@types/cms';

export async function getPeople({
  tenantId,
  locale,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
}): Promise<Person[]> {
  return listPeopleByTenant({tenantId, locale, limit});
}

export async function getPersonBySlug({
  tenantId,
  slug,
  locale
}: {
  tenantId: string;
  slug: string;
  locale: 'vi' | 'en';
}): Promise<Person | undefined> {
  return findPersonBySlug({tenantId, slug, locale});
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
