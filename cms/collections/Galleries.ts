import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { slugField } from '../fields/slug';
import { translationKeyField } from '../fields/translation-key';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';
import { pageBuilderBlocks } from '../fields/blocks';

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tenant', 'layout'],
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
  hooks: createCollectionRevalidateHooks('galleries'),
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
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'category',
      label: 'Danh mục',
      type: 'text',
      localized: true,
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
      name: 'layout',
      label: 'Bố cục',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
      ],
    },
    {
      name: 'coverImage',
      label: 'Ảnh cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'items',
      label: 'Hình ảnh / video',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'media',
          label: 'Media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Chú thích',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'description',
          label: 'Mô tả chi tiết',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'featured',
          label: 'Nổi bật',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'blocks',
      label: 'Block nội dung bổ sung',
      type: 'blocks',
      blocks: pageBuilderBlocks,
    },
  ],
};
