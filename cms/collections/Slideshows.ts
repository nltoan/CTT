import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';

export const Slideshows: CollectionConfig = {
  slug: 'slideshows',
  labels: {
    singular: 'Slideshow',
    plural: 'Slideshows',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tenant'],
    group: 'Nội dung',
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  hooks: createCollectionRevalidateHooks('slideshows'),
  fields: [
    {
      name: 'name',
      label: 'Tên slideshow',
      type: 'text',
      required: true,
      localized: true,
    },
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
      name: 'slides',
      label: 'Slides',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          label: 'Ảnh/Video',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          localized: true,
        },
        {
          name: 'caption',
          label: 'Chú thích',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'link',
          label: 'Liên kết',
          type: 'relationship',
          relationTo: ['pages', 'posts', 'events', 'galleries'],
        },
      ],
    },
    {
      name: 'options',
      label: 'Tuỳ chọn',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          label: 'Tự động chạy',
        },
        {
          name: 'interval',
          label: 'Khoảng cách (ms)',
          type: 'number',
          defaultValue: 6000,
        },
        {
          name: 'loop',
          type: 'checkbox',
          defaultValue: true,
          label: 'Lặp vô hạn',
        },
      ],
    },
  ],
};
