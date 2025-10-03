import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { seoFields } from '../fields/seo';
import { slugField } from '../fields/slug';
import { translationKeyField } from '../fields/translation-key';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';
import { pageBuilderBlocks } from '../fields/blocks';

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Bài viết',
    plural: 'Bài viết',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant', 'status'],
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
  hooks: createCollectionRevalidateHooks('posts'),
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
      name: 'excerpt',
      label: 'Tóm tắt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'coverImage',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      label: 'Nội dung chính',
      type: 'richText',
      localized: true,
    },
    {
      name: 'blocks',
      label: 'Block bổ sung',
      type: 'blocks',
      blocks: pageBuilderBlocks,
    },
    {
      name: 'author',
      label: 'Tác giả',
      type: 'relationship',
      relationTo: 'people',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'category',
      label: 'Chủ đề',
      type: 'relationship',
      relationTo: 'post-categories',
    },
    {
      name: 'tags',
      label: 'Thẻ',
      type: 'relationship',
      relationTo: 'post-tags',
      hasMany: true,
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
      name: 'relatedPosts',
      label: 'Bài liên quan',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
    seoFields(),
  ],
};
