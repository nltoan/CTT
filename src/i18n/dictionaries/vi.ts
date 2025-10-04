export default {
  navigation: {
    home: 'Trang chủ',
    news: 'Tin tức',
    about: 'Giới thiệu',
    contact: 'Liên hệ'
  },
  actions: {
    viewMore: 'Xem thêm',
    primaryCta: 'Tra cứu thí sinh',
    secondaryCta: 'Đăng ký ngay'
  },
  hero: {
    countdownLabel: 'Hạn đăng ký còn'
  },
  footer: {
    rights: 'Đã đăng ký bản quyền.'
  },
  notFound: {
    title: 'Không tìm thấy trang bạn yêu cầu',
    description:
      'Có thể đường dẫn đã bị thay đổi hoặc nội dung này không còn tồn tại. Bạn có thể quay lại trang chủ hoặc dùng tính năng tìm kiếm để tiếp tục khám phá.',
    homeCta: 'Về trang chủ',
    searchCta: 'Tìm kiếm nội dung'
  },
  error: {
    badge: 'Có lỗi xảy ra',
    title: 'Trang đang gặp sự cố',
    description:
      'Hệ thống tạm thời gặp lỗi nên không thể hiển thị nội dung. Bạn hãy thử tải lại hoặc liên hệ ban tổ chức để được hỗ trợ thêm.',
    retry: 'Thử lại',
    home: 'Về trang chủ',
    contact: 'Liên hệ hỗ trợ',
    eventIdLabel: 'Mã sự cố',
    eventIdHelp: 'Vui lòng cung cấp mã này khi liên hệ để chúng tôi kiểm tra nhanh hơn.',
    digestLabel: 'Mã tham chiếu: {digest}'
  }
} as const;
