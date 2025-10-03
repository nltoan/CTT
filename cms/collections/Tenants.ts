import type { CollectionConfig } from 'payload/types';
import { slugField } from '../fields/slug';
import { isSuperAdmin } from '../access/tenant';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Tenant',
    plural: 'Tenants',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status'],
  },
  access: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      label: 'Tên tenant',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Hoạt động', value: 'active' },
        { label: 'Tạm ngưng', value: 'paused' },
        { label: 'Nháp', value: 'draft' },
      ],
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
    },
    {
      name: 'domain',
      label: 'Domain tuỳ chỉnh',
      type: 'text',
    },
    {
      name: 'subdomain',
      label: 'Subdomain',
      type: 'text',
      admin: {
        description: 'Ví dụ: `cimfc` → truy cập qua `https://cimfc.example.com` hoặc `/t/cimfc`.',
      },
    },
    {
      name: 'locales',
      label: 'Ngôn ngữ hỗ trợ',
      type: 'select',
      hasMany: true,
      defaultValue: ['vi', 'en'],
      options: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      name: 'theme',
      label: 'Theme',
      type: 'group',
      fields: [
        {
          name: 'primaryColor',
          label: 'Primary color',
          type: 'text',
        },
        {
          name: 'secondaryColor',
          label: 'Secondary color',
          type: 'text',
        },
        {
          name: 'accentColor',
          label: 'Accent color',
          type: 'text',
        },
        {
          name: 'backgroundColor',
          label: 'Background color',
          type: 'text',
        },
        {
          name: 'textColor',
          label: 'Text color',
          type: 'text',
        },
        {
          name: 'fontHeading',
          label: 'Font tiêu đề',
          type: 'text',
        },
        {
          name: 'fontBody',
          label: 'Font nội dung',
          type: 'text',
        },
      ],
    },
    {
      name: 'branding',
      label: 'Branding',
      type: 'group',
      fields: [
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'favicon',
          label: 'Favicon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Mạng xã hội',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Tên hiển thị',
          type: 'text',
          required: true,
        },
        {
          name: 'platform',
          label: 'Nền tảng',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Website', value: 'website' },
            { label: 'Khác', value: 'other' },
          ],
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'scripts',
      label: 'Scripts nhúng',
      type: 'array',
      fields: [
        {
          name: 'position',
          type: 'select',
          options: [
            { label: 'Head', value: 'head' },
            { label: 'Body', value: 'body' },
          ],
          defaultValue: 'head',
        },
        {
          name: 'code',
          label: 'Đoạn script',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
};
