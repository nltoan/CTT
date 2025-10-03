# CTT Platform

Nền tảng website sự kiện/cuộc thi âm nhạc đa tenant, đa ngôn ngữ xây dựng với Next.js (App Router) và cấu trúc CMS headless.

## Nội dung

- [Kiến trúc tổng thể](docs/architecture/overview.md)

## Ứng dụng frontend

Thư mục gốc hiện chứa skeleton ứng dụng Next.js với các tính năng:

- Định tuyến đa ngôn ngữ (vi/en) và đa tenant (sub-path `/t/[tenant]`).
- Page builder dựa trên block với các section Hero, CTA, slideshow, thư viện ảnh, lời chứng thực, bộ môn, timeline, giải thưởng, nhà tài trợ, nhân sự, rich content, liên hệ (kèm form), tin tức.
- API công khai giả lập (`/api/public/v1/*`) phục vụ dữ liệu tenant, page, post, event, gallery, slideshow.
- UI cơ bản bằng Tailwind CSS và các component layout (Header/Footer, Language switcher).
- Theming per-tenant thông qua biến CSS (màu sắc, font chữ) và danh bạ social link hiển thị ở footer.
- Trang danh sách Giám khảo/Cố vấn (`/people`) và Đối tác/Nhà tài trợ (`/partners`) cho từng tenant, dùng dữ liệu seed đa ngôn ngữ.
- Trang hồ sơ giám khảo/cố vấn (`/people/[slug]` và `/t/[tenant]/people/[slug]`) với metadata động, JSON-LD kiểu `Person`, video nhúng, thành tựu, timeline và khối nội dung linh hoạt, kèm đề xuất thành viên liên quan.
- Trang Tin tức hỗ trợ tìm kiếm theo từ khóa, lọc theo chủ đề/thẻ, phân trang và hiển thị bài viết liên quan ở trang chi tiết.
- Trang Sự kiện hỗ trợ lọc theo trạng thái (sắp diễn ra/đã diễn ra), danh mục, tìm kiếm từ khóa và cung cấp trang chi tiết giàu metadata + JSON-LD cho từng sự kiện.
- Trang Thư viện hiển thị danh sách bộ sưu tập ảnh/video với lọc danh mục/thẻ/từ khóa, phân trang và trang chi tiết dạng grid/masonry.
- API `POST /api/forms/:key` xử lý submit form với kiểm tra honeypot, rate-limit theo IP và lưu submission in-memory (mock `form_submissions`).
- Webhook `POST /api/revalidate` nhận payload từ CMS để revalidate trang theo tenant/locale.
- SEO tự động: metadata động theo trang/bài viết, alternates hreflang, JSON-LD (Organization, Navigation, Article, Event, ItemList), sitemap và robots.txt dựa trên dữ liệu seed.
- Banner cookie theo tenant (cấu hình từ `settings`) + script Analytics (GA/GTM/Meta Pixel) chỉ tải khi người dùng đồng ý.
- Toàn bộ API `GET /api/public/v1/*` trả về JSON kèm ETag + Cache-Control, TTL đọc từ `settings` để dễ dàng cache CDN.
- Các trang marketing (page builder), chi tiết tin tức/sự kiện và chuyên mục People/Partners đã khai báo `generateStaticParams` cùng chu kỳ `revalidate` mặc định để phục vụ ISR và revalidate on-demand.

### Thư viện block đã dựng sẵn

| Block | Mục đích | File |
| --- | --- | --- |
| `hero-countdown` | Hero có đếm ngược, CTA kép, nền ảnh/video | `components/blocks/HeroCountdown.tsx` |
| `cta-buttons` | Nhóm nút hành động nổi bật | `components/blocks/CtaButtons.tsx` |
| `disciplines-grid` | Lưới bộ môn dự thi | `components/blocks/DisciplinesGrid.tsx` |
| `slideshow` | Slideshow ảnh/video cơ bản, tự động chạy | `components/blocks/Slideshow.tsx` |
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
- `src/data/pages.ts` đã seed ví dụ: timeline dùng `variant: 'muted'`, people-grid dùng `variant: 'contrast'` + `theme` vàng, contact block sử dụng `variant: 'muted'` để tạo nền sáng.

### Form liên hệ mẫu

- Dữ liệu cấu hình form nằm trong `src/data/forms.ts` theo từng tenant/locale.
- Logic server-side xử lý submission nằm ở `src/lib/forms.ts` và API route `app/api/forms/[key]/route.ts` (rate-limit 5 lần/5 phút/IP, honeypot trường `website`).
- Component client `components/forms/ContactForm.tsx` dựng UI, hiển thị lỗi/success theo locale.
- Submission được lưu tạm thời tại `src/data/form-submissions.ts` (mock). Khi gắn Payload CMS, thay bằng collection `form_submissions` + webhooks gửi email.

### Dữ liệu seed mới

- `src/data/people.ts`: danh sách cố vấn/giám khảo theo tenant (đa ngôn ngữ) kèm thành tựu, timeline, nội dung block và video, dùng cho block People, trang `/people` và hồ sơ chi tiết.
- `src/data/sponsors.ts`: danh sách nhà tài trợ theo tier, phục vụ block Sponsors và trang `/partners`.
- `src/data/settings.ts`: cấu hình global và per-tenant (SEO mặc định, TTL revalidate, cookie banner, analytics).
- `src/data/posts.ts`: bổ sung thêm bài viết seed với metadata `category`, `tags`, phục vụ truy vấn tìm kiếm/phân trang và gợi ý bài liên quan.
- `src/data/galleries.ts`: gallery mẫu cho từng tenant/locale, dùng cho block ImageGallery, trang Thư viện và API công khai.

API public tương ứng:

- `GET /api/public/v1/people?tenant=&locale=&limit=`
- `GET /api/public/v1/people/:slug?tenant=&locale=` (trả thêm danh sách cố vấn liên quan)
- `GET /api/public/v1/sponsors?tenant=&locale=`
- `GET /api/public/v1/settings?tenant=&locale=`
- `GET /api/public/v1/posts?tenant=&locale=&page=&limit=&category=&tag=&q=` (kèm `meta` tổng số bài viết, tổng trang, bộ lọc đang áp dụng)
- `GET /api/public/v1/posts/:slug?tenant=&locale=` (trả thêm `related` gồm các bài viết liên quan)
- `GET /api/public/v1/events?tenant=&locale=&page=&limit=&status=&category=&q=` (trả về `meta` phân trang và danh sách sự kiện đã lọc)
- `GET /api/public/v1/events/:slug?tenant=&locale=` (chi tiết sự kiện cùng block nội dung, metadata)
- `GET /api/public/v1/galleries?tenant=&locale=&page=&limit=&category=&tag=&q=&sort=` (danh sách gallery + meta/phân trang và filters)
- `GET /api/public/v1/galleries/:slug?tenant=&locale=` (chi tiết gallery)

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
