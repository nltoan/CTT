export const galleries = [
  {
    id: 'gallery-main',
    tenantId: 'tenant-main',
    locale: 'vi' as const,
    name: 'Khoảnh khắc nổi bật',
    items: [
      {
        mediaId: 'piano-performance',
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
        caption: 'Biểu diễn Piano'
      },
      {
        mediaId: 'orchestra-night',
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
        caption: 'Đêm Gala Orchestra'
      }
    ]
  }
];

export function findGalleryById(id: string) {
  return galleries.find((gallery) => gallery.id === id);
}
