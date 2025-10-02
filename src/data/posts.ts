import type {Post} from '@types/cms';

const mainPosts: Post[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `post-1-${locale}`,
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
    tenantId: 'tenant-main',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4'
  },
  {
    id: `post-2-${locale}`,
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
    tenantId: 'tenant-main',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81a'
  }
]);

const classicPosts: Post[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `classic-post-1-${locale}`,
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
    tenantId: 'tenant-classic',
    locale,
    coverImage: 'https://images.unsplash.com/photo-1521336751524-4dc5b63c409d'
  }
]);

export const posts: Post[] = [...mainPosts, ...classicPosts];

export function listPostsByTenant({
  tenantId,
  locale,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
}) {
  return posts
    .filter((post) => post.tenantId === tenantId && post.locale === locale)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, limit ?? posts.length);
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
