# Kiến trúc tổng thể

## Tổng quan

Tài liệu này mô tả kiến trúc đề xuất cho nền tảng website sự kiện/cuộc thi âm nhạc đa tenant, đa ngôn ngữ được xây dựng trên Next.js (App Router) và Payload CMS. Mục tiêu là cung cấp một hệ thống có khả năng mở rộng, dễ quản trị, hiệu năng cao (Lighthouse ≥ 90) và đáp ứng tiêu chuẩn truy cập WCAG 2.1 AA.

## Thành phần chính

### Frontend (Next.js)
- **Framework**: Next.js 14 với App Router, TypeScript, React Server Components.
- **Styling**: Tailwind CSS kết hợp shadcn/ui (Radix UI) để tái sử dụng component nhất quán.
- **Quốc tế hóa**: `next-intl` cho i18n runtime, hỗ trợ ISR và middleware. Locale mặc định: `vi`, phụ: `en`.
- **Triển khai**: Vercel. Dùng ISR (Incremental Static Regeneration) + On-demand revalidation qua webhook.
- **Các thư viện chính**:
  - `next/image` với loader custom tới S3/R2 + CDN.
  - `@tanstack/react-query` cho dữ liệu client cần revalidate real-time (ví dụ countdown).
  - `@vercel/analytics` + `@vercel/speed-insights`.
  - `class-variance-authority`, `tailwind-merge`.

### Backend CMS (Payload)
- **Runtime**: Node.js 20.
- **Database**: PostgreSQL (Neon/Supabase). ORM nội bộ của Payload.
- **Storage**: S3 compatible (Cloudflare R2) cho media.
- **Triển khai**: Render/Fly.io/CapRover, chạy độc lập với frontend.
- **Chức năng chính**: RBAC đa tenant, i18n, block builder, webhook revalidate, audit log.

### Công cụ hỗ trợ
- **Giám sát**: Sentry, Logtail, Vercel Observability, Healthchecks.
- **CI/CD**: GitHub Actions cho lint/test/build, chạy Lighthouse CI.
- **Bảo mật**: rate limiting (express-rate-limit), Helmet (CSP), 2FA qua Payload plugin.

## Kiến trúc triển khai

```mermaid
deploymentDiagram
    node cms {
        component PayloadCMS
        component Postgres
        component S3
    }
    node vercel {
        component NextJS
    }
    PayloadCMS --> Postgres
    PayloadCMS --> S3
    NextJS --> PayloadCMS: API Fetch (public)
    PayloadCMS --> NextJS: Webhook Revalidate
```

## Định tuyến & Đa tenant

### Cơ chế nhận diện tenant
- Dùng Next.js Middleware (`src/middleware.ts`) để đọc `Host` và đường dẫn.
- Ưu tiên subdomain `tenant.domain.com`; fallback `/t/{tenant}`.
- Nếu không có tenant cụ thể, dùng `defaultTenant` từ `settings`.
- Middleware inject `x-tenant` header khi forward request đến route handler/page server component.

### Context tenant
- Tạo helper `getTenantFromRequest()` trong `lib/tenant.ts` để đọc từ header, query, hoặc cookies.
- Mọi API fetch từ frontend đến CMS phải kèm `tenant` query.
- Access control trong Payload: filter `tenantId` bằng hook `beforeRead` và `access`.

## Cấu trúc thư mục Next.js

```
frontend/
├── app/
│   ├── (public)/
│   │   ├── [[...slug]]/page.tsx
│   │   ├── t/
│   │   │   └── [tenant]/[[...slug]]/page.tsx
│   │   ├── news/page.tsx
│   │   └── news/[slug]/page.tsx
│   ├── api/
│   │   ├── revalidate/route.ts
│   │   └── forms/[key]/route.ts
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── blocks/
│   ├── shared/
│   └── ui/
├── lib/
│   ├── cms.ts
│   ├── tenant.ts
│   ├── seo.ts
│   ├── i18n.ts
│   └── analytics.ts
├── styles/
│   ├── globals.css
│   └── theme.css
├── middleware.ts
└── tailwind.config.ts
```

## Payload CMS Schema

### Collections chính
1. **tenants**
   - Fields: `name`, `slug`, `domain`, `pathPrefix`, `status`, `theme` (color tokens, typography, assets), `logos`, `social`, `scripts`, `settingsOverride`.
   - Access: chỉ Owner/Global Admin.
2. **media**
   - Upload S3, trường `alt_vi`, `alt_en`, `focalPoint`, `tenant`.
3. **pages**
   - Fields: `title`, `slug`, `status`, `publishAt`, `seo`, `blocks` (Block builder), `translations` (VI/EN), `tenant`.
4. **navigations**
   - Field `key`, `items` (tree), `tenant`, i18n.
5. **posts**
   - `title`, `slug`, `excerpt`, `cover`, `body` (RichText/MDX), `category`, `tags`, `author`, `seo`, `tenant`, `translations`.
6. **events**
   - `title`, `startDate`, `endDate`, `location`, `timelineFlag`, `content`, `translations`, `tenant`.
7. **people**
   - `name`, `title`, `bio`, `photo`, `translations`, `tenant`, `order`.
8. **sponsors**
   - `name`, `logo`, `tier`, `url`, `tenant`, `order`.
9. **slideshows**, **galleries**, **forms**, **form_submissions**.
10. **settings** (Global + per tenant override).

### Quan hệ & RBAC
- Bảng trung gian `tenantUsers` (Payload `relation` field) ánh xạ `user` ↔ `tenant` với vai trò.
- Hook `access` lọc theo `tenantUsers`. Ví dụ:
  ```ts
  access: ({ req }) => {
    const tenantIds = req.user?.tenants?.map((t) => t.tenant.id) ?? [];
    if (req.user?.role === 'global-admin') return true;
    return { tenant: { in: tenantIds } };
  }
  ```

## Block Builder

Mỗi block trong Payload mapping sang TypeScript union `Block`. Ví dụ `hero-countdown`:
```ts
export type HeroCountdownBlock = {
  type: 'hero-countdown';
  heading: TranslatedText;
  subheading?: TranslatedText;
  deadline?: string;
  ctas?: CTA[];
  background?: MediaRef;
  overlay?: boolean;
};
```
Renderer trong Next.js dùng dynamic import:
```tsx
const BLOCK_COMPONENTS: Record<Block['type'], React.ComponentType<any>> = {
  'hero-countdown': HeroCountdown,
  'disciplines-grid': DisciplinesGrid,
  // ...
};

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block.id ?? block._id} {...block} />;
      })}
    </>
  );
}
```

Các block UI đã được scaffold trong frontend gồm: `hero-countdown`, `cta-buttons`, `disciplines-grid`, `slideshow`, `timeline`,
`rich-content`, `image-gallery`, `testimonials`, `prizes`, `sponsors-grid`, `people-grid`, `event-list`, `post-list`, `contact`.

Layout chung (`components/layout/PageShell.tsx`) tiêm CSS variables theo cấu hình `tenant.theme` (màu chủ đạo, secondary, accent, font display/body), nhờ vậy mỗi tenant có thể thay đổi brand và typography mà không cần rebuild.

## API Public Layer

CMS cung cấp Endpoint public (REST) dạng `/api/public/v1/...` với caching:
- `GET /tenants/:slug`
- `GET /pages?tenant=&slug=`
- `GET /posts`, `GET /posts/:slug`
- `GET /events`
- `GET /people`, `GET /sponsors`
- `GET /navigations`
- `GET /galleries/:id`, `GET /slideshows/:id`

Áp dụng `Cache-Control: s-maxage=300, stale-while-revalidate=86400` và ETag. Bảo đảm filter theo `tenant`.

## ISR & Webhook

Payload webhook (mỗi collection) gọi `POST https://frontend.vercel.app/api/revalidate` với payload:
```json
{
  "tenant": "cimfc",
  "collection": "pages",
  "id": "64f...",
  "slug": "home"
}
```
Payload nên gửi kèm `secret` (khớp `REVALIDATE_SECRET`) và có thể mở rộng `paths` nếu muốn revalidate tùy chỉnh.
`app/api/revalidate/route.ts` kiểm tra secret, chuẩn hóa `slug` theo từng tenant/locale, rồi gọi `revalidatePath` cho các đường dẫn liên quan (ví dụ `/vi`, `/en`, `/vi/news`, `/en/news/[slug]`, các trang cần re-render khi navigation/settings thay đổi).

## i18n & SEO

- Lưu `translations` cho mỗi field text trong CMS (`vi`, `en`).
- Frontend dùng `next-intl` với file messages UI + dynamic content.
- Render `<link rel="alternate" hrefLang="vi">` & `en`.
- Sitemap generator per tenant: `app/sitemap.ts` lấy data `pages`, `posts`, `events`.
- Structured data JSON-LD: `Organization`, `Breadcrumb`, `Article`, `Event`.

## Hiệu năng & A11y

- Sử dụng Next.js Image Optimization + lazy loading gallery.
- Prefetch critical fonts (variable font) với `font-display: swap`.
- Skeleton & shimmer cho slideshow, countdown.
- A11y: focus ring, skip link, aria cho carousel, alt text bắt buộc trong CMS.
- Lighthouse CI chạy trong GitHub Actions, fail nếu <90.

## Form & Chống spam

- Endpoint `POST /api/forms/:key` xử lý bởi `app/api/forms/[key]/route.ts`.
- Cấu hình form lưu tại `src/data/forms.ts` theo tenant/locale; helper `src/lib/forms.ts` lấy view, validate dữ liệu và lưu submission vào `src/data/form-submissions.ts` (mock) trước khi tích hợp Payload.
- Honeypot field mặc định `website`, có thể đổi từng form. Server kiểm tra và trả lỗi nếu bot điền.
- Rate limit in-memory: tối đa 5 submit/5 phút/IP/form. Header `Retry-After` được set khi bị giới hạn.
- Khi kết nối Payload CMS, thay `addSubmission` bằng API ghi vào collection `form_submissions` + trigger email (Resend/SMTP) + automation Zapier nếu cần.

## Kiểm thử

- Unit: `tenant.ts`, `cms.ts`, block renderer, i18n switcher.
- Integration: `fetchCMS` hitting mocked API.
- E2E: Playwright script dựng tenant mới → verify public site.
- Performance: Lighthouse CI.

## Lộ trình triển khai

1. Khởi tạo monorepo (Turbo) chứa `apps/frontend`, `apps/cms`, `packages/ui`.
2. Thiết lập Payload schema + RBAC + seed data.
3. Xây API public layer (custom express router) + cache.
4. Next.js: cấu hình i18n, middleware tenant, layout, header/footer.
5. Implement block components lần lượt.
6. Thiết lập webhook, ISR.
7. Kiểm thử + tối ưu Lighthouse + A11y.
8. Tài liệu hóa & bàn giao.

