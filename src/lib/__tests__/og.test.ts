import {describe, expect, it} from 'vitest';

import {tenants} from '@data/tenants';
import {sanitizeOgText, resolveOgImageDataForSegments} from '@lib/og';

const tenant = tenants[0];

describe('sanitizeOgText', () => {
  it('strips HTML tags and normalizes whitespace', () => {
    expect(sanitizeOgText('Hello <strong>World</strong>!')).toBe('Hello World!');
  });

  it('truncates text with ellipsis when exceeding max length', () => {
    const longText = 'a '.repeat(200);
    expect(sanitizeOgText(longText, 40)).toMatch(/…$/);
  });
});

describe('resolveOgImageDataForSegments', () => {
  it('returns listing metadata for news collection', async () => {
    const payload = await resolveOgImageDataForSegments({
      tenant,
      locale: 'vi',
      slugSegments: ['news']
    });

    expect(payload.title).toBe('Tin tức');
    expect(payload.eyebrow).toBe('Tin tức');
  });

  it('returns post detail metadata with title and excerpt', async () => {
    const payload = await resolveOgImageDataForSegments({
      tenant,
      locale: 'vi',
      slugSegments: ['news', 'gioi-thieu-ban-giam-khao-2025']
    });

    expect(payload.title).toContain('Gặp gỡ ban giám khảo');
    expect(payload.eyebrow).toBe('Tin tức');
  });

  it('falls back to tenant info for unknown slugs', async () => {
    const payload = await resolveOgImageDataForSegments({
      tenant,
      locale: 'en',
      slugSegments: ['unknown-section', 'missing']
    });

    expect(payload.title).toBe(tenant.name);
    expect(payload.subtitle).toBe(tenant.description);
  });

  it('includes search query in payload when provided', async () => {
    const payload = await resolveOgImageDataForSegments({
      tenant,
      locale: 'en',
      slugSegments: ['search'],
      searchQuery: 'piano'
    });

    expect(payload.title).toContain('piano');
    expect(payload.eyebrow).toBe('Search');
  });
});
