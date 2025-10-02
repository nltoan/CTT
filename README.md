# CTT Platform

Nền tảng website sự kiện/cuộc thi âm nhạc đa tenant, đa ngôn ngữ xây dựng với Next.js (App Router) và cấu trúc CMS headless.

## Nội dung

- [Kiến trúc tổng thể](docs/architecture/overview.md)

## Ứng dụng frontend

Thư mục gốc hiện chứa skeleton ứng dụng Next.js với các tính năng:

- Định tuyến đa ngôn ngữ (vi/en) và đa tenant (sub-path `/t/[tenant]`).
- Page builder dựa trên block với các section Hero, bộ môn, timeline, giải thưởng, nhà tài trợ, nhân sự, liên hệ, tin tức.
- API công khai giả lập (`/api/public/v1/*`) phục vụ dữ liệu tenant, page, post, event, gallery, slideshow.
- UI cơ bản bằng Tailwind CSS và các component layout (Header/Footer, Language switcher).

### Chạy cục bộ

```bash
npm install
npm run dev
```

> Lưu ý: môi trường sandbox của đề bài có thể chặn npm registry. Nếu gặp lỗi `403 Forbidden`, hãy cài đặt dependencies thủ công ở môi trường của bạn trước khi chạy.

Ứng dụng mặc định build statically, hỗ trợ ISR/on-demand revalidate sẽ được bổ sung khi kết nối Payload CMS.

## Kế hoạch tiếp theo

- Định nghĩa schema Payload CMS tương ứng với block và collections.
- Kết nối frontend với API Payload thông qua fetcher, thay thế dữ liệu mock.
- Bổ sung kiểm thử (unit + e2e), đo Lighthouse, và tối ưu hiệu năng/A11y.
