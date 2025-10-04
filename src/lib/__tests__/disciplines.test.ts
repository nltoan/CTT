import {describe, expect, it} from 'vitest';

import {
  getDisciplineListing,
  getDiscipline,
  getRelatedDisciplines,
  getDisciplineFilters,
  getDisciplineTranslationLinks
} from '@lib/disciplines';

describe('disciplines library', () => {
  it('lists disciplines with pagination and filters', async () => {
    const listing = await getDisciplineListing({
      tenantId: 'tenant-main',
      locale: 'vi',
      page: 1,
      limit: 3,
      category: 'Keyboard'
    });

    expect(listing.items.length).toBeGreaterThan(0);
    expect(listing.total).toBeGreaterThan(0);
    listing.items.forEach((discipline) => {
      expect(discipline.category).toBe('Keyboard');
    });
  });

  it('fetches discipline details and translations', async () => {
    const discipline = await getDiscipline({
      tenantId: 'tenant-main',
      locale: 'vi',
      slug: 'piano'
    });

    expect(discipline?.name).toBe('Piano');
    const translations = await getDisciplineTranslationLinks({
      translationKey: discipline?.translationKey ?? '',
      disciplineId: discipline?.id
    });
    expect(translations.some((translation) => translation.locale === 'en')).toBe(true);
  });

  it('returns related disciplines for recommendation', async () => {
    const related = await getRelatedDisciplines({
      tenantId: 'tenant-main',
      locale: 'vi',
      excludeSlug: 'piano',
      limit: 2
    });

    expect(related.length).toBeGreaterThan(0);
    expect(related.every((item) => item.slug !== 'piano')).toBe(true);
  });

  it('exposes category and level facets', async () => {
    const filters = await getDisciplineFilters({tenantId: 'tenant-main', locale: 'vi'});
    expect(filters.categories.length).toBeGreaterThan(0);
    expect(filters.levels.length).toBeGreaterThan(0);
  });
});
