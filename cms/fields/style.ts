import type { Field } from 'payload/types';

const spacingOptions = [
  { label: 'Không', value: 'none' },
  { label: 'Rất nhỏ', value: 'xs' },
  { label: 'Nhỏ', value: 'sm' },
  { label: 'Trung bình', value: 'md' },
  { label: 'Lớn', value: 'lg' },
];

const booleanField = (name: string, label: string): Field => ({
  name,
  label,
  type: 'checkbox',
  defaultValue: true,
});

export const blockStyleField: Field = {
  name: 'style',
  type: 'group',
  admin: {
    description:
      'Điều chỉnh container, khoảng cách, màu nền và tuỳ chọn hiển thị cho block này.',
  },
  fields: [
    {
      name: 'container',
      type: 'select',
      label: 'Độ rộng',
      defaultValue: 'content',
      options: [
        { label: 'Chuẩn', value: 'content' },
        { label: 'Rộng', value: 'wide' },
        { label: 'Hẹp', value: 'narrow' },
        { label: 'Full width', value: 'full' },
        { label: 'Tràn mép', value: 'edge' },
      ],
    },
    {
      name: 'variant',
      label: 'Biến thể nền',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Mặc định', value: 'default' },
        { label: 'Muted', value: 'muted' },
        { label: 'Tương phản', value: 'contrast' },
        { label: 'Highlight', value: 'highlight' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    {
      name: 'align',
      label: 'Căn chỉnh nội dung',
      type: 'select',
      options: [
        { label: 'Trái', value: 'start' },
        { label: 'Giữa', value: 'center' },
        { label: 'Phải', value: 'end' },
      ],
    },
    {
      name: 'spacing',
      label: 'Khoảng cách',
      type: 'group',
      fields: [
        {
          name: 'padding',
          label: 'Padding',
          type: 'select',
          options: spacingOptions,
        },
        {
          name: 'top',
          label: 'Margin trên',
          type: 'select',
          options: spacingOptions,
        },
        {
          name: 'bottom',
          label: 'Margin dưới',
          type: 'select',
          options: spacingOptions,
        },
      ],
    },
    {
      name: 'divider',
      label: 'Đường phân cách',
      type: 'select',
      options: [
        { label: 'Không', value: 'none' },
        { label: 'Trên', value: 'top' },
        { label: 'Dưới', value: 'bottom' },
        { label: 'Cả hai', value: 'both' },
      ],
    },
    {
      name: 'background',
      label: 'Nền tuỳ chỉnh',
      type: 'group',
      fields: [
        {
          name: 'color',
          label: 'Mã màu nền',
          type: 'text',
        },
        {
          name: 'image',
          label: 'Ảnh nền',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'position',
          label: 'Vị trí ảnh',
          type: 'select',
          options: [
            { label: 'Trên', value: 'top' },
            { label: 'Giữa', value: 'center' },
            { label: 'Dưới', value: 'bottom' },
          ],
        },
        {
          name: 'overlay',
          label: 'Lớp phủ',
          type: 'select',
          options: [
            { label: 'Không', value: '' },
            { label: 'Sáng', value: 'light' },
            { label: 'Tối', value: 'dark' },
          ],
        },
      ],
    },
    {
      name: 'theme',
      label: 'Override màu chữ',
      type: 'group',
      fields: [
        { name: 'primary', label: 'Primary', type: 'text' },
        { name: 'secondary', label: 'Secondary', type: 'text' },
        { name: 'accent', label: 'Accent', type: 'text' },
        { name: 'background', label: 'Background', type: 'text' },
        { name: 'text', label: 'Text', type: 'text' },
      ],
    },
    {
      name: 'visibility',
      label: 'Hiển thị theo thiết bị',
      type: 'group',
      fields: [
        booleanField('desktop', 'Desktop'),
        booleanField('tablet', 'Tablet'),
        booleanField('mobile', 'Mobile'),
      ],
    },
  ],
};
