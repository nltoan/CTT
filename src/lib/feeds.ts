import {buildAbsoluteUrl, buildPath, mapLocaleToBcp47} from '@lib/seo';
import type {ResolvedSiteSettings} from '@lib/settings';
import type {Event, Post, Tenant} from '@types/cms';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(value?: string) {
  if (!value) {
    return '';
  }
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeIcsText(value?: string) {
  if (!value) {
    return '';
  }
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function formatDateForIcs(date: string) {
  return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function buildNewsRssFeed({
  tenant,
  locale,
  tenantPath,
  posts,
  settings
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  posts: Post[];
  settings?: ResolvedSiteSettings;
}) {
  const language = mapLocaleToBcp47(locale);
  const siteTitle = settings?.seo?.siteName ?? tenant.name;
  const siteDescription =
    settings?.seo?.description ?? tenant.description ??
    (locale === 'vi'
      ? 'Tin tức và cập nhật mới nhất từ nền tảng sự kiện âm nhạc.'
      : 'Latest news and updates from the music event platform.');
  const newsPath = buildPath({locale, tenantPath, slugSegments: ['news']});
  const feedPath = buildPath({locale, tenantPath, slugSegments: ['news', 'feed.xml']});
  const channelLink = buildAbsoluteUrl(newsPath);
  const feedLink = buildAbsoluteUrl(feedPath);
  const lastBuildDate = posts[0]
    ? new Date(posts[0].updatedAt ?? posts[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const itemsXml = posts
    .map((post) => {
      const postPath = buildPath({locale, tenantPath, slugSegments: ['news', post.slug]});
      const postUrl = buildAbsoluteUrl(postPath);
      const summary = post.excerpt ?? stripHtml(post.content) ?? '';
      const categories = post.tags ?? (post.category ? [post.category] : []);
      const enclosure = post.coverImage
        ? `\n      <enclosure url="${escapeXml(post.coverImage)}" type="image/jpeg" />`
        : '';

      return `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(postUrl)}</link>\n      <guid isPermaLink="false">${escapeXml(post.id)}</guid>\n      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>\n      <description><![CDATA[${post.content ?? summary}]]></description>${
        categories.length
          ? `\n      ${categories
              .map((category) => `<category>${escapeXml(category)}</category>`)
              .join('\n      ')}`
          : ''
      }${enclosure}\n    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${escapeXml(siteTitle)}</title>\n    <description>${escapeXml(siteDescription)}</description>\n    <link>${escapeXml(channelLink)}</link>\n    <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml" />\n    <language>${language}</language>\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n${itemsXml}\n  </channel>\n</rss>\n`;
}

export function buildEventsIcs({
  tenant,
  locale,
  tenantPath,
  events,
  settings
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  events: Event[];
  settings?: ResolvedSiteSettings;
}) {
  const calendarName = settings?.seo?.siteName ?? tenant.name;
  const calendarDescription =
    settings?.seo?.description ?? tenant.description ??
    (locale === 'vi'
      ? 'Lịch sự kiện và cuộc thi âm nhạc.'
      : 'Music competitions and events calendar.');
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CTT//Music Events//EN',
    'CALSCALE:GREGORIAN',
    `NAME:${escapeIcsText(calendarName)}`,
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    `X-WR-CALDESC:${escapeIcsText(calendarDescription)}`,
    'X-WR-TIMEZONE:UTC'
  ];

  events.forEach((event) => {
    const eventPath = buildPath({locale, tenantPath, slugSegments: ['events', event.slug]});
    const eventUrl = buildAbsoluteUrl(eventPath);
    const endDate = event.endsAt ?? event.startsAt;
    const description = stripHtml(event.description ?? event.summary);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${escapeIcsText(`${event.id}@${tenant.slug}`)}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART:${formatDateForIcs(event.startsAt)}`);
    lines.push(`DTEND:${formatDateForIcs(endDate)}`);
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
    if (description) {
      lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
    }
    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    }
    lines.push(`URL:${escapeIcsText(eventUrl)}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  return `${lines.join('\r\n')}\r\n`;
}
