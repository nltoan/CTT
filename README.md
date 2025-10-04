# CTT Platform

Nền tảng website sự kiện/cuộc thi âm nhạc đa tenant, đa ngôn ngữ xây dựng với Next.js (App Router) và cấu trúc CMS headless.

## Nội dung

- [Kiến trúc tổng thể](docs/architecture/overview.md)

## Ứng dụng frontend

## Backend CMS (Payload)

Thư mục `cms/` chứa cấu hình Payload CMS đầy đủ:

- `payload.config.ts` khai báo toàn bộ collection/globals, kết nối PostgreSQL và plugin lưu trữ S3/R2.
- Thư mục `collections/` gồm schema cho tenants, pages, posts, events, people, sponsors, galleries, forms, submissions, navigation, slideshow, tenant-users... đúng với tài liệu kiến trúc.
- `fields/` tái sử dụng cấu trúc block, SEO, link, slug, translation key để trùng khớp với union TypeScript bên frontend.
- `access/tenant.ts` cài đặt RBAC đa tenant (super admin, owner/admin/editor/author/media-manager/viewer) và scope dữ liệu theo tenant.
- `hooks/revalidate.ts` gửi webhook về frontend `/api/revalidate` khi có thay đổi nội dung.

### Chạy CMS cục bộ

```bash
# Yêu cầu: PostgreSQL + bucket S3/R2 sẵn có
cp .env.example .env             # tự tạo biến môi trường cần thiết
npm install
npm run cms:dev                  # chạy Payload ở http://localhost:3001
```

Các biến môi trường chính:

| Biến | Ý nghĩa |
| --- | --- |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL |
| `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT` | Cấu hình lưu trữ media trên S3/R2 |
| `PAYLOAD_PUBLIC_SERVER_URL` | URL public của CMS để sinh link admin/webhook |
| `CMS_CORS`, `CMS_CSRF` | Danh sách domain frontend được phép gọi API Payload |
| `REVALIDATE_ENDPOINT` | Đường dẫn webhook tới frontend (ví dụ `https://frontend.vercel.app/api/revalidate`) |
| `REVALIDATE_SECRET` | Khoá bí mật khớp với frontend để kích hoạt ISR |

Payload sẽ sinh TypeScript types vào `payload-types.ts` khi build (`npm run cms:build`).


Thư mục gốc hiện chứa skeleton ứng dụng Next.js với các tính năng:

- Định tuyến đa ngôn ngữ (vi/en) và đa tenant (sub-path `/t/[tenant]`).
- Page builder dựa trên block với các section Hero, CTA, slideshow, thư viện ảnh, lời chứng thực, bộ môn, timeline, giải thưởng, nhà tài trợ, nhân sự, rich content, liên hệ (kèm form), tin tức.
- API công khai giả lập (`/api/public/v1/*`) phục vụ dữ liệu tenant, page, post, event, gallery, slideshow.
- UI bằng Tailwind CSS với header sticky (desktop navigation + mobile drawer, skip-link truy cập nhanh) và footer đa tenant có chuyển ngôn ngữ.
- Theming per-tenant thông qua biến CSS (màu sắc, font chữ) và danh bạ social link hiển thị ở footer.
- Trang danh sách Giám khảo/Cố vấn (`/people`) và Đối tác/Nhà tài trợ (`/partners`) cho từng tenant, dùng dữ liệu seed đa ngôn ngữ.
- Trang hồ sơ giám khảo/cố vấn (`/people/[slug]` và `/t/[tenant]/people/[slug]`) với metadata động, JSON-LD kiểu `Person`, video nhúng, thành tựu, timeline và khối nội dung linh hoạt, kèm đề xuất thành viên liên quan.
- Trang Tin tức hỗ trợ tìm kiếm theo từ khóa, lọc theo chủ đề/thẻ, phân trang và hiển thị bài viết liên quan ở trang chi tiết.
- Trang chuyên mục Tin tức (`/news/category/[slug]`) và trang thẻ (`/news/tag/[slug]`) với URL thân thiện, SEO metadata riêng và giữ được kết hợp bộ lọc phụ.
- Trang Sự kiện hỗ trợ lọc theo trạng thái (sắp diễn ra/đã diễn ra), danh mục, tìm kiếm từ khóa và cung cấp trang chi tiết giàu metadata + JSON-LD cho từng sự kiện.
- Trang Bộ môn/Bài thi (`/disciplines`) với lọc danh mục/trình độ/từ khóa, liên kết tới trang chi tiết chứa yêu cầu, lịch trình, repertoires, JSON-LD `Course` và khối nội dung tùy biến.
- Trang Thư viện hiển thị danh sách bộ sưu tập ảnh/video với lọc danh mục/thẻ/từ khóa, phân trang và trang chi tiết dạng grid/masonry.
- Trang Tìm kiếm tổng hợp (`/search`) thu thập kết quả từ tin tức, sự kiện, giám khảo/cố vấn và thư viện theo tenant hiện hành.
- RSS feed cho Tin tức và lịch sự kiện định dạng ICS theo từng tenant/locale (ví dụ `/vi/news/feed.xml`, `/vi/events/calendar.ics`, `/en/t/cimfc/news/feed.xml`), được surfacing tại footer để người dùng/đối tác dễ đăng ký.
- API `POST /api/forms/:key` xử lý submit form với kiểm tra honeypot, rate-limit theo IP và lưu submission in-memory (mock `form_submissions`).
- Webhook `POST /api/revalidate` nhận payload từ CMS để revalidate trang theo tenant/locale.
- SEO tự động: metadata động theo trang/bài viết, alternates hreflang, JSON-LD (Organization, Navigation, Article, Event, ItemList), sitemap và robots.txt dựa trên dữ liệu seed.
- Breadcrumb đa ngôn ngữ theo tenant cho các trang chi tiết (Tin tức, Sự kiện, Bộ môn, Thư viện, Hồ sơ) với UI component riêng và JSON-LD `BreadcrumbList` tương ứng.
- Banner cookie theo tenant (cấu hình từ `settings`) + script Analytics (GA/GTM/Meta Pixel) chỉ tải khi người dùng đồng ý.
- Toàn bộ API `GET /api/public/v1/*` trả về JSON kèm ETag + Cache-Control, TTL đọc từ `settings` để dễ dàng cache CDN.
- Rate limit áp dụng cho mọi API/Feed (120 request/phút/IP cho public, 5/phút/IP cho form submission) thông qua helper `src/lib/rate-limit.ts`, trả về header `X-RateLimit-*` kể cả khi gặp lỗi.
- Các trang marketing (page builder), chi tiết tin tức/sự kiện và chuyên mục People/Partners đã khai báo `generateStaticParams` cùng chu kỳ `revalidate` mặc định để phục vụ ISR và revalidate on-demand.
- `GET /api/preview?secret=...&locale=vi&tenant=main&slug=news/slug` bật chế độ preview (draft mode) và chuyển hướng về đúng trang; `GET /api/preview/exit` tắt preview. Sử dụng `PREVIEW_SECRET` để đồng bộ với Payload CMS.
- Trang 404 tuỳ biến theo locale/tenant hiển thị gợi ý quay về trang chủ hoặc truy cập trang tìm kiếm.

### Thư viện block đã dựng sẵn

| Block | Mục đích | File |
| --- | --- | --- |
| `hero-countdown` | Hero có đếm ngược, CTA kép, nền ảnh/video | `components/blocks/HeroCountdown.tsx` |
| `cta-buttons` | Nhóm nút hành động nổi bật | `components/blocks/CtaButtons.tsx` |
| `disciplines-grid` | Lưới bộ môn dự thi | `components/blocks/DisciplinesGrid.tsx` |
| `slideshow` | Slideshow ảnh/video (có thể nạp dữ liệu động từ collection `slideshows` qua `source`) | `components/blocks/Slideshow.tsx` |
| `timeline` | Mốc thời gian / lịch trình | `components/blocks/Timeline.tsx` |
| `rich-content` | Nội dung tự do (HTML render từ CMS) | `components/blocks/RichContent.tsx` |
| `image-gallery` | Gallery ảnh dạng grid/masonry, có thể nạp dữ liệu động theo slug gallery | `components/blocks/ImageGallery.tsx` |
| `testimonials` | Lời chứng thực từ giám khảo/thí sinh | `components/blocks/Testimonials.tsx` |
| `prizes` | Thông tin giải thưởng | `components/blocks/Prizes.tsx` |
| `sponsors-grid` | Logo nhà tài trợ phân tier | `components/blocks/SponsorsGrid.tsx` |
| `people-grid` | Ban cố vấn & giám khảo (có CTA tới hồ sơ chi tiết) | `components/blocks/PeopleGrid.tsx` |
| `post-list` | Tin tức mới nhất | `components/blocks/PostList.tsx` |
| `event-list` | Danh sách sự kiện/audition sắp diễn ra | `components/blocks/EventList.tsx` |
| `contact` | Thông tin liên hệ + bản đồ nhúng + form gửi yêu cầu | `components/blocks/ContactBlock.tsx` |

### Tuỳ chỉnh trình bày block

- Mỗi block hỗ trợ thuộc tính `style` (khai báo tại `src/types/blocks.ts`) để điều khiển container, khoảng cách, chủ đề.
- `components/blocks/BlockSection.tsx` là wrapper chuẩn áp dụng `style` cho từng block (container width, padding, variant, màu nền, override CSS variable, divider, ẩn/hiện theo breakpoint...).
- Các tuỳ chọn chính:
  - `style.container`: `content` (mặc định), `wide`, `narrow`, `full`, `edge`.
  - `style.spacing`: `padding` (`none` → `lg`) cộng thêm `top`/`bottom` để tạo margin tuỳ ý giữa các section.
  - `style.variant`: `default`, `muted`, `contrast`, `highlight`, `accent`.
  - `style.background`: nhận `color` hoặc `image` (kèm `overlay` sáng/tối) để tuỳ biến nền từng block.
  - `style.theme`: override cục bộ các biến `--color-primary|secondary|accent|background|text`.
- `style.align` + `style.divider` điều chỉnh canh lề tiêu đề/CTA và thêm đường phân cách.
- `style.visibility`: ẩn block theo `mobile`/`tablet`/`desktop`; `PageRenderer` sẽ loại bỏ block nếu cả ba cùng `false`.
- Block `slideshow` có thể dùng `source: {type: 'slideshow', id, limit}` để tự động lấy slide từ API/seed thay vì nhập tay; trường `slides` trong block đóng vai trò fallback khi chưa cấu hình dữ liệu.
- `src/data/pages.ts` đã seed ví dụ: timeline dùng `variant: 'muted'`, people-grid dùng `variant: 'contrast'` + `theme` vàng, contact block sử dụng `variant: 'muted'` để tạo nền sáng.

### Form liên hệ mẫu

- Dữ liệu cấu hình form nằm trong `src/data/forms.ts` theo từng tenant/locale.
- Logic server-side xử lý submission nằm ở `src/lib/forms.ts` và API route `app/api/forms/[key]/route.ts` (rate-limit 5 lần/5 phút/IP, honeypot trường `website`).
- Component client `components/forms/ContactForm.tsx` dựng UI, hiển thị lỗi/success theo locale.
- Submission được lưu tạm thời tại `src/data/form-submissions.ts` (mock). Khi gắn Payload CMS, thay bằng collection `form_submissions` + webhooks gửi email.

### Dữ liệu seed mới

- `src/data/people.ts`: danh sách cố vấn/giám khảo theo tenant (đa ngôn ngữ) kèm thành tựu, timeline, nội dung block và video, dùng cho block People, trang `/people` và hồ sơ chi tiết.
- `src/data/disciplines.ts`: cấu hình bộ môn/discipline với repertoire, yêu cầu, lịch trình, jury và block nội dung phục vụ trang `/disciplines` cùng các API liên quan.
- `src/data/sponsors.ts`: danh sách nhà tài trợ theo tier, phục vụ block Sponsors và trang `/partners`.
- `src/data/settings.ts`: cấu hình global và per-tenant (SEO mặc định, TTL revalidate, cookie banner, analytics).
- `src/data/posts.ts`: bổ sung thêm bài viết seed với metadata `category`, `tags`, phục vụ truy vấn tìm kiếm/phân trang và gợi ý bài liên quan.
- `src/data/galleries.ts`: gallery mẫu cho từng tenant/locale, dùng cho block ImageGallery, trang Thư viện và API công khai.
- `src/data/slideshows.ts`: danh sách slideshow per-tenant với options autoplay/interval, phục vụ block slideshow và API public.

API public tương ứng:

- `GET /api/public/v1/people?tenant=&locale=&limit=`
- `GET /api/public/v1/people/:slug?tenant=&locale=` (trả thêm danh sách cố vấn liên quan)
- `GET /api/public/v1/sponsors?tenant=&locale=`
- `GET /api/public/v1/settings?tenant=&locale=`
- `GET /api/public/v1/posts?tenant=&locale=&page=&limit=&category=&tag=&q=` (kèm `meta` tổng số bài viết, tổng trang, bộ lọc đang áp dụng)
- `GET /api/public/v1/posts/:slug?tenant=&locale=` (trả thêm `related` gồm các bài viết liên quan)
- `GET /api/public/v1/events?tenant=&locale=&page=&limit=&status=&category=&q=` (trả về `meta` phân trang và danh sách sự kiện đã lọc)
- `GET /api/public/v1/events/:slug?tenant=&locale=` (chi tiết sự kiện cùng block nội dung, metadata)
- `GET /api/public/v1/disciplines?tenant=&locale=&page=&limit=&category=&level=&q=`
- `GET /api/public/v1/disciplines/:slug?tenant=&locale=`
- `GET /api/public/v1/galleries?tenant=&locale=&page=&limit=&category=&tag=&q=&sort=` (danh sách gallery + meta/phân trang, `filters.categories[]`/`filters.tags[]` trả về `{slug,label,count}` để render facet hoặc build URL category/tag)
- `GET /api/public/v1/galleries/:slug?tenant=&locale=` (chi tiết gallery)
- `GET /api/public/v1/search?tenant=&locale=&q=&type=&limit=` (kết quả tìm kiếm tổng hợp theo danh mục nội dung)
- `GET /api/public/v1/slideshows?tenant=&locale=&limit=` (danh sách slideshow theo tenant, trả về options & tổng số)
- `GET /api/public/v1/slideshows/:id?tenant=&locale=&limit=` (chi tiết slideshow, hỗ trợ cắt giảm số slide trả về)

Ngoài JSON API, frontend còn cung cấp feed/download:

- `GET /{locale}/[t/{tenant}/]news/feed.xml` → RSS 2.0 Tin tức theo tenant/locale.
- `GET /{locale}/[t/{tenant}/]events/calendar.ics` → Lịch sự kiện (upcoming) dạng iCalendar.

### Chạy cục bộ

```bash
npm install
npm run dev
```

> Lưu ý: môi trường sandbox của đề bài có thể chặn npm registry. Nếu gặp lỗi `403 Forbidden`, hãy cài đặt dependencies thủ công ở môi trường của bạn trước khi chạy.

Ứng dụng mặc định build statically, hỗ trợ ISR/on-demand revalidate thông qua route `app/api/revalidate/route.ts` (cần set biến môi trường `REVALIDATE_SECRET`, mặc định `dev-secret`).

#### Kiểm thử đơn vị

```bash
npm test
```

Bộ test dùng [Vitest](https://vitest.dev/) + Testing Library để kiểm tra các hàm quan trọng:

- `@lib/tenant` – xác thực locale, nhận diện tenant qua host/params và sinh biến CSS theo theme.
- `components/PageRenderer` – đảm bảo loại bỏ block bị ẩn toàn bộ và render block tin tức đúng với dữ liệu trả về.
- `components/layout/LanguageSwitcher` – tạo đường dẫn chuyển ngôn ngữ chính xác cho mọi tuyến.

### Biến môi trường quan trọng

- `NEXT_PUBLIC_SITE_URL` (hoặc `SITE_URL`): URL gốc dùng để sinh canonical URL, sitemap, robots và metadata Open Graph. Nếu không đặt, giá trị mặc định là `https://ctt.example.com`.
- `PREVIEW_SECRET`: khóa bí mật cho route `/api/preview` (đồng bộ với Payload CMS để bật preview/draft mode).
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`: cung cấp DSN cho Sentry (backend/frontend). Nếu bỏ trống, việc khởi tạo sẽ được bỏ qua.
- `SENTRY_ENABLED` / `NEXT_PUBLIC_SENTRY_ENABLED`: cho phép bật thu thập log ở môi trường không phải production (mặc định chỉ bật ở production khi có DSN).
- `SENTRY_TRACES_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE`: tuỳ chỉnh tần suất thu thập trace và session replay.

### Giám sát & logging

- Frontend tích hợp `@sentry/nextjs` qua các file `sentry.client/server/edge.config.ts`. Khi khai báo biến môi trường phù hợp, sự cố runtime sẽ tự động gửi tới Sentry và hiển thị mã tham chiếu ở giao diện lỗi (`app/[locale]/(public)/error.tsx`).
- CMS dùng `@sentry/node` trong `cms/monitoring/sentry.ts`; `payload.config.ts` tự động đăng ký middleware theo DSN để log request và lỗi admin. Bạn có thể mở rộng bằng Logtail/Datadog bằng cách thêm middleware riêng.
- Điều chỉnh mức sampling thông qua các biến môi trường ở trên. Mặc định trace chỉ bật ở production, replay tắt trừ khi bạn cấu hình.

## Bạn cần làm gì tiếp theo?

1. **Cài đặt và chạy thử:** Clone repo về máy bạn, chạy `npm install && npm run dev` (ngoài môi trường sandbox) để kiểm tra luồng đa tenant, đa ngôn ngữ.
2. **Điều chỉnh nội dung mock:** Toàn bộ dữ liệu đang nằm trong `src/data/*`. Bạn có thể chỉnh sửa trực tiếp để xem block mới hoạt động ra sao trước khi tích hợp CMS.
3. **Triển khai Payload CMS:**
   - Dùng schema đã mô tả trong `docs/architecture/overview.md` làm cơ sở tạo collection.
   - Map các collection sang API REST/GraphQL. Frontend có thể gọi qua fetcher tại `src/lib/pages.ts`.
   - Cấu hình webhook của Payload gọi `/api/revalidate` sau khi publish (payload gồm `secret`, `tenant`, `collection`, `slug`).
   - Map collection `forms` và `form_submissions` để thay thế dữ liệu mock, đồng thời trỏ endpoint `/api/forms/:key` đến Payload để lưu thực tế.
4. **Đa tenant thực tế:** Bật subdomain mapping trong Payload (field `domain`) và cập nhật middleware nếu cần custom logic (ví dụ map `tenantId` theo subdomain).
5. **Triển khai production:** Frontend deploy lên Vercel, CMS trên nền tảng Node (Render/Fly). Đảm bảo cấu hình biến môi trường (database, S3/R2, webhook secret).
6. **Kiểm thử & tối ưu:** Sau khi dữ liệu thật, chạy Lighthouse, kiểm thử Playwright, và bổ sung log/monitoring (Sentry, Logtail).

## Kế hoạch tiếp theo

- Định nghĩa schema Payload CMS tương ứng với block và collections.
- Kết nối frontend với API Payload thông qua fetcher, thay thế dữ liệu mock.
- Bổ sung kiểm thử (unit + e2e), đo Lighthouse, và tối ưu hiệu năng/A11y.
