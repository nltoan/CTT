import type { Field } from 'payload/types';

export const seoFields = ({ localized = true }: { localized?: boolean } = {}): Field => ({
  type: 'group',
  name: 'seo',
  label: 'SEO & Open Graph',
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề SEO',
      type: 'text',
      localized,
    },
    {
      name: 'description',
      label: 'Mô tả SEO',
      type: 'textarea',
      localized,
    },
    {
      name: 'image',
      label: 'Ảnh chia sẻ',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'noIndex',
      label: 'Chặn lập chỉ mục (noindex)',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'noFollow',
      label: 'Chặn theo liên kết (nofollow)',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
});
