import type {Post} from '@types/cms';
import {ensureSlug} from '../utils/slug';

export type PostCategoryFacet = {
  label: string;
  slug: string;
  count: number;
};

export type PostTagFacet = {
  label: string;
  slug: string;
  count: number;
};

const DEFAULT_AUTHORS = {
  vi: 'Ban tổ chức CTT',
  en: 'CTT Organizing Committee'
} as const;

const MAIN_POST_UPDATED_AT = '2025-01-18T00:00:00.000Z';
const CLASSIC_POST_UPDATED_AT = '2025-01-18T00:00:00.000Z';

const mainPosts: Post[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `post-1-${locale}`,
    translationKey: 'tenant-main-post-1',
    slug: locale === 'vi' ? 'gioi-thieu-ban-giam-khao-2025' : 'meet-the-judges-2025',
    title:
      locale === 'vi'
        ? 'Gặp gỡ ban giám khảo quốc tế 2025'
        : 'Meet the 2025 international jury',
    excerpt:
      locale === 'vi'
        ? 'Ban giám khảo gồm các nghệ sĩ từ Mỹ, Anh, Nhật và Việt Nam.'
        : 'The jury features artists from the US, UK, Japan and Vietnam.',
    publishedAt: '2024-12-20T08:00:00.000Z',
    updatedAt: MAIN_POST_UPDATED_AT,
    tenantId: 'tenant-main',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4',
    author: DEFAULT_AUTHORS[locale],
    category: locale === 'vi' ? 'Thông báo' : 'Announcement',
    tags:
      locale === 'vi'
        ? ['ban-giam-khao', 'cimfc']
        : ['jury', 'ctt-festival']
  },
  {
    id: `post-2-${locale}`,
    translationKey: 'tenant-main-post-2',
    slug: locale === 'vi' ? 'huong-dan-dang-ky-thi-sinh' : 'contestant-registration-guide',
    title:
      locale === 'vi'
        ? 'Hướng dẫn đăng ký thí sinh'
        : 'Contestant registration guide',
    excerpt:
      locale === 'vi'
        ? 'Các bước chuẩn bị hồ sơ, quay video và nộp phí dự thi.'
        : 'Steps to prepare your portfolio, record videos and submit fees.',
    publishedAt: '2025-01-05T10:00:00.000Z',
    updatedAt: MAIN_POST_UPDATED_AT,
    tenantId: 'tenant-main',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81a',
    author: DEFAULT_AUTHORS[locale],
    category: locale === 'vi' ? 'Hướng dẫn' : 'Guides',
    tags:
      locale === 'vi'
        ? ['dang-ky', 'thi-sinh']
        : ['registration', 'contestant']
  },
  {
    id: `post-3-${locale}`,
    translationKey: 'tenant-main-post-3',
    slug: locale === 'vi' ? 'lich-trinh-vong-loai' : 'audition-schedule',
    title:
      locale === 'vi'
        ? 'Lịch trình vòng loại và các mốc quan trọng'
        : 'Audition schedule and key milestones',
    excerpt:
      locale === 'vi'
        ? 'Theo dõi các mốc nộp hồ sơ, công bố kết quả và vòng chung kết.'
        : 'Track submission deadlines, announcement dates and the live finals.',
    publishedAt: '2024-12-28T09:30:00.000Z',
    updatedAt: MAIN_POST_UPDATED_AT,
    tenantId: 'tenant-main',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    author: DEFAULT_AUTHORS[locale],
    category: locale === 'vi' ? 'Lịch trình' : 'Schedule',
    tags:
      locale === 'vi'
        ? ['timeline', 'su-kien']
        : ['timeline', 'events']
  },
  {
    id: `post-4-${locale}`,
    translationKey: 'tenant-main-post-4',
    slug: locale === 'vi' ? 'chia-se-tu-quy-quan' : 'finalists-spotlight',
    title:
      locale === 'vi'
        ? 'Chia sẻ từ các quán quân mùa trước'
        : 'Insights from previous champions',
    excerpt:
      locale === 'vi'
        ? 'Những câu chuyện truyền cảm hứng từ các thí sinh đạt giải cao.'
        : 'Inspiring stories from laureates of past seasons.',
    publishedAt: '2025-01-12T14:00:00.000Z',
    updatedAt: MAIN_POST_UPDATED_AT,
    tenantId: 'tenant-main',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0',
    author: DEFAULT_AUTHORS[locale],
    category: locale === 'vi' ? 'Câu chuyện' : 'Stories',
    tags:
      locale === 'vi'
        ? ['nguoi-thang', 'truyen-cam-hung']
        : ['winners', 'stories']
  }
]);

const classicPosts: Post[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `classic-post-1-${locale}`,
    translationKey: 'tenant-classic-post-1',
    slug: locale === 'vi' ? 'chuong-trinh-thu-2025' : 'fall-2025-programs',
    title:
      locale === 'vi'
        ? 'Ra mắt chương trình Học kỳ Thu 2025'
        : 'Introducing the Fall 2025 curriculum',
    excerpt:
      locale === 'vi'
        ? 'Các lớp thính phòng, piano nâng cao và chỉ huy hợp xướng khai giảng từ tháng 9.'
        : 'Chamber music, advanced piano and choral conducting classes open in September.',
    publishedAt: '2025-02-12T09:00:00.000Z',
    updatedAt: CLASSIC_POST_UPDATED_AT,
    tenantId: 'tenant-classic',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1521336751524-4dc5b63c409d',
    author: DEFAULT_AUTHORS[locale],
    category: locale === 'vi' ? 'Chương trình' : 'Programs',
    tags:
      locale === 'vi'
        ? ['chuong-trinh', 'hoc-vien']
        : ['curriculum', 'academy']
  },
  {
    id: `classic-post-2-${locale}`,
    translationKey: 'tenant-classic-post-2',
    slug: locale === 'vi' ? 'gap-go-giao-su-khach-moi' : 'meet-guest-professors',
    title:
      locale === 'vi'
        ? 'Gặp gỡ các giáo sư khách mời mùa hè'
        : 'Meet the summer guest professors',
    excerpt:
      locale === 'vi'
        ? 'Giáo sư từ Juilliard, Royal College of Music và Nhạc viện Tokyo.'
        : 'Professors from Juilliard, the Royal College of Music and Tokyo University of the Arts.',
    publishedAt: '2025-02-25T07:45:00.000Z',
    updatedAt: CLASSIC_POST_UPDATED_AT,
    tenantId: 'tenant-classic',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1454922915609-78549ad709bb',
    author: DEFAULT_AUTHORS[locale],
    category: locale === 'vi' ? 'Giảng viên' : 'Faculty',
    tags:
      locale === 'vi'
        ? ['giao-su', 'khach-moi']
        : ['professors', 'guest']
  }
]);

export const posts: Post[] = [...mainPosts, ...classicPosts];

type PostFilterInput = {
  tenantId: string;
  locale: 'vi' | 'en';
  category?: string;
  tag?: string;
  q?: string;
};

function filterPosts({tenantId, locale, category, tag, q}: PostFilterInput) {
  const normalizedCategory = category?.toLowerCase();
  const normalizedTag = tag?.toLowerCase();
  const normalizedQuery = q?.toLowerCase();

  return posts
    .filter((post) => post.tenantId === tenantId && post.locale === locale)
    .filter((post) => {
      if (!normalizedCategory) {
        return true;
      }
      return post.category?.toLowerCase() === normalizedCategory;
    })
    .filter((post) => {
      if (!normalizedTag) {
        return true;
      }
      return post.tags?.some((tagItem) => tagItem.toLowerCase() === normalizedTag) ?? false;
    })
    .filter((post) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = [post.title, post.excerpt, post.category, post.author, ...(post.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function listPostsByTenant({
  tenantId,
  locale,
  limit,
  category,
  tag,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
}) {
  const filtered = filterPosts({tenantId, locale, category, tag, q});
  return filtered.slice(0, limit ?? filtered.length);
}

export function searchPostsByTenant({
  tenantId,
  locale,
  page = 1,
  limit = 10,
  category,
  tag,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
}) {
  const computedLimit = typeof limit === 'number' && !Number.isNaN(limit) ? limit : 10;
  const safeLimit = Math.max(1, Math.min(computedLimit, 50));
  const computedPage = typeof page === 'number' && !Number.isNaN(page) ? page : 1;
  const safePage = Math.max(1, computedPage);
  const filtered = filterPosts({tenantId, locale, category, tag, q});
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const normalizedPage = Math.min(safePage, totalPages);
  const start = (normalizedPage - 1) * safeLimit;
  const items = filtered.slice(start, start + safeLimit);

  return {
    items,
    total,
    page: normalizedPage,
    limit: safeLimit,
    totalPages,
    hasMore: start + safeLimit < total
  };
}

export function listPostCategories({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}): PostCategoryFacet[] {
  const filtered = filterPosts({tenantId, locale});
  const map = new Map<string, PostCategoryFacet>();

  filtered.forEach((post) => {
    if (!post.category) {
      return;
    }
    const slug = ensureSlug(post.category, `category-${map.size + 1}`);
    const current = map.get(slug);
    if (current) {
      current.count += 1;
    } else {
      map.set(slug, {
        label: post.category,
        slug,
        count: 1
      });
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label, locale === 'en' ? 'en' : 'vi', {sensitivity: 'base'})
  );
}

export function listPostTags({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}): PostTagFacet[] {
  const filtered = filterPosts({tenantId, locale});
  const map = new Map<string, PostTagFacet>();

  filtered.forEach((post) => {
    (post.tags ?? []).forEach((tag) => {
      if (!tag) {
        return;
      }
      const slug = ensureSlug(tag, `tag-${map.size + 1}`);
      const current = map.get(slug);
      if (current) {
        current.count += 1;
      } else {
        map.set(slug, {
          label: tag,
          slug,
          count: 1
        });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label, locale === 'en' ? 'en' : 'vi', {sensitivity: 'base'})
  );
}

export function findPostCategoryBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}): PostCategoryFacet | undefined {
  if (!slug) {
    return undefined;
  }
  return listPostCategories({tenantId, locale}).find((category) => category.slug === slug);
}

export function findPostTagBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}): PostTagFacet | undefined {
  if (!slug) {
    return undefined;
  }
  return listPostTags({tenantId, locale}).find((tagItem) => tagItem.slug === slug);
}

export function findPostBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return posts.find(
    (post) => post.tenantId === tenantId && post.locale === locale && post.slug === slug
  );
}

export function findPostTranslations({
  tenantId,
  translationKey
}: {
  tenantId: string;
  translationKey: string;
}) {
  return posts.filter(
    (post) => post.tenantId === tenantId && post.translationKey === translationKey
  );
}

export function findRelatedPosts({
  tenantId,
  locale,
  postId,
  category,
  tags,
  limit = 3
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  postId: string;
  category?: string;
  tags?: string[];
  limit?: number;
}) {
  const tagSet = new Set((tags ?? []).map((tag) => tag.toLowerCase()));

  const filtered = filterPosts({tenantId, locale})
    .filter((post) => post.id !== postId)
    .filter((post) => {
      if (category && post.category === category) {
        return true;
      }
      if (!tagSet.size || !post.tags?.length) {
        return false;
      }
      return post.tags.some((tag) => tagSet.has(tag.toLowerCase()));
    });

  return filtered.slice(0, limit);
}
