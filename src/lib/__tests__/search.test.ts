import {describe, expect, it} from 'vitest';

import {searchAllContent} from '@lib/search';

describe('searchAllContent', () => {
  it('returns empty buckets when query is blank', async () => {
    const result = await searchAllContent({tenantId: 'tenant-main', locale: 'vi', query: '   '});

    expect(result.query).toBe('');
    expect(result.totalResults).toBe(0);
    expect(result.posts.total).toBe(0);
    expect(result.events.total).toBe(0);
    expect(result.people.total).toBe(0);
    expect(result.galleries.total).toBe(0);
  });

  it('aggregates multiple content types for a keyword', async () => {
    const result = await searchAllContent({tenantId: 'tenant-main', locale: 'vi', query: 'piano'});

    expect(result.query).toBe('piano');
    expect(result.totalResults).toBeGreaterThan(0);
    expect(result.posts.total + result.events.total + result.people.total + result.galleries.total).toBe(
      result.totalResults
    );
    expect(result.people.items.some((person) => person.disciplines?.some((d) => d.toLowerCase().includes('piano')))).toBe(true);
  });

  it('limits search to requested content types', async () => {
    const result = await searchAllContent({
      tenantId: 'tenant-main',
      locale: 'vi',
      query: 'piano',
      types: ['people']
    });

    expect(result.people.total).toBeGreaterThan(0);
    expect(result.posts.total).toBe(0);
    expect(result.events.total).toBe(0);
    expect(result.galleries.total).toBe(0);
  });
});
