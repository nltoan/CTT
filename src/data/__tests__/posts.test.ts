import {describe, expect, it} from 'vitest';

import {
  findPostCategoryBySlug,
  findPostTagBySlug,
  listPostCategories,
  listPostTags
} from '@data/posts';

const TENANT_MAIN = 'tenant-main';

describe('posts facets', () => {
  it('returns category facets with slugified values', () => {
    const categories = listPostCategories({tenantId: TENANT_MAIN, locale: 'vi'});
    const thongBao = categories.find((item) => item.label === 'Thông báo');

    expect(thongBao).toBeDefined();
    expect(thongBao?.slug).toBe('thong-bao');
    expect(thongBao?.count).toBeGreaterThan(0);
  });

  it('finds category by slug across locales', () => {
    const viCategory = findPostCategoryBySlug({
      tenantId: TENANT_MAIN,
      locale: 'vi',
      slug: 'huong-dan'
    });
    const enCategory = findPostCategoryBySlug({
      tenantId: TENANT_MAIN,
      locale: 'en',
      slug: 'guides'
    });

    expect(viCategory?.label).toBe('Hướng dẫn');
    expect(enCategory?.label).toBe('Guides');
  });

  it('returns tag facets with slugified values', () => {
    const tags = listPostTags({tenantId: TENANT_MAIN, locale: 'vi'});
    const dangKy = tags.find((item) => item.label === 'dang-ky');

    expect(tags.length).toBeGreaterThan(0);
    expect(dangKy?.slug).toBe('dang-ky');
  });

  it('finds tag by slug', () => {
    const tag = findPostTagBySlug({tenantId: TENANT_MAIN, locale: 'vi', slug: 'ban-giam-khao'});
    expect(tag?.label).toBe('ban-giam-khao');
  });
});
