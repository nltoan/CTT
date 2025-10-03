import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { seoFields } from '../fields/seo';
import { pageBuilderBlocks } from '../fields/blocks';
import { slugField } from '../fields/slug';
import { translationKeyField } from '../fields/translation-key';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Trang',
    plural: 'Trang',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant', 'status'],
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
  hooks: createCollectionRevalidateHooks('pages'),
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
      name: 'publishedAt',
      label: 'Ngày xuất bản',
      type: 'date',
      admin: {
        condition: (data) => data?.status === 'published' || data?.status === 'scheduled',
      },
    },
    {
      name: 'blocks',
      label: 'Block nội dung',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: true,
    },
    seoFields(),
  ],
};
