import {describe, expect, it} from 'vitest';

import {getSlideshow, getSlideshows} from '@lib/slideshows';

describe('slideshows library', () => {
  it('lists slideshows by tenant and locale with limit', async () => {
    const results = await getSlideshows({tenantId: 'tenant-main', locale: 'vi', limit: 1});

    expect(results).toHaveLength(1);
    expect(results[0]?.tenantId).toBe('tenant-main');
    expect(results[0]?.locale).toBe('vi');
  });

  it('returns slideshow detail with limited slides', async () => {
    const slideshow = await getSlideshow({
      tenantId: 'tenant-main',
      locale: 'vi',
      id: 'tenant-main-hero-vi',
      limit: 2
    });

    expect(slideshow).toBeTruthy();
    expect(slideshow?.slides).toHaveLength(2);
  });

  it('returns null when slideshow does not exist', async () => {
    const slideshow = await getSlideshow({
      tenantId: 'tenant-main',
      locale: 'vi',
      id: 'unknown'
    });

    expect(slideshow).toBeNull();
  });
});
