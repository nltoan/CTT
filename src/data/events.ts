import type {Block} from '@types/blocks';
import type {Event} from '@types/cms';
import {matchesPublicationState} from './utils/publication';

type EventSeedInput = {
  tenantId: string;
  translationKey: string;
  base: {
    slug: string;
    title: string;
    summary: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    startsAt: string;
    endsAt?: string;
    location?: string;
    coverImage?: string;
    blocks?: Block[];
  };
  translations: {
    locale: 'vi' | 'en';
    slug: string;
    title: string;
    summary: string;
    description: string;
    content: string;
    blocks?: Block[];
  }[];
};

function createEventSeeds({tenantId, translationKey, base, translations}: EventSeedInput) {
  return translations.map<Event>((translation) => ({
    id: `${translationKey}-${translation.locale}`,
    tenantId,
    locale: translation.locale,
    translationKey,
    slug: translation.slug,
    title: translation.title,
    summary: translation.summary,
    startsAt: base.startsAt,
    endsAt: base.endsAt,
    location: base.location,
    description: translation.description,
    category: base.category,
    tags: base.tags,
    coverImage: base.coverImage,
    content: translation.content,
    blocks: translation.blocks ?? base.blocks,
    updatedAt: '2024-12-20T00:00:00.000Z'
  }));
}

const sharedTimelineBlocks = (locale: 'vi' | 'en'): Block[] => [
  {
    type: 'timeline',
    style: {
      variant: 'muted',
      container: 'content',
      spacing: {padding: 'md'}
    },
    title: locale === 'vi' ? 'Lịch trình chi tiết' : 'Detailed timeline',
    items: [
      {
        title: locale === 'vi' ? 'Đón khách & networking' : 'Welcome & networking',
        datetime: '2025-02-15T08:30:00.000Z',
        description:
          locale === 'vi'
            ? 'Khách tham dự check-in, nhận tài liệu, giao lưu cùng ban tổ chức.'
            : 'Attendees check in, collect materials, and meet with the organizing team.'
      },
      {
        title: locale === 'vi' ? 'Chia sẻ từ nghệ sĩ quốc tế' : 'International faculty spotlight',
        datetime: '2025-02-15T09:15:00.000Z',
        description:
          locale === 'vi'
            ? 'Nghệ sĩ khách mời chia sẻ hành trình phát triển sự nghiệp và bí quyết luyện tập.'
            : 'Guest artists share their career journey and practice routines.'
      },
      {
        title: locale === 'vi' ? 'Hỏi đáp & kết nối' : 'Q&A and networking',
        datetime: '2025-02-15T10:45:00.000Z',
        description:
          locale === 'vi'
            ? 'Kết nối với giảng viên, nhận tư vấn cá nhân hóa cho kế hoạch học tập.'
            : 'Connect with mentors for personalized study plans.'
      }
    ]
  },
  {
    type: 'cta-buttons',
    style: {
      align: 'center',
      spacing: {padding: 'md'}
    },
    items: [
      {
        label: locale === 'vi' ? 'Đăng ký tham dự' : 'Register now',
        href: 'https://example.com/register',
        external: true
      },
      {
        label: locale === 'vi' ? 'Tải brochure' : 'Download brochure',
        href: 'https://example.com/brochure.pdf',
        external: true
      }
    ]
  }
];

const events: Event[] = [
  ...createEventSeeds({
    tenantId: 'tenant-main',
    translationKey: 'career-orientation-workshop',
    base: {
      slug: 'career-orientation-workshop',
      title: 'Career orientation workshop',
      summary: 'Insights from international faculty on building a sustainable music career.',
      description:
        'International mentors reveal how to plan your long-term journey with tailored practice roadmaps and global opportunities.',
      content:
        '<p>Attendees will learn how to set realistic career milestones, explore scholarship paths, and connect with industry leaders.</p>',
      category: 'Workshop',
      tags: ['workshop', 'career'],
      startsAt: '2025-02-15T09:00:00.000Z',
      endsAt: '2025-02-15T11:30:00.000Z',
      location: 'Hà Nội',
      coverImage:
        'https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1400&q=80',
      blocks: sharedTimelineBlocks('en')
    },
    translations: [
      {
        locale: 'vi',
        slug: 'hoi-thao-dinh-huong-nghe-nghiep',
        title: 'Hội thảo định hướng nghề nghiệp',
        summary: 'Chia sẻ từ giảng viên và nghệ sĩ quốc tế về định hướng phát triển sự nghiệp.',
        description:
          'Cập nhật xu hướng nghề nghiệp, cách lên lộ trình luyện tập và cơ hội kết nối với giảng viên quốc tế.',
        content:
          '<p>Tham dự để nhận được tư vấn cá nhân hóa về kế hoạch học tập, cơ hội học bổng và kỹ năng phát triển bản thân.</p>',
        blocks: sharedTimelineBlocks('vi')
      },
      {
        locale: 'en',
        slug: 'career-orientation-workshop',
        title: 'Career orientation workshop',
        summary: 'Insights from international faculty on building a sustainable music career.',
        description:
          'International mentors reveal how to plan your long-term journey with tailored practice roadmaps and global opportunities.',
        content:
          '<p>Attendees will learn how to set realistic career milestones, explore scholarship paths, and connect with industry leaders.</p>'
      }
    ]
  }),
  ...createEventSeeds({
    tenantId: 'tenant-main',
    translationKey: 'gala-concert-2025',
    base: {
      slug: '2025-gala-concert',
      title: '2025 Gala Concert',
      summary: 'A celebration featuring award-winning talents with a symphony orchestra.',
      description: 'Experience the magic of orchestral arrangements and solo performances from top finalists.',
      content:
        '<p>The gala concert gathers laureates from across categories with a full symphony orchestra, conducted by maestro Minh An.</p>',
      category: 'Concert',
      tags: ['concert', 'live'],
      startsAt: '2025-05-02T19:00:00.000Z',
      location: 'Nhà hát lớn Hà Nội',
      coverImage:
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1400&q=80',
      blocks: [
        {
          type: 'image-gallery',
          style: {
            variant: 'highlight',
            container: 'wide'
          },
          layout: 'grid',
          items: [
            {
              media: {
                id: 'gala-1',
                url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80',
                alt: 'Orchestra performing on stage'
              },
              caption: 'Dàn nhạc giao hưởng biểu diễn mở màn'
            },
            {
              media: {
                id: 'gala-2',
                url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
                alt: 'Soloist performing'
              },
              caption: 'Tiết mục solo của quán quân bảng Piano'
            }
          ]
        }
      ]
    },
    translations: [
      {
        locale: 'vi',
        slug: 'concert-gala-2025',
        title: 'Concert Gala 2025',
        summary: 'Đêm nhạc vinh danh các tài năng đoạt giải cùng dàn nhạc giao hưởng.',
        description: 'Thưởng thức những tác phẩm kinh điển cùng phần trình diễn của các quán quân mùa giải.',
        content:
          '<p>Concert Gala quy tụ những tiết mục xuất sắc nhất với phần dàn dựng công phu, hứa hẹn là trải nghiệm không thể bỏ lỡ.</p>'
      },
      {
        locale: 'en',
        slug: '2025-gala-concert',
        title: '2025 Gala Concert',
        summary: 'A celebration featuring award-winning talents with a symphony orchestra.',
        description: 'Experience the magic of orchestral arrangements and solo performances from top finalists.',
        content:
          '<p>The gala concert gathers laureates from across categories with a full symphony orchestra, conducted by maestro Minh An.</p>'
      }
    ]
  }),
  ...createEventSeeds({
    tenantId: 'tenant-classic',
    translationKey: 'scholarship-audition-day',
    base: {
      slug: 'scholarship-audition-day',
      title: 'Scholarship audition day',
      summary: 'Select candidates for the Fall scholarship program with international faculty.',
      description:
        'Candidates perform two contrasting pieces and receive feedback from the adjudication panel to unlock full or partial scholarships.',
      content:
        '<p>Each performer will have 12 minutes, followed by a 5-minute conversation with the judges about study plans and expectations.</p>',
      category: 'Audition',
      tags: ['audition', 'scholarship'],
      startsAt: '2025-06-12T08:30:00.000Z',
      location: 'TP. Hồ Chí Minh',
      coverImage:
        'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1400&q=80',
      blocks: [
        {
          type: 'rich-content',
          content:
            '<h2>Yêu cầu chương trình</h2><ul><li>02 tác phẩm với phong cách tương phản.</li><li>Bản sao chứng nhận học tập gần nhất.</li><li>Thư giới thiệu từ giáo viên chính.</li></ul>'
        }
      ]
    },
    translations: [
      {
        locale: 'vi',
        slug: 'audition-hoc-bong',
        title: 'Buổi audition học bổng',
        summary: 'Tuyển chọn học viên cho chương trình học bổng mùa Thu với hội đồng giảng viên quốc tế.',
        description:
          'Thí sinh trình diễn hai tác phẩm tương phản và nhận phản hồi trực tiếp từ ban giám khảo để giành học bổng toàn phần hoặc bán phần.',
        content:
          '<p>Mỗi thí sinh có 12 phút trình diễn và 5 phút trao đổi cùng giám khảo về kế hoạch học tập, định hướng tương lai.</p>'
      },
      {
        locale: 'en',
        slug: 'scholarship-audition-day',
        title: 'Scholarship audition day',
        summary: 'Select candidates for the Fall scholarship program with international faculty.',
        description:
          'Candidates perform two contrasting pieces and receive feedback from the adjudication panel to unlock full or partial scholarships.',
        content:
          '<p>Each performer will have 12 minutes, followed by a 5-minute conversation with the judges about study plans and expectations.</p>'
      }
    ]
  })
].flat();

export {events};

function matchesStatus(event: Event, status?: 'upcoming' | 'past' | 'all', now = new Date()) {
  if (!status || status === 'all') {
    return true;
  }
  const start = new Date(event.startsAt).getTime();
  const nowTime = now.getTime();
  return status === 'upcoming' ? start >= nowTime : start < nowTime;
}

function matchesCategory(event: Event, category?: string) {
  if (!category) return true;
  return event.category?.toLowerCase() === category.toLowerCase();
}

function matchesSearch(event: Event, q?: string) {
  if (!q) return true;
  const normalized = q.toLowerCase();
  const haystack = [event.title, event.summary, event.description]
    .concat(event.tags ?? [])
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(normalized);
}

export function listEventsByTenant({
  tenantId,
  locale,
  from,
  to,
  limit,
  status,
  category,
  q,
  includeDrafts = false
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  from?: Date;
  to?: Date;
  limit?: number;
  status?: 'upcoming' | 'past' | 'all';
  category?: string;
  q?: string;
  includeDrafts?: boolean;
}) {
  const filtered = events
    .filter((event) => event.tenantId === tenantId && event.locale === locale)
    .filter((event) => matchesPublicationState(event, {includeDrafts}))
    .filter((event) => {
      const startsAt = new Date(event.startsAt);
      if (from && startsAt < from) {
        return false;
      }
      if (to && startsAt > to) {
        return false;
      }
      return true;
    })
    .filter((event) => matchesStatus(event, status))
    .filter((event) => matchesCategory(event, category))
    .filter((event) => matchesSearch(event, q))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  if (typeof limit === 'number') {
    return filtered.slice(0, limit);
  }

  return filtered;
}

export function searchEventsByTenant({
  tenantId,
  locale,
  page = 1,
  limit = 6,
  status,
  category,
  q,
  from,
  to,
  includeDrafts = false
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  status?: 'upcoming' | 'past' | 'all';
  category?: string;
  q?: string;
  from?: Date;
  to?: Date;
  includeDrafts?: boolean;
}) {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.max(1, limit);
  const results = listEventsByTenant({
    tenantId,
    locale,
    from,
    to,
    status,
    category,
    q,
    includeDrafts
  });
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / normalizedLimit));
  const startIndex = (normalizedPage - 1) * normalizedLimit;
  const items = results.slice(startIndex, startIndex + normalizedLimit);

  return {
    items,
    total,
    page: normalizedPage,
    limit: normalizedLimit,
    totalPages,
    hasMore: normalizedPage < totalPages
  };
}

export function findEventBySlug({
  tenantId,
  locale,
  slug,
  includeDrafts = false
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  includeDrafts?: boolean;
}) {
  return events.find(
    (event) =>
      event.tenantId === tenantId &&
      event.locale === locale &&
      event.slug === slug &&
      matchesPublicationState(event, {includeDrafts})
  );
}

export function findEventTranslations({
  translationKey,
  eventId
}: {
  translationKey: string;
  eventId?: string;
}) {
  return events
    .filter((event) => event.translationKey === translationKey)
    .filter((event) => (eventId ? event.id !== eventId : true))
    .map((event) => ({
      locale: event.locale,
      slug: event.slug
    }));
}

export function listEventCategories({
  tenantId,
  locale,
  includeDrafts = false
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  includeDrafts?: boolean;
}) {
  const categories = new Set<string>();
  events.forEach((event) => {
    if (
      event.tenantId === tenantId &&
      event.locale === locale &&
      event.category &&
      matchesPublicationState(event, {includeDrafts})
    ) {
      categories.add(event.category);
    }
  });
  return Array.from(categories);
}
