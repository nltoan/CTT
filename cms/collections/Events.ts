import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { seoFields } from '../fields/seo';
import { slugField } from '../fields/slug';
import { translationKeyField } from '../fields/translation-key';
import { pageBuilderBlocks } from '../fields/blocks';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Sự kiện',
    plural: 'Sự kiện',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startsAt', 'tenant', 'status'],
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
  hooks: createCollectionRevalidateHooks('events'),
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      localized: true,
      required: true,
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
      name: 'summary',
      label: 'Tóm tắt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'description',
      label: 'Mô tả dài',
      type: 'richText',
      localized: true,
    },
    {
      name: 'startsAt',
      label: 'Bắt đầu',
      type: 'date',
      required: true,
    },
    {
      name: 'endsAt',
      label: 'Kết thúc',
      type: 'date',
    },
    {
      name: 'location',
      label: 'Địa điểm',
      type: 'text',
      localized: true,
    },
    {
      name: 'timezone',
      label: 'Múi giờ',
      type: 'text',
      defaultValue: 'Asia/Ho_Chi_Minh',
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Nháp', value: 'draft' },
        { label: 'Đã xuất bản', value: 'published' },
        { label: 'Lên lịch', value: 'scheduled' },
      ],
    },
    {
      name: 'category',
      label: 'Danh mục',
      type: 'relationship',
      relationTo: 'event-categories',
    },
    {
      name: 'tags',
      label: 'Thẻ',
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
      name: 'coverImage',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'videoEmbed',
      label: 'Video embed (Mux/Cloudflare Stream)',
      type: 'text',
    },
    {
      name: 'blocks',
      label: 'Block nội dung',
      type: 'blocks',
      blocks: pageBuilderBlocks,
    },
    {
      name: 'tickets',
      label: 'Liên kết đăng ký/mua vé',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    seoFields(),
  ],
};
