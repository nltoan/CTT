import {describe, expect, it} from 'vitest';

import {getPersonBySlug, getRelatedPeople} from '@lib/people';
import {createPersonMetadata, buildPersonJsonLd} from '@lib/seo';
import {getDefaultTenant} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

const tenant = getDefaultTenant();

describe('people helpers', () => {
  it('excludes the requested person from related suggestions', async () => {
    const locale: 'vi' | 'en' = 'vi';
    const person = await getPersonBySlug({tenantId: tenant.id, locale, slug: 'nguyen-thu-ha'});
    expect(person).toBeTruthy();
    const related = await getRelatedPeople({tenantId: tenant.id, locale, excludePersonId: person!.id, limit: 5});
    expect(related.some((item) => item.id === person!.id)).toBe(false);
  });

  it('creates metadata with hreflang alternates and JSON-LD for person profile', async () => {
    const locale: 'vi' | 'en' = 'vi';
    const person = await getPersonBySlug({tenantId: tenant.id, locale, slug: 'nguyen-thu-ha'});
    expect(person).toBeTruthy();
    const settings = getSettingsForTenant({tenantId: tenant.id, locale});
    const metadata = createPersonMetadata({person: person!, tenant, locale, tenantPath: '', settings});
    expect(metadata.title).toContain(person!.name);
    const altEn = metadata.alternates?.languages?.en;
    expect(altEn).toBeTruthy();
    const altValues = Array.isArray(altEn) ? altEn : [altEn];
    expect(altValues[0]).toContain('/en/people/nguyen-thu-ha');

    const jsonLd = buildPersonJsonLd({person: person!, tenant, locale, tenantPath: '', settings});
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe(person!.name);
    expect(jsonLd.award).toBeTruthy();
  });
});
