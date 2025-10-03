import type {Slideshow} from '@types/cms';
import {matchesPublicationState} from './utils/publication';

const MAIN_SLIDESHOW_UPDATED_AT = '2025-01-18T00:00:00.000Z';
const CLASSIC_SLIDESHOW_UPDATED_AT = '2025-02-01T00:00:00.000Z';

const createMainHeroSlides = (locale: 'vi' | 'en') => [
  {
    id: `main-hero-1-${locale}`,
    title: locale === 'vi' ? 'Không gian biểu diễn đẳng cấp' : 'World-class performance hall',
    caption:
      locale === 'vi'
        ? 'Sân khấu chuẩn quốc tế sẵn sàng cho các tiết mục đỉnh cao.'
        : 'An international-grade stage prepared for outstanding showcases.',
    image: {
      id: `main-hero-1-image-${locale}`,
      url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc',
      alt: locale === 'vi' ? 'Sân khấu chính CTT' : 'CTT main stage'
    },
    href: '/events'
  },
  {
    id: `main-hero-2-${locale}`,
    title: locale === 'vi' ? 'Kết nối cộng đồng quốc tế' : 'International networking',
    caption:
      locale === 'vi'
        ? 'Các nghệ sĩ trẻ gặp gỡ chuyên gia và nhà tuyển sinh toàn cầu.'
        : 'Young artists connect with mentors and recruiters worldwide.',
    image: {
      id: `main-hero-2-image-${locale}`,
      url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
      alt: locale === 'vi' ? 'Workshop giao lưu' : 'Networking workshop'
    },
    href: '/news'
  },
  {
    id: `main-hero-3-${locale}`,
    title: locale === 'vi' ? 'Hành trình truyền cảm hứng' : 'Stories that inspire',
    caption:
      locale === 'vi'
        ? 'Lắng nghe chia sẻ từ các quán quân và cố vấn của CTT.'
        : 'Hear from CTT laureates and mentors.',
    image: {
      id: `main-hero-3-image-${locale}`,
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      alt: locale === 'vi' ? 'Thí sinh chia sẻ câu chuyện' : 'Contestant sharing a story'
    },
    href: '/people'
  }
];

const createClassicHeroSlides = (locale: 'vi' | 'en') => [
  {
    id: `classic-hero-1-${locale}`,
    title: locale === 'vi' ? 'Học bổng mùa thu 2025' : 'Fall 2025 scholarship spotlight',
    caption:
      locale === 'vi'
        ? 'Khám phá các chương trình học bổng danh giá của học viện.'
        : 'Discover the academy\'s prestigious scholarship programmes.',
    image: {
      id: `classic-hero-1-image-${locale}`,
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      alt: locale === 'vi' ? 'Học viên piano cổ điển' : 'Classical piano student'
    },
    href: '/disciplines/piano-co-dien'
  },
  {
    id: `classic-hero-2-${locale}`,
    title: locale === 'vi' ? 'Masterclass chỉ huy hợp xướng' : 'Choral conducting masterclasses',
    caption:
      locale === 'vi'
        ? 'Trải nghiệm giảng dạy từ các giáo sư khách mời hàng đầu.'
        : 'Experience teaching from leading guest professors.',
    image: {
      id: `classic-hero-2-image-${locale}`,
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      alt: locale === 'vi' ? 'Lớp học chỉ huy hợp xướng' : 'Choral conducting class'
    },
    href: '/events'
  },
  {
    id: `classic-hero-3-${locale}`,
    title: locale === 'vi' ? 'Không gian học tập linh hoạt' : 'Flexible learning spaces',
    caption:
      locale === 'vi'
        ? 'Phòng tập và studio hiện đại phục vụ mọi bộ môn.'
        : 'Modern rehearsal rooms and studios for every discipline.',
    image: {
      id: `classic-hero-3-image-${locale}`,
      url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
      alt: locale === 'vi' ? 'Phòng tập nhạc thính phòng' : 'Chamber music rehearsal room'
    },
    href: '/galleries'
  }
];

export const slideshows: Slideshow[] = [
  ...(['vi', 'en'] as const).flatMap((locale) => [
    {
      id: `tenant-main-hero-${locale}`,
      translationKey: 'tenant-main-hero',
      tenantId: 'tenant-main',
      locale,
      name: locale === 'vi' ? 'Slideshow trang chủ CTT' : 'CTT homepage slideshow',
      description:
        locale === 'vi'
          ? 'Hình ảnh tiêu biểu của lễ hội âm nhạc CTT.'
          : 'Signature moments from the CTT music festival.',
      slides: createMainHeroSlides(locale),
      options: {
        autoplay: true,
        interval: 6500,
        loop: true
      },
      status: 'published',
      publishedAt: '2024-12-01T08:00:00.000Z',
      updatedAt: MAIN_SLIDESHOW_UPDATED_AT
    }
  ]),
  ...(['vi', 'en'] as const).flatMap((locale) => [
    {
      id: `tenant-classic-hero-${locale}`,
      translationKey: 'tenant-classic-hero',
      tenantId: 'tenant-classic',
      locale,
      name: locale === 'vi' ? 'Trải nghiệm học viện cổ điển' : 'Classical academy experience',
      description:
        locale === 'vi'
          ? 'Giới thiệu chương trình đào tạo và cơ sở vật chất của tenant cổ điển.'
          : 'Showcasing programmes and facilities for the classical tenant.',
      slides: createClassicHeroSlides(locale),
      options: {
        autoplay: true,
        interval: 7000,
        loop: true
      },
      status: 'published',
      publishedAt: '2025-01-10T08:00:00.000Z',
      updatedAt: CLASSIC_SLIDESHOW_UPDATED_AT
    }
  ])
];

type SlideshowFilterInput = {
  tenantId: string;
  locale: 'vi' | 'en';
  includeDrafts?: boolean;
  limit?: number;
};

function filterSlideshows({tenantId, locale, includeDrafts}: SlideshowFilterInput) {
  return slideshows
    .filter((slideshow) => slideshow.tenantId === tenantId && slideshow.locale === locale)
    .filter((slideshow) => matchesPublicationState(slideshow, {includeDrafts}));
}

export function listSlideshowsByTenant({
  tenantId,
  locale,
  includeDrafts,
  limit
}: SlideshowFilterInput) {
  const results = filterSlideshows({tenantId, locale, includeDrafts});
  if (typeof limit === 'number') {
    return results.slice(0, Math.max(limit, 0));
  }
  return results;
}

export function findSlideshowById({
  id,
  tenantId,
  locale,
  includeDrafts,
  limit
}: SlideshowFilterInput & {id: string}) {
  const slideshow = filterSlideshows({tenantId, locale, includeDrafts}).find((item) => item.id === id);
  if (!slideshow) {
    return null;
  }
  if (typeof limit === 'number' && limit >= 0) {
    return {
      ...slideshow,
      slides: slideshow.slides.slice(0, limit)
    } satisfies Slideshow;
  }
  return slideshow;
}

export function findSlideshowTranslations({
  translationKey,
  slideshowId
}: {
  translationKey: string;
  slideshowId?: string;
}) {
  return slideshows
    .filter((slideshow) => slideshow.translationKey === translationKey)
    .filter((slideshow) => (slideshowId ? slideshow.id !== slideshowId : true))
    .map((slideshow) => ({
      id: slideshow.id,
      tenantId: slideshow.tenantId,
      locale: slideshow.locale
    }));
}
