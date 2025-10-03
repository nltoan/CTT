import type { Field } from 'payload/types';

export const linkFields = ({
  name = 'link',
  label = 'Liên kết',
  requiredLabel = false,
  localized = true,
}: {
  name?: string;
  label?: string;
  requiredLabel?: boolean;
  localized?: boolean;
} = {}): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Nhãn hiển thị',
      required: requiredLabel,
      localized,
    },
    {
      name: 'type',
      label: 'Loại liên kết',
      type: 'select',
      required: true,
      defaultValue: 'custom',
      options: [
        { label: 'Đường dẫn tuỳ chỉnh', value: 'custom' },
        { label: 'Trang', value: 'page' },
        { label: 'Bài viết', value: 'post' },
        { label: 'Sự kiện', value: 'event' },
        { label: 'Gallery', value: 'gallery' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'custom',
      },
    },
    {
      name: 'reference',
      label: 'Nội dung nội bộ',
      type: 'relationship',
      relationTo: ['pages', 'posts', 'events', 'galleries'],
      admin: {
        condition: (_data, siblingData) =>
          ['page', 'post', 'event', 'gallery'].includes(siblingData?.type),
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Mở trong tab mới',
      defaultValue: false,
    },
  ],
});

export const ctaFields = ({
  name = 'ctas',
  minRows = 1,
  maxRows,
}: {
  name?: string;
  minRows?: number;
  maxRows?: number;
} = {}): Field => ({
  name,
  label: 'CTA',
  type: 'array',
  minRows,
  ...(maxRows ? { maxRows } : {}),
  fields: [linkFields({ name: 'cta', label: 'CTA', requiredLabel: true })],
});
