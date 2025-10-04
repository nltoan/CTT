import type {SiteSettings} from '@types/cms';

export const settings: SiteSettings[] = [
  {
    id: 'settings-global-vi',
    locale: 'vi',
    seo: {
      defaultTitle: 'CTT Music Platform',
      description:
        'Hệ sinh thái website cho sự kiện và cuộc thi âm nhạc với khả năng tuỳ biến cao, hỗ trợ đa ngôn ngữ và đa tenant.',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      siteName: 'CTT Music Platform',
      organizationName: 'CTT Music Platform'
    },
    revalidateSeconds: 120,
    analytics: {
      gaId: 'G-CTT12345',
      gtmId: 'GTM-CTT678',
      requiresConsent: true
    },
    cookieBanner: {
      enabled: true,
      message:
        'Chúng tôi sử dụng cookie để cải thiện trải nghiệm và phân tích lượt truy cập. Bạn có muốn bật cookie không?',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Từ chối',
      moreInfoLabel: 'Tìm hiểu thêm',
      moreInfoUrl: 'https://cttmusic.example.com/privacy'
    }
  },
  {
    id: 'settings-global-en',
    locale: 'en',
    seo: {
      defaultTitle: 'CTT Music Platform',
      description:
        'A multi-tenant, multilingual music events platform with flexible page builder and high performance defaults.',
      image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885',
      siteName: 'CTT Music Platform',
      organizationName: 'CTT Music Platform'
    },
    revalidateSeconds: 120,
    analytics: {
      gaId: 'G-CTT12345',
      gtmId: 'GTM-CTT678',
      requiresConsent: true
    },
    cookieBanner: {
      enabled: true,
      message:
        'We use cookies to enhance your experience and understand traffic. Would you like to enable cookies?',
      acceptLabel: 'Allow',
      rejectLabel: 'Decline',
      moreInfoLabel: 'Learn more',
      moreInfoUrl: 'https://cttmusic.example.com/en/privacy'
    }
  },
  {
    id: 'settings-main-vi',
    tenantId: 'tenant-main',
    locale: 'vi',
    seo: {
      defaultTitle: 'CTT Music Showcase',
      description:
        'Khám phá sự kiện âm nhạc CTT với lịch thi, giám khảo và các chương trình biểu diễn đặc sắc.',
      siteName: 'CTT Music Showcase'
    },
    revalidateSeconds: 90
  },
  {
    id: 'settings-main-en',
    tenantId: 'tenant-main',
    locale: 'en',
    seo: {
      defaultTitle: 'CTT Music Showcase',
      description:
        'Discover the CTT music showcase, competition schedule, juries and signature performances.',
      siteName: 'CTT Music Showcase'
    },
    revalidateSeconds: 90
  },
  {
    id: 'settings-classic-vi',
    tenantId: 'tenant-classic',
    locale: 'vi',
    seo: {
      defaultTitle: 'CTT Classical Academy',
      description:
        'Chương trình cổ điển của CTT dành cho học viên trẻ với các khoá học chuyên sâu và biểu diễn định kỳ.',
      siteName: 'CTT Classical Academy',
      organizationName: 'CTT Classical Academy'
    },
    revalidateSeconds: 150,
    analytics: {
      gaId: 'G-CLASSIC001',
      requiresConsent: true
    },
    cookieBanner: {
      enabled: true,
      message:
        'Trang web sử dụng cookie phục vụ phân tích và tùy biến trải nghiệm. Cho phép chúng tôi dùng cookie nhé?',
      acceptLabel: 'Cho phép',
      rejectLabel: 'Để sau'
    }
  },
  {
    id: 'settings-classic-en',
    tenantId: 'tenant-classic',
    locale: 'en',
    seo: {
      defaultTitle: 'CTT Classical Academy',
      description:
        'CTT classical academy for young talents with in-depth programs and regular performances.',
      siteName: 'CTT Classical Academy',
      organizationName: 'CTT Classical Academy'
    },
    revalidateSeconds: 150,
    analytics: {
      gaId: 'G-CLASSIC001',
      requiresConsent: true
    },
    cookieBanner: {
      enabled: true,
      message:
        'This site uses cookies for analytics and personalization. Would you like to enable cookies?',
      acceptLabel: 'Enable',
      rejectLabel: 'Maybe later'
    }
  }
];

export function findSettings({
  tenantId,
  locale
}: {
  tenantId?: string;
  locale: 'vi' | 'en';
}) {
  return settings.filter(
    (entry) => entry.locale === locale && (!tenantId ? !entry.tenantId : entry.tenantId === tenantId)
  );
}
