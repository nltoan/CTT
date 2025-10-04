import {describe, expect, it} from 'vitest';

import {buildLocalizedPath, buildQueryString} from '@lib/url';

describe('buildQueryString', () => {
  it('returns empty string when no params provided', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('serializes supported params', () => {
    expect(
      buildQueryString({page: 2, category: 'news', tag: 'events', q: 'piano'})
    ).toBe('?category=news&tag=events&q=piano&page=2');
  });
});

describe('buildLocalizedPath', () => {
  it('defaults to root for default locale with no slug', () => {
    expect(buildLocalizedPath({locale: 'vi'})).toBe('/');
  });

  it('prefixes locale when not default', () => {
    expect(buildLocalizedPath({locale: 'en'})).toBe('/en');
  });

  it('includes tenant path when provided', () => {
    expect(buildLocalizedPath({locale: 'vi', tenantPath: '/t/classic'})).toBe(
      '/t/classic'
    );
  });

  it('combines locale and tenant path', () => {
    expect(buildLocalizedPath({locale: 'en', tenantPath: '/t/classic'})).toBe(
      '/en/t/classic'
    );
  });

  it('appends slug with preceding slash', () => {
    expect(buildLocalizedPath({locale: 'vi', slug: 'search'})).toBe('/search');
  });

  it('handles slug with leading slash', () => {
    expect(buildLocalizedPath({locale: 'en', slug: '/news'})).toBe('/en/news');
  });

  it('supports locale, tenant path and slug together', () => {
    expect(
      buildLocalizedPath({
        locale: 'en',
        tenantPath: '/t/classic',
        slug: 'search'
      })
    ).toBe('/en/t/classic/search');
  });
});
