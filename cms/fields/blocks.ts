import type { Block } from 'payload/types';
import { blockStyleField } from './style';
import { ctaFields, linkFields } from './link';

const mediaField = (name: string, label: string = 'Ảnh/Video'): Block['fields'][number] => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
});

export const heroCountdownBlock: Block = {
  slug: 'hero-countdown',
  labels: {
    singular: 'Hero Countdown',
    plural: 'Hero Countdown',
  },
  imageURL: '/icons/hero.svg',
  fields: [
    blockStyleField,
    {
      name: 'heading',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subheading',
      label: 'Tiêu đề phụ',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'deadline',
      label: 'Thời hạn đếm ngược',
      type: 'date',
    },
    {
      name: 'countdownLabel',
      label: 'Nhãn đồng hồ',
      type: 'text',
      localized: true,
    },
    linkFields({ name: 'primaryCta', label: 'CTA chính', requiredLabel: true }),
    linkFields({ name: 'secondaryCta', label: 'CTA phụ' }),
    mediaField('background', 'Ảnh nền'),
    {
      name: 'overlay',
      label: 'Hiển thị overlay tối',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};

export const disciplinesGridBlock: Block = {
  slug: 'disciplines-grid',
  labels: {
    singular: 'Grid bộ môn',
    plural: 'Grid bộ môn',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'items',
      label: 'Bộ môn',
      type: 'array',
      minRows: 2,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        mediaField('image', 'Ảnh đại diện'),
        linkFields({ name: 'link', label: 'Liên kết chi tiết', localized: true }),
      ],
    },
  ],
};

export const testimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
    },
    {
      name: 'items',
      label: 'Testimonials',
      type: 'array',
      fields: [
        {
          name: 'quote',
          label: 'Trích dẫn',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'name',
          label: 'Tên',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'title',
          label: 'Chức danh',
          type: 'text',
          localized: true,
        },
        mediaField('avatar', 'Ảnh đại diện'),
      ],
    },
  ],
};

export const imageGalleryBlock: Block = {
  slug: 'image-gallery',
  labels: {
    singular: 'Image Gallery',
    plural: 'Image Gallery',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Bố cục',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
      ],
    },
    {
      name: 'items',
      label: 'Ảnh thủ công',
      type: 'array',
      admin: {
        description: 'Nếu chọn nguồn gallery, phần này có thể bỏ trống.',
      },
      fields: [
        mediaField('media', 'Ảnh'),
        {
          name: 'caption',
          type: 'textarea',
          label: 'Chú thích',
          localized: true,
        },
        linkFields({ name: 'link', label: 'Liên kết' }),
      ],
    },
    {
      name: 'source',
      label: 'Nguồn dữ liệu',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [{ label: 'Gallery', value: 'gallery' }],
        },
        {
          name: 'gallery',
          label: 'Gallery',
          type: 'relationship',
          relationTo: 'galleries',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'gallery',
          },
        },
        {
          name: 'limit',
          label: 'Giới hạn ảnh',
          type: 'number',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'gallery',
          },
        },
        {
          name: 'sort',
          label: 'Thứ tự',
          type: 'select',
          defaultValue: 'latest',
          options: [
            { label: 'Mới nhất', value: 'latest' },
            { label: 'Cũ nhất', value: 'oldest' },
          ],
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'gallery',
          },
        },
      ],
    },
    {
      name: 'emptyStateMessage',
      label: 'Thông điệp khi trống',
      type: 'text',
      localized: true,
    },
    linkFields({ name: 'viewAll', label: 'Xem tất cả', localized: true }),
  ],
};

export const timelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Timeline',
    plural: 'Timeline',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
    },
    {
      name: 'items',
      label: 'Mốc thời gian',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'datetime',
          label: 'Thời điểm',
          type: 'date',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
};

export const prizesBlock: Block = {
  slug: 'prizes',
  labels: {
    singular: 'Giải thưởng',
    plural: 'Giải thưởng',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
    },
    {
      name: 'items',
      label: 'Giải thưởng',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          label: 'Tên giải',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'textarea',
          localized: true,
        },
        mediaField('icon', 'Biểu tượng'),
      ],
    },
  ],
};

export const sponsorsGridBlock: Block = {
  slug: 'sponsors-grid',
  labels: {
    singular: 'Sponsors',
    plural: 'Sponsors',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
    },
    {
      name: 'emptyStateMessage',
      type: 'text',
      label: 'Thông điệp trống',
      localized: true,
    },
    {
      name: 'items',
      label: 'Sponsors tuỳ chỉnh',
      type: 'array',
      admin: {
        description: 'Có thể bỏ trống để tự động lấy từ collection Sponsors.',
      },
      fields: [
        {
          name: 'name',
          label: 'Tên',
          type: 'text',
          localized: true,
          required: true,
        },
        mediaField('logo', 'Logo'),
        {
          name: 'tier',
          label: 'Hạng',
          type: 'select',
          options: [
            { label: 'Vàng', value: 'gold' },
            { label: 'Bạc', value: 'silver' },
            { label: 'Đồng', value: 'bronze' },
          ],
        },
        linkFields({ name: 'link', label: 'Website' }),
      ],
    },
  ],
};

export const peopleGridBlock: Block = {
  slug: 'people-grid',
  labels: {
    singular: 'Grid nhân sự',
    plural: 'Grid nhân sự',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
    },
    {
      name: 'emptyStateMessage',
      type: 'text',
      label: 'Thông điệp trống',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Nhân sự tuỳ chỉnh',
      admin: {
        description: 'Để trống để hiển thị danh sách tự động từ People.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'title',
          label: 'Chức danh',
          type: 'text',
          localized: true,
        },
        mediaField('photo', 'Ảnh'),
        {
          name: 'bio',
          label: 'Giới thiệu ngắn',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'disciplines',
          type: 'array',
          label: 'Chuyên môn',
          fields: [
            {
              name: 'value',
              type: 'text',
              localized: true,
            },
          ],
        },
        linkFields({ name: 'profile', label: 'Liên kết hồ sơ', localized: true }),
        linkFields({ name: 'cta', label: 'CTA bổ sung', localized: true }),
      ],
    },
  ],
};

export const postListBlock: Block = {
  slug: 'post-list',
  labels: {
    singular: 'Danh sách tin tức',
    plural: 'Danh sách tin tức',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'ctaLabel',
      label: 'Nhãn CTA xem thêm',
      type: 'text',
      localized: true,
    },
    {
      name: 'emptyStateMessage',
      label: 'Thông điệp trống',
      type: 'text',
      localized: true,
    },
    {
      name: 'query',
      label: 'Điều kiện lọc',
      type: 'group',
      fields: [
        {
          name: 'limit',
          label: 'Giới hạn bài viết',
          type: 'number',
        },
        {
          name: 'category',
          label: 'Chủ đề',
          type: 'relationship',
          relationTo: 'post-categories',
        },
        {
          name: 'tag',
          label: 'Thẻ',
          type: 'relationship',
          relationTo: 'post-tags',
        },
        {
          name: 'q',
          label: 'Từ khoá',
          type: 'text',
        },
      ],
    },
  ],
};

export const eventListBlock: Block = {
  slug: 'event-list',
  labels: {
    singular: 'Danh sách sự kiện',
    plural: 'Danh sách sự kiện',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'ctaLabel',
      label: 'Nhãn CTA xem chi tiết',
      type: 'text',
      localized: true,
    },
    {
      name: 'detailLabel',
      label: 'Nhãn nút chi tiết',
      type: 'text',
      localized: true,
    },
    {
      name: 'showDetailLinks',
      label: 'Hiển thị link chi tiết',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'emptyStateMessage',
      type: 'text',
      label: 'Thông điệp trống',
      localized: true,
    },
    {
      name: 'query',
      label: 'Điều kiện lọc',
      type: 'group',
      fields: [
        {
          name: 'from',
          label: 'Từ ngày',
          type: 'date',
        },
        {
          name: 'to',
          label: 'Đến ngày',
          type: 'date',
        },
        {
          name: 'limit',
          label: 'Giới hạn sự kiện',
          type: 'number',
        },
        {
          name: 'status',
          label: 'Trạng thái',
          type: 'select',
          options: [
            { label: 'Sắp diễn ra', value: 'upcoming' },
            { label: 'Đã diễn ra', value: 'past' },
            { label: 'Tất cả', value: 'all' },
          ],
        },
        {
          name: 'category',
          label: 'Danh mục',
          type: 'relationship',
          relationTo: 'event-categories',
        },
        {
          name: 'q',
          label: 'Từ khoá',
          type: 'text',
        },
      ],
    },
  ],
};

export const contactBlock: Block = {
  slug: 'contact',
  labels: {
    singular: 'Liên hệ',
    plural: 'Liên hệ',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'text',
      localized: true,
    },
    {
      name: 'addressLabel',
      label: 'Nhãn địa chỉ',
      type: 'text',
      localized: true,
    },
    {
      name: 'phone',
      label: 'Số điện thoại',
      type: 'text',
    },
    {
      name: 'phoneLabel',
      label: 'Nhãn điện thoại',
      type: 'text',
      localized: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
    },
    {
      name: 'emailLabel',
      label: 'Nhãn email',
      type: 'text',
      localized: true,
    },
    {
      name: 'mapEmbed',
      label: 'Mã nhúng bản đồ',
      type: 'textarea',
    },
    {
      name: 'formKey',
      label: 'Khoá form',
      type: 'relationship',
      relationTo: 'forms',
    },
  ],
};

export const ctaButtonsBlock: Block = {
  slug: 'cta-buttons',
  labels: {
    singular: 'Nhóm CTA',
    plural: 'Nhóm CTA',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'align',
      label: 'Căn chỉnh',
      type: 'select',
      options: [
        { label: 'Trái', value: 'start' },
        { label: 'Giữa', value: 'center' },
      ],
    },
    ctaFields({ minRows: 1 }),
  ],
};

export const slideshowBlock: Block = {
  slug: 'slideshow',
  labels: {
    singular: 'Slideshow',
    plural: 'Slideshow',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      fields: [
        mediaField('image', 'Ảnh/Video'),
        {
          name: 'title',
          label: 'Tiêu đề slide',
          type: 'text',
          localized: true,
        },
        {
          name: 'caption',
          label: 'Chú thích',
          type: 'textarea',
          localized: true,
        },
        linkFields({ name: 'link', label: 'Liên kết', localized: true }),
      ],
    },
    {
      name: 'options',
      label: 'Tuỳ chọn',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          label: 'Tự động chạy',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'interval',
          label: 'Khoảng cách (ms)',
          type: 'number',
          defaultValue: 6000,
        },
        {
          name: 'loop',
          label: 'Lặp vô hạn',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
};

export const richContentBlock: Block = {
  slug: 'rich-content',
  labels: {
    singular: 'Rich content',
    plural: 'Rich content',
  },
  fields: [
    blockStyleField,
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      required: true,
    },
  ],
};

export const pageBuilderBlocks = [
  heroCountdownBlock,
  disciplinesGridBlock,
  testimonialsBlock,
  imageGalleryBlock,
  timelineBlock,
  prizesBlock,
  sponsorsGridBlock,
  peopleGridBlock,
  postListBlock,
  eventListBlock,
  contactBlock,
  ctaButtonsBlock,
  slideshowBlock,
  richContentBlock,
];
