import type {Gallery} from '@types/cms';

type GallerySearchOptions = {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  sort?: 'latest' | 'oldest';
};

type GalleryPaginationOptions = GallerySearchOptions & {
  page?: number;
};

const SHARED_UPDATED_AT = '2024-03-10T12:00:00.000Z';

export const galleries: Gallery[] = [
  {
    id: 'gallery-main-highlight-vi',
    slug: 'khoanh-khac-noi-bat',
    translationKey: 'gallery-main-highlight',
    tenantId: 'tenant-main',
    locale: 'vi',
    title: 'Khoảnh khắc nổi bật',
    description: 'Những khoảnh khắc ấn tượng nhất trong đêm chung kết và gala trao giải CTT.',
    category: 'performance',
    tags: ['concert', 'gala', 'award'],
    coverImage: {
      id: 'gallery-highlight-cover',
      url: 'https://images.unsplash.com/photo-1485579149621-3123dd979885',
      alt: 'Biểu diễn piano trên sân khấu'
    },
    layout: 'masonry',
    updatedAt: '2024-03-15T08:00:00.000Z',
    items: [
      {
        id: 'main-highlight-1',
        media: {
          id: 'gallery-highlight-1',
          url: 'https://images.unsplash.com/photo-1485579149621-3123dd979885',
          alt: 'Biểu diễn piano trên sân khấu'
        },
        caption: 'Biểu diễn piano đêm chung kết'
      },
      {
        id: 'main-highlight-2',
        media: {
          id: 'gallery-highlight-2',
          url: 'https://images.unsplash.com/photo-1520512202623-51c5cdb34f6f',
          alt: 'Tứ tấu dây biểu diễn'
        },
        caption: 'Tứ tấu dây mở màn gala'
      },
      {
        id: 'main-highlight-3',
        media: {
          id: 'gallery-highlight-3',
          url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
          alt: 'Khán giả cổ vũ nhiệt tình'
        },
        caption: 'Khán giả tại Nhà hát lớn'
      },
      {
        id: 'main-highlight-4',
        media: {
          id: 'gallery-highlight-4',
          url: 'https://images.unsplash.com/photo-1484920287878-4b5e04d74fdc',
          alt: 'Thí sinh thanh nhạc biểu diễn'
        },
        caption: 'Phần thi Thanh nhạc hạng mục chuyên nghiệp'
      },
      {
        id: 'main-highlight-5',
        media: {
          id: 'gallery-highlight-5',
          url: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81a',
          alt: 'Nhạc trưởng và dàn nhạc giao hưởng'
        },
        caption: 'Dàn nhạc giao hưởng CTT'
      },
      {
        id: 'main-highlight-6',
        media: {
          id: 'gallery-highlight-6',
          url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
          alt: 'Khán giả đứng dậy cổ vũ'
        },
        caption: 'Khoảnh khắc trao giải cao trào'
      }
    ]
  },
  {
    id: 'gallery-main-highlight-en',
    slug: 'festival-highlights',
    translationKey: 'gallery-main-highlight',
    tenantId: 'tenant-main',
    locale: 'en',
    title: 'Festival highlights',
    description: 'A look back at the most unforgettable performances and award moments from the CTT finale.',
    category: 'performance',
    tags: ['concert', 'gala', 'award'],
    coverImage: {
      id: 'gallery-highlight-cover-en',
      url: 'https://images.unsplash.com/photo-1485579149621-3123dd979885',
      alt: 'Pianist performing on stage'
    },
    layout: 'masonry',
    updatedAt: '2024-03-15T08:00:00.000Z',
    items: [
      {
        id: 'main-highlight-en-1',
        media: {
          id: 'gallery-highlight-en-1',
          url: 'https://images.unsplash.com/photo-1485579149621-3123dd979885',
          alt: 'Pianist performing on stage'
        },
        caption: 'Final night piano performance'
      },
      {
        id: 'main-highlight-en-2',
        media: {
          id: 'gallery-highlight-en-2',
          url: 'https://images.unsplash.com/photo-1520512202623-51c5cdb34f6f',
          alt: 'String quartet on stage'
        },
        caption: 'String quartet opening the gala'
      },
      {
        id: 'main-highlight-en-3',
        media: {
          id: 'gallery-highlight-en-3',
          url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
          alt: 'Audience cheering in a theatre'
        },
        caption: 'Full house at the opera hall'
      },
      {
        id: 'main-highlight-en-4',
        media: {
          id: 'gallery-highlight-en-4',
          url: 'https://images.unsplash.com/photo-1484920287878-4b5e04d74fdc',
          alt: 'Vocalist singing on stage'
        },
        caption: 'Professional vocal category finalist'
      },
      {
        id: 'main-highlight-en-5',
        media: {
          id: 'gallery-highlight-en-5',
          url: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81a',
          alt: 'Symphony orchestra with a conductor'
        },
        caption: 'CTT Symphony Orchestra in action'
      },
      {
        id: 'main-highlight-en-6',
        media: {
          id: 'gallery-highlight-en-6',
          url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
          alt: 'Audience cheering and clapping'
        },
        caption: 'Standing ovation for the laureates'
      }
    ]
  },
  {
    id: 'gallery-main-backstage-vi',
    slug: 'hau-truong-ctt',
    translationKey: 'gallery-main-backstage',
    tenantId: 'tenant-main',
    locale: 'vi',
    title: 'Hậu trường CTT',
    description: 'Theo chân thí sinh và ekip trong những giờ phút chuẩn bị trước khi bước lên sân khấu.',
    category: 'behind-the-scenes',
    tags: ['rehearsal', 'team'],
    coverImage: {
      id: 'gallery-backstage-cover',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      alt: 'Hậu trường chuẩn bị trang phục'
    },
    layout: 'grid',
    updatedAt: SHARED_UPDATED_AT,
    items: [
      {
        id: 'main-backstage-1',
        media: {
          id: 'gallery-backstage-1',
          url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
          alt: 'Ekip hỗ trợ thí sinh chuẩn bị trang phục'
        },
        caption: 'Stylist hỗ trợ trang phục biểu diễn'
      },
      {
        id: 'main-backstage-2',
        media: {
          id: 'gallery-backstage-2',
          url: 'https://images.unsplash.com/photo-1529158062015-cad636e69505',
          alt: 'Nghệ sĩ violin tập luyện'
        },
        caption: 'Luyện tập trước giờ thi'
      },
      {
        id: 'main-backstage-3',
        media: {
          id: 'gallery-backstage-3',
          url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
          alt: 'Thí sinh chơi piano backstage'
        },
        caption: 'Khởi động cùng piano backstage'
      },
      {
        id: 'main-backstage-4',
        media: {
          id: 'gallery-backstage-4',
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
          alt: 'Ban tổ chức trao đổi kịch bản'
        },
        caption: 'Ban tổ chức rà soát kịch bản chương trình'
      }
    ]
  },
  {
    id: 'gallery-main-backstage-en',
    slug: 'behind-the-scenes',
    translationKey: 'gallery-main-backstage',
    tenantId: 'tenant-main',
    locale: 'en',
    title: 'Behind the scenes',
    description: 'Step backstage with contestants and crew as they fine-tune every detail before showtime.',
    category: 'behind-the-scenes',
    tags: ['rehearsal', 'team'],
    coverImage: {
      id: 'gallery-backstage-cover-en',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      alt: 'Crew preparing costumes backstage'
    },
    layout: 'grid',
    updatedAt: SHARED_UPDATED_AT,
    items: [
      {
        id: 'main-backstage-en-1',
        media: {
          id: 'gallery-backstage-en-1',
          url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
          alt: 'Crew preparing stage costumes'
        },
        caption: 'Styling before the spotlight'
      },
      {
        id: 'main-backstage-en-2',
        media: {
          id: 'gallery-backstage-en-2',
          url: 'https://images.unsplash.com/photo-1529158062015-cad636e69505',
          alt: 'Violinist warming up in rehearsal room'
        },
        caption: 'Instrument warm-up session'
      },
      {
        id: 'main-backstage-en-3',
        media: {
          id: 'gallery-backstage-en-3',
          url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
          alt: 'Contestant practicing piano backstage'
        },
        caption: 'A quick piano run-through'
      },
      {
        id: 'main-backstage-en-4',
        media: {
          id: 'gallery-backstage-en-4',
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
          alt: 'Production team discussing the show script'
        },
        caption: 'Production team sync before curtain rise'
      }
    ]
  },
  {
    id: 'gallery-classic-showcase-vi',
    slug: 'dem-hoa-nhac-co-dien',
    translationKey: 'gallery-classic-showcase',
    tenantId: 'tenant-classic',
    locale: 'vi',
    title: 'Đêm hòa nhạc cổ điển',
    description: 'Trải nghiệm hòa nhạc của học viên học viện cổ điển cùng dàn nhạc giao hưởng.',
    category: 'performance',
    tags: ['orchestra', 'student'],
    coverImage: {
      id: 'gallery-classic-cover',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      alt: 'Dàn nhạc cổ điển trên sân khấu'
    },
    layout: 'masonry',
    updatedAt: '2024-02-20T10:00:00.000Z',
    items: [
      {
        id: 'classic-showcase-1',
        media: {
          id: 'gallery-classic-1',
          url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
          alt: 'Dàn nhạc cổ điển trên sân khấu'
        },
        caption: 'Mở màn với bản giao hưởng Mozart'
      },
      {
        id: 'classic-showcase-2',
        media: {
          id: 'gallery-classic-2',
          url: 'https://images.unsplash.com/photo-1527356926121-76d811381f5b',
          alt: 'Nữ nghệ sĩ violon'
        },
        caption: 'Nữ nghệ sĩ violon solo'
      },
      {
        id: 'classic-showcase-3',
        media: {
          id: 'gallery-classic-3',
          url: 'https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c',
          alt: 'Khán giả thưởng thức hòa nhạc'
        },
        caption: 'Khán phòng ấm áp trong đêm nhạc'
      },
      {
        id: 'classic-showcase-4',
        media: {
          id: 'gallery-classic-4',
          url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
          alt: 'Dàn đồng ca học viên'
        },
        caption: 'Dàn đồng ca học viên trình diễn Ave Maria'
      }
    ]
  },
  {
    id: 'gallery-classic-showcase-en',
    slug: 'classical-showcase-night',
    translationKey: 'gallery-classic-showcase',
    tenantId: 'tenant-classic',
    locale: 'en',
    title: 'Classical showcase night',
    description: 'Students of the classical academy perform alongside a chamber orchestra.',
    category: 'performance',
    tags: ['orchestra', 'student'],
    coverImage: {
      id: 'gallery-classic-cover-en',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      alt: 'Classical orchestra performing on stage'
    },
    layout: 'masonry',
    updatedAt: '2024-02-20T10:00:00.000Z',
    items: [
      {
        id: 'classic-showcase-en-1',
        media: {
          id: 'gallery-classic-en-1',
          url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
          alt: 'Classical orchestra performing on stage'
        },
        caption: 'Opening with Mozart symphony'
      },
      {
        id: 'classic-showcase-en-2',
        media: {
          id: 'gallery-classic-en-2',
          url: 'https://images.unsplash.com/photo-1527356926121-76d811381f5b',
          alt: 'Female violinist soloing'
        },
        caption: 'Solo violinist captivating the audience'
      },
      {
        id: 'classic-showcase-en-3',
        media: {
          id: 'gallery-classic-en-3',
          url: 'https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c',
          alt: 'Audience enjoying the concert'
        },
        caption: 'A warm and intimate concert hall'
      },
      {
        id: 'classic-showcase-en-4',
        media: {
          id: 'gallery-classic-en-4',
          url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
          alt: 'Student choir singing'
        },
        caption: 'Student choir performing Ave Maria'
      }
    ]
  },
  {
    id: 'gallery-classic-masterclass-vi',
    slug: 'masterclass-violin',
    translationKey: 'gallery-classic-masterclass',
    tenantId: 'tenant-classic',
    locale: 'vi',
    title: 'Masterclass violin',
    description: 'Khoảnh khắc từ buổi masterclass violin cùng cố vấn nghệ thuật quốc tế.',
    category: 'education',
    tags: ['masterclass', 'violin'],
    coverImage: {
      id: 'gallery-masterclass-cover',
      url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
      alt: 'Giảng viên hướng dẫn violin'
    },
    layout: 'grid',
    updatedAt: '2024-01-18T09:00:00.000Z',
    items: [
      {
        id: 'classic-masterclass-1',
        media: {
          id: 'gallery-masterclass-1',
          url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
          alt: 'Giảng viên hướng dẫn violin'
        },
        caption: 'Thầy hướng dẫn kỹ thuật vibrato'
      },
      {
        id: 'classic-masterclass-2',
        media: {
          id: 'gallery-masterclass-2',
          url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
          alt: 'Học viên chăm chú lắng nghe'
        },
        caption: 'Học viên ghi chú bài học'
      },
      {
        id: 'classic-masterclass-3',
        media: {
          id: 'gallery-masterclass-3',
          url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc',
          alt: 'Phòng tập violin'
        },
        caption: 'Thực hành theo nhóm nhỏ'
      }
    ]
  },
  {
    id: 'gallery-classic-masterclass-en',
    slug: 'violin-masterclass',
    translationKey: 'gallery-classic-masterclass',
    tenantId: 'tenant-classic',
    locale: 'en',
    title: 'Violin masterclass',
    description: 'Highlights from the international mentor-led violin masterclass session.',
    category: 'education',
    tags: ['masterclass', 'violin'],
    coverImage: {
      id: 'gallery-masterclass-cover-en',
      url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
      alt: 'Violin instructor guiding a student'
    },
    layout: 'grid',
    updatedAt: '2024-01-18T09:00:00.000Z',
    items: [
      {
        id: 'classic-masterclass-en-1',
        media: {
          id: 'gallery-masterclass-en-1',
          url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
          alt: 'Violin instructor guiding a student'
        },
        caption: 'Mentor demonstrating vibrato technique'
      },
      {
        id: 'classic-masterclass-en-2',
        media: {
          id: 'gallery-masterclass-en-2',
          url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
          alt: 'Students listening attentively'
        },
        caption: 'Students jotting down insights'
      },
      {
        id: 'classic-masterclass-en-3',
        media: {
          id: 'gallery-masterclass-en-3',
          url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc',
          alt: 'Violin rehearsal room'
        },
        caption: 'Small group practice session'
      }
    ]
  }
];

function sortGalleries(
  items: Gallery[],
  sort: 'latest' | 'oldest' = 'latest'
) {
  const sorted = [...items].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return sort === 'latest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
}

function filterGalleries({tenantId, locale, category, tag, q}: GallerySearchOptions) {
  const normalizedQuery = q?.trim().toLowerCase();
  return galleries.filter((gallery) => {
    if (gallery.tenantId !== tenantId || gallery.locale !== locale) {
      return false;
    }
    if (category && gallery.category !== category) {
      return false;
    }
    if (tag && !gallery.tags?.includes(tag)) {
      return false;
    }
    if (normalizedQuery) {
      const haystack = [gallery.title, gallery.description, ...(gallery.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export function listGalleriesByTenant(options: GallerySearchOptions) {
  const {limit, sort = 'latest'} = options;
  const filtered = filterGalleries(options);
  const sorted = sortGalleries(filtered, sort);
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function searchGalleriesByTenant(options: GalleryPaginationOptions) {
  const {page = 1, limit = 9, sort = 'latest'} = options;
  const filtered = sortGalleries(filterGalleries(options), sort);
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    meta: {
      totalItems,
      totalPages,
      page: currentPage,
      limit
    }
  };
}

export function findGalleryBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return galleries.find((gallery) => gallery.tenantId === tenantId && gallery.locale === locale && gallery.slug === slug);
}

export function findGalleryTranslations({
  translationKey,
  galleryId
}: {
  translationKey: string;
  galleryId?: string;
}) {
  return galleries
    .filter((gallery) => gallery.translationKey === translationKey && gallery.id !== galleryId)
    .map((gallery) => ({
      id: gallery.id,
      locale: gallery.locale,
      slug: gallery.slug,
      tenantId: gallery.tenantId
    }));
}

export function listGalleryCategories({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  return Array.from(
    new Set(
      galleries
        .filter((gallery) => gallery.tenantId === tenantId && gallery.locale === locale && gallery.category)
        .map((gallery) => gallery.category as string)
    )
  );
}

export function listGalleryTags({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  return Array.from(
    new Set(
      galleries
        .filter((gallery) => gallery.tenantId === tenantId && gallery.locale === locale)
        .flatMap((gallery) => gallery.tags ?? [])
    )
  );
}
