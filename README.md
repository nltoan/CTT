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
- API `POST /api/forms/:key` xử lý submit form với kiểm tra honeypot, rate-limit theo IP và lưu submission in-memory (mock `form_submissions`).
- Webhook `POST /api/revalidate` nhận payload từ CMS để revalidate trang theo tenant/locale.

### Thư viện block đã dựng sẵn

| Block | Mục đích | File |
| --- | --- | --- |
| `hero-countdown` | Hero có đếm ngược, CTA kép, nền ảnh/video | `components/blocks/HeroCountdown.tsx` |
| `cta-buttons` | Nhóm nút hành động nổi bật | `components/blocks/CtaButtons.tsx` |
| `disciplines-grid` | Lưới bộ môn dự thi | `components/blocks/DisciplinesGrid.tsx` |
| `slideshow` | Slideshow ảnh/video cơ bản, tự động chạy | `components/blocks/Slideshow.tsx` |
| `timeline` | Mốc thời gian / lịch trình | `components/blocks/Timeline.tsx` |
| `rich-content` | Nội dung tự do (HTML render từ CMS) | `components/blocks/RichContent.tsx` |
| `image-gallery` | Gallery ảnh dạng grid/masonry | `components/blocks/ImageGallery.tsx` |
| `testimonials` | Lời chứng thực từ giám khảo/thí sinh | `components/blocks/Testimonials.tsx` |
| `prizes` | Thông tin giải thưởng | `components/blocks/Prizes.tsx` |
| `sponsors-grid` | Logo nhà tài trợ phân tier | `components/blocks/SponsorsGrid.tsx` |
| `people-grid` | Ban cố vấn & giám khảo | `components/blocks/PeopleGrid.tsx` |
| `post-list` | Tin tức mới nhất | `components/blocks/PostList.tsx` |
| `event-list` | Danh sách sự kiện/audition sắp diễn ra | `components/blocks/EventList.tsx` |
| `contact` | Thông tin liên hệ + bản đồ nhúng + form gửi yêu cầu | `components/blocks/ContactBlock.tsx` |

### Form liên hệ mẫu

- Dữ liệu cấu hình form nằm trong `src/data/forms.ts` theo từng tenant/locale.
- Logic server-side xử lý submission nằm ở `src/lib/forms.ts` và API route `app/api/forms/[key]/route.ts` (rate-limit 5 lần/5 phút/IP, honeypot trường `website`).
- Component client `components/forms/ContactForm.tsx` dựng UI, hiển thị lỗi/success theo locale.
- Submission được lưu tạm thời tại `src/data/form-submissions.ts` (mock). Khi gắn Payload CMS, thay bằng collection `form_submissions` + webhooks gửi email.

### Dữ liệu seed mới

- `src/data/people.ts`: danh sách cố vấn/giám khảo theo tenant (đa ngôn ngữ), dùng cho block People và trang `/people`.
- `src/data/sponsors.ts`: danh sách nhà tài trợ theo tier, phục vụ block Sponsors và trang `/partners`.

API public tương ứng:

- `GET /api/public/v1/people?tenant=&locale=&limit=`
- `GET /api/public/v1/sponsors?tenant=&locale=`

### Chạy cục bộ

```bash
npm install
npm run dev
```

> Lưu ý: môi trường sandbox của đề bài có thể chặn npm registry. Nếu gặp lỗi `403 Forbidden`, hãy cài đặt dependencies thủ công ở môi trường của bạn trước khi chạy.

Ứng dụng mặc định build statically, hỗ trợ ISR/on-demand revalidate thông qua route `app/api/revalidate/route.ts` (cần set biến môi trường `REVALIDATE_SECRET`, mặc định `dev-secret`).

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
