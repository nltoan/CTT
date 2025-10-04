import {ImageResponse} from 'next/og';

import type {Tenant} from '@types/cms';
import type {Locale} from '@i18n/config';
import {getPageForTenant, getPost, getPostCategoryBySlug, getPostTagBySlug} from '@lib/pages';
import {getEvent} from '@lib/events';
import {getDiscipline} from '@lib/disciplines';
import {
  getGallery,
  getGalleryCategoryBySlug,
  getGalleryTagBySlug
} from '@lib/galleries';
import {getPersonBySlug} from '@lib/people';
import type {Gallery} from '@types/cms';

const DEFAULT_BACKGROUND = '#0f172a';
const DEFAULT_PRIMARY = '#d72638';
const DEFAULT_ACCENT = '#f5a623';
const DEFAULT_TEXT = '#ffffff';

export const OG_IMAGE_SIZE = {width: 1200, height: 630} as const;
export const OG_IMAGE_CONTENT_TYPE = 'image/png';

export type OgImagePayload = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export type OgImageContext = {
  tenant: Tenant;
  locale: Locale;
  slugSegments: string[];
  preview?: boolean;
  searchQuery?: string | null;
};

function toSentenceCase(value: string) {
  const normalized = value.replace(/[-_]+/g, ' ');
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function sanitizeOgText(input?: string | null, maxLength = 160) {
  if (!input) {
    return '';
  }

  const withoutHtml = input.replace(/<[^>]+>/g, ' ');
  const normalized = withoutHtml.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const safe = lastSpace > 60 ? truncated.slice(0, lastSpace) : truncated;
  return `${safe.replace(/[.,;:-]$/, '')}…`;
}

function getPalette(tenant?: Tenant) {
  return {
    primary: tenant?.primaryColor ?? DEFAULT_PRIMARY,
    accent: tenant?.accentColor ?? DEFAULT_ACCENT,
    background: tenant?.secondaryColor ?? DEFAULT_BACKGROUND,
    text: DEFAULT_TEXT
  };
}

function buildEventSubtitle({
  event,
  locale
}: {
  event: Awaited<ReturnType<typeof getEvent>>;
  locale: Locale;
}) {
  if (!event) {
    return '';
  }

  const formatter = new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    dateStyle: 'medium'
  });

  const startDate = event.startsAt ? formatter.format(new Date(event.startsAt)) : undefined;
  const endDate = event.endsAt ? formatter.format(new Date(event.endsAt)) : undefined;
  const location = event.location;

  const parts = [startDate];
  if (endDate && endDate !== startDate) {
    parts.push(locale === 'vi' ? `đến ${endDate}` : `to ${endDate}`);
  }

  const dateText = parts.filter(Boolean).join(' ');

  if (dateText && location) {
    return `${dateText} · ${location}`;
  }

  return dateText || location || '';
}

function buildGallerySubtitle(gallery: Gallery | null | undefined, locale: Locale) {
  if (!gallery) {
    return '';
  }

  const totalItems = gallery.items?.length ?? 0;
  if (!totalItems) {
    return gallery.description ?? '';
  }

  return locale === 'vi'
    ? `${totalItems} khoảnh khắc được ghi lại`
    : `${totalItems} captured moments`;
}

function defaultPagePayload({tenant, locale}: {tenant: Tenant; locale: Locale}): OgImagePayload {
  return {
    title: tenant.name,
    subtitle: tenant.description,
    eyebrow: locale === 'vi' ? 'Nền tảng sự kiện âm nhạc' : 'Music event platform'
  };
}

export async function resolveOgImageDataForSegments({
  tenant,
  locale,
  slugSegments,
  preview,
  searchQuery
}: OgImageContext): Promise<OgImagePayload> {
  const [first, second, third] = slugSegments;

  if (!first) {
    const page = await getPageForTenant({tenantId: tenant.id, slug: '', locale, preview});
    if (page) {
      return {
        title: page.seo?.title ?? page.title,
        subtitle: page.seo?.description ?? tenant.description,
        eyebrow: tenant.name
      };
    }
    return defaultPagePayload({tenant, locale});
  }

  if (first === 'news') {
    const eyebrow = locale === 'vi' ? 'Tin tức' : 'News';

    if (!second || second === 'page') {
      return {
        title: eyebrow,
        subtitle: tenant.description,
        eyebrow
      };
    }

    if (second === 'category' && third) {
      const category = await getPostCategoryBySlug({
        tenantId: tenant.id,
        locale,
        slug: third,
        preview
      });
      return {
        title: category?.label ?? toSentenceCase(decodeURIComponent(third)),
        subtitle: locale === 'vi' ? 'Chuyên mục bài viết' : 'Article category',
        eyebrow
      };
    }

    if (second === 'tag' && third) {
      const tag = await getPostTagBySlug({
        tenantId: tenant.id,
        locale,
        slug: third,
        preview
      });
      return {
        title: tag?.label ?? `#${toSentenceCase(decodeURIComponent(third))}`,
        subtitle: locale === 'vi' ? 'Chủ đề nổi bật' : 'Highlighted topic',
        eyebrow
      };
    }

    if (second === 'feed.xml') {
      return {
        title: eyebrow,
        subtitle: tenant.description,
        eyebrow
      };
    }

    const post = await getPost({
      tenantId: tenant.id,
      locale,
      slug: second,
      preview
    });

    if (post) {
      return {
        title: post.title,
        subtitle: post.excerpt,
        eyebrow
      };
    }

    return {
      title: eyebrow,
      subtitle: tenant.description,
      eyebrow
    };
  }

  if (first === 'events') {
    const eyebrow = locale === 'vi' ? 'Sự kiện' : 'Events';

    if (!second || second === 'page' || second === 'calendar.ics') {
      return {
        title: locale === 'vi' ? 'Lịch thi & Biểu diễn' : 'Schedule & Performances',
        subtitle: tenant.description,
        eyebrow
      };
    }

    const event = await getEvent({
      tenantId: tenant.id,
      locale,
      slug: second,
      preview
    });

    if (event) {
      return {
        title: event.title,
        subtitle: buildEventSubtitle({event, locale}),
        eyebrow
      };
    }

    return {
      title: eyebrow,
      subtitle: tenant.description,
      eyebrow
    };
  }

  if (first === 'disciplines') {
    const eyebrow = locale === 'vi' ? 'Bộ môn' : 'Disciplines';

    if (!second || second === 'page') {
      return {
        title: locale === 'vi' ? 'Các bộ môn dự thi' : 'Competition disciplines',
        subtitle: tenant.description,
        eyebrow
      };
    }

    const discipline = await getDiscipline({
      tenantId: tenant.id,
      locale,
      slug: second,
      preview
    });

    if (discipline) {
      const category = discipline.category ? toSentenceCase(discipline.category) : undefined;
      const level = discipline.level ? toSentenceCase(discipline.level) : undefined;
      const subtitle = [category, level, discipline.ageRange].filter(Boolean).join(' · ');
      return {
        title: discipline.name,
        subtitle: subtitle || discipline.shortDescription,
        eyebrow
      };
    }

    return {
      title: eyebrow,
      subtitle: tenant.description,
      eyebrow
    };
  }

  if (first === 'galleries') {
    const eyebrow = locale === 'vi' ? 'Thư viện' : 'Gallery';

    if (!second || second === 'page') {
      return {
        title: locale === 'vi' ? 'Khoảnh khắc nổi bật' : 'Festival highlights',
        subtitle: tenant.description,
        eyebrow
      };
    }

    if (second === 'category' && third) {
      const category = await getGalleryCategoryBySlug({
        tenantId: tenant.id,
        locale,
        slug: third,
        preview
      });
      return {
        title: category?.label ?? toSentenceCase(decodeURIComponent(third)),
        subtitle: locale === 'vi' ? 'Bộ sưu tập theo danh mục' : 'Gallery category',
        eyebrow
      };
    }

    if (second === 'tag' && third) {
      const tag = await getGalleryTagBySlug({
        tenantId: tenant.id,
        locale,
        slug: third,
        preview
      });
      return {
        title: tag?.label ?? `#${toSentenceCase(decodeURIComponent(third))}`,
        subtitle: locale === 'vi' ? 'Khoảnh khắc theo chủ đề' : 'Theme collection',
        eyebrow
      };
    }

    const gallery = await getGallery({
      tenantId: tenant.id,
      locale,
      slug: second,
      preview
    });

    if (gallery) {
      return {
        title: gallery.title,
        subtitle: buildGallerySubtitle(gallery, locale),
        eyebrow
      };
    }

    return {
      title: eyebrow,
      subtitle: tenant.description,
      eyebrow
    };
  }

  if (first === 'people') {
    const eyebrow = locale === 'vi' ? 'Giám khảo & Cố vấn' : 'Adjudicators & Mentors';

    if (!second || second === 'page') {
      return {
        title: eyebrow,
        subtitle: tenant.description,
        eyebrow
      };
    }

    const person = await getPersonBySlug({
      tenantId: tenant.id,
      locale,
      slug: second,
      preview
    });

    if (person) {
      const subtitle = person.title ?? person.quote ?? person.disciplines?.join(' · ');
      return {
        title: person.name,
        subtitle,
        eyebrow
      };
    }

    return {
      title: eyebrow,
      subtitle: tenant.description,
      eyebrow
    };
  }

  if (first === 'partners') {
    return {
      title: locale === 'vi' ? 'Đối tác & Nhà tài trợ' : 'Partners & Sponsors',
      subtitle: tenant.description,
      eyebrow: tenant.name
    };
  }

  if (first === 'search') {
    if (searchQuery) {
      return {
        title:
          locale === 'vi'
            ? `Kết quả cho “${searchQuery}”`
            : `Search results for “${searchQuery}”`,
        subtitle: tenant.name,
        eyebrow: locale === 'vi' ? 'Tìm kiếm' : 'Search'
      };
    }

    return {
      title: locale === 'vi' ? 'Tìm kiếm nội dung' : 'Search the festival',
      subtitle: tenant.name,
      eyebrow: locale === 'vi' ? 'Tìm kiếm' : 'Search'
    };
  }

  const slug = slugSegments.join('/');
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale, preview});

  if (page) {
    return {
      title: page.seo?.title ?? page.title,
      subtitle: page.seo?.description ?? tenant.description,
      eyebrow: tenant.name
    };
  }

  return defaultPagePayload({tenant, locale});
}

export function createOgImageResponse({
  title,
  subtitle,
  eyebrow,
  tenant
}: OgImagePayload & {tenant?: Tenant}) {
  const palette = getPalette(tenant);
  const safeTitle = sanitizeOgText(title, 140) || tenant?.name || 'CTT Platform';
  const safeSubtitle = sanitizeOgText(subtitle, 180);
  const safeEyebrow = sanitizeOgText(eyebrow, 60);

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: palette.background,
          color: palette.text,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(135deg, ${palette.background}, ${palette.primary})`
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -80,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -60,
            bottom: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0))`
          }}
        />
        <div
          style={{
            position: 'relative',
            padding: '72px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            height: '100%'
          }}
        >
          {safeEyebrow ? (
            <span
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '8px 18px',
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: palette.text,
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase'
              }}
            >
              {safeEyebrow}
            </span>
          ) : null}
          <h1
            style={{
              fontSize: 86,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -1.5,
              margin: 0,
              textShadow: '0 18px 48px rgba(0,0,0,0.35)'
            }}
          >
            {safeTitle}
          </h1>
          {safeSubtitle ? (
            <p
              style={{
                margin: 0,
                fontSize: 34,
                maxWidth: '70%',
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.85)'
              }}
            >
              {safeSubtitle}
            </p>
          ) : null}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <span style={{fontSize: 26, opacity: 0.8}}>
                {tenant?.description ?? (tenant ? tenant.name : 'CTT Platform')}
              </span>
              <strong style={{fontSize: 30}}>{tenant?.name ?? 'CTT Platform'}</strong>
            </div>
            <span
              style={{
                fontSize: 24,
                padding: '12px 24px',
                borderRadius: 999,
                backgroundColor: palette.accent,
                color: palette.background,
                fontWeight: 600
              }}
            >
              {localeLabel(tenant?.locales)}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE
    }
  );
}

function localeLabel(locales: Tenant['locales'] | undefined) {
  if (!locales || locales.length === 0) {
    return 'CTT Platform';
  }
  if (locales.length > 1) {
    return 'Song ngữ VI/EN';
  }
  const [locale] = locales;
  return locale === 'vi' ? 'Chương trình tiếng Việt' : 'English program';
}
