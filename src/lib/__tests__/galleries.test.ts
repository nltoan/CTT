import {describe, expect, it} from 'vitest';

import {getGalleryFilters, getGalleryCategoryBySlug, getGalleryTagBySlug} from '@lib/galleries';

const TENANT_ID = 'tenant-main';

describe('galleries helpers', () => {
  it('returns localized category and tag facets', async () => {
    const filtersVi = await getGalleryFilters({tenantId: TENANT_ID, locale: 'vi'});
    const filtersEn = await getGalleryFilters({tenantId: TENANT_ID, locale: 'en'});

    expect(filtersVi.categories.some((facet) => facet.label === 'Biểu diễn')).toBe(true);
    expect(filtersEn.categories.some((facet) => facet.label === 'Performances')).toBe(true);

    const viConcertTag = filtersVi.tags.find((facet) => facet.slug === 'concert');
    expect(viConcertTag?.label).toBe('concert');
    const enConcertTag = filtersEn.tags.find((facet) => facet.slug === 'concert');
    expect(enConcertTag?.label).toBe('concert');
  });

  it('finds category facet by slug', async () => {
    const category = await getGalleryCategoryBySlug({tenantId: TENANT_ID, locale: 'vi', slug: 'performance'});
    expect(category).toBeTruthy();
    expect(category?.label).toBe('Biểu diễn');
  });

  it('finds tag facet by slug', async () => {
    const tag = await getGalleryTagBySlug({tenantId: TENANT_ID, locale: 'en', slug: 'rehearsal'});
    expect(tag).toBeTruthy();
    expect(tag?.label).toBe('rehearsal');
  });
});
