export const slideshows = [
  {
    id: 'hero-slideshow',
    tenantId: 'tenant-main',
    locale: 'vi' as const,
    name: 'Hero slides',
    slides: [
      {
        id: 'slide-1',
        title: 'Sân khấu đẳng cấp',
        image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc',
        caption: 'Trải nghiệm sân khấu tiêu chuẩn quốc tế.'
      },
      {
        id: 'slide-2',
        title: 'Giao lưu quốc tế',
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
        caption: 'Kết nối cộng đồng âm nhạc toàn cầu.'
      }
    ]
  }
];

export function findSlideshowById(id: string) {
  return slideshows.find((slideshow) => slideshow.id === id);
}
