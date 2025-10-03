import {describe, expect, it} from 'vitest';

import {buildEventsIcs, buildNewsRssFeed} from '@lib/feeds';
import type {ResolvedSiteSettings} from '@lib/settings';
import type {Event, Post, Tenant} from '@types/cms';

const tenant: Tenant = {
  id: 'tenant-1',
  slug: 'main',
  name: 'Main Tenant',
  description: 'Primary tenant for testing',
  locales: ['vi', 'en']
};

const settings: ResolvedSiteSettings = {
  id: 'settings-1',
  tenantId: tenant.id,
  locale: 'vi',
  seo: {
    defaultTitle: 'CTT Platform',
    description: 'Test description',
    image: 'https://example.com/og.png',
    siteName: 'CTT',
    organizationName: 'CTT'
  },
  revalidateSeconds: 60
};

describe('buildNewsRssFeed', () => {
  const posts: Post[] = [
    {
      id: 'post-1',
      slug: 'welcome',
      title: 'Welcome',
      translationKey: 'post-welcome',
      excerpt: 'Short excerpt',
      coverImage: 'https://example.com/image.jpg',
      content: '<p>Hello world</p>',
      publishedAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      tenantId: tenant.id,
      locale: 'vi',
      tags: ['announcement']
    }
  ];

  it('tạo RSS feed hợp lệ với metadata và item', () => {
    const rss = buildNewsRssFeed({
      tenant,
      locale: 'vi',
      tenantPath: '',
      posts,
      settings
    });

    expect(rss).toContain('<rss');
    expect(rss).toContain('<channel>');
    expect(rss).toContain('<title>CTT Platform</title>');
    expect(rss).toContain('<language>vi-VN</language>');
    expect(rss).toContain('<item>');
    expect(rss).toContain('<guid isPermaLink="false">post-1</guid>');
    expect(rss).toContain('<category>announcement</category>');
    expect(rss).toContain('<enclosure url="https://example.com/image.jpg"');
  });
});

describe('buildEventsIcs', () => {
  const events: Event[] = [
    {
      id: 'event-1',
      slug: 'audition',
      translationKey: 'event-audition',
      tenantId: tenant.id,
      locale: 'vi',
      title: 'Audition Round',
      summary: 'Round 1 audition',
      startsAt: '2024-06-01T09:00:00.000Z',
      endsAt: '2024-06-01T11:00:00.000Z',
      location: 'HCMC',
      description: '<p>Bring your best performance!</p>'
    }
  ];

  it('xuất lịch ICS với sự kiện và metadata', () => {
    const ics = buildEventsIcs({
      tenant,
      locale: 'vi',
      tenantPath: '',
      events,
      settings
    });

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('PRODID:-//CTT//Music Events//EN');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('UID:event-1@main');
    expect(ics).toContain('SUMMARY:Audition Round');
    expect(ics).toContain('LOCATION:HCMC');
    expect(ics).toContain('END:VEVENT');
    expect(ics.trim().endsWith('END:VCALENDAR')).toBe(true);
  });
});
