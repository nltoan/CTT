import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { slugField } from '../fields/slug';
import { translationKeyField } from '../fields/translation-key';
import { pageBuilderBlocks } from '../fields/blocks';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';

export const People: CollectionConfig = {
  slug: 'people',
  labels: {
    singular: 'Nhân sự',
    plural: 'Nhân sự',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tenant', 'order'],
    group: 'Nội dung',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  hooks: createCollectionRevalidateHooks('people'),
  fields: [
    {
      name: 'name',
      label: 'Họ tên',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    translationKeyField(),
    {
      name: 'tenant',
      label: 'Tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      access: {
        read: tenantFieldAccess(),
        update: tenantFieldAccess(),
      },
    },
    {
      name: 'title',
      label: 'Chức danh',
      type: 'text',
      localized: true,
    },
    {
      name: 'order',
      label: 'Thứ tự hiển thị',
      type: 'number',
    },
    {
      name: 'photo',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      label: 'Tiểu sử',
      type: 'richText',
      localized: true,
    },
    {
      name: 'disciplines',
      label: 'Chuyên môn',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'quote',
      label: 'Trích dẫn',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'achievements',
      label: 'Thành tích',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'highlights',
      label: 'Cột mốc nổi bật',
      type: 'array',
      fields: [
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
          name: 'year',
          label: 'Năm',
          type: 'text',
        },
      ],
    },
    {
      name: 'videoEmbedUrl',
      label: 'Video embed',
      type: 'text',
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
          localized: true,
        },
        {
          name: 'platform',
          label: 'Nền tảng',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Website', value: 'website' },
            { label: 'Khác', value: 'other' },
          ],
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
        },
      ],
    },
    {
      name: 'contactEmail',
      label: 'Email liên hệ',
      type: 'email',
    },
    {
      name: 'contactPhone',
      label: 'Điện thoại liên hệ',
      type: 'text',
    },
    {
      name: 'blocks',
      label: 'Block nội dung',
      type: 'blocks',
      blocks: pageBuilderBlocks,
    },
  ],
};
