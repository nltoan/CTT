import type {CollectionConfig} from 'payload/types';

import {tenantScopedAccess, tenantFieldAccess} from '../access/tenant';
import {slugField} from '../fields/slug';
import {translationKeyField} from '../fields/translation-key';
import {pageBuilderBlocks} from '../fields/blocks';
import {createCollectionRevalidateHooks} from '../hooks/revalidate';

export const Disciplines: CollectionConfig = {
  slug: 'disciplines',
  labels: {
    singular: 'Bộ môn',
    plural: 'Bộ môn',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'tenant'],
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
  hooks: createCollectionRevalidateHooks('disciplines'),
  fields: [
    {
      name: 'name',
      label: 'Tên bộ môn',
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
      name: 'shortDescription',
      label: 'Mô tả ngắn',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'description',
      label: 'Giới thiệu',
      type: 'richText',
      localized: true,
    },
    {
      name: 'category',
      label: 'Phân loại',
      type: 'text',
      localized: true,
    },
    {
      name: 'level',
      label: 'Trình độ',
      type: 'text',
      localized: true,
    },
    {
      name: 'ageRange',
      label: 'Độ tuổi phù hợp',
      type: 'text',
      localized: true,
    },
    {
      name: 'coverImage',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'requirements',
      label: 'Yêu cầu',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'value',
          label: 'Nội dung',
          type: 'text',
        },
      ],
    },
    {
      name: 'repertoire',
      label: 'Gợi ý tiết mục',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
    {
      name: 'schedule',
      label: 'Lịch trình',
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
          name: 'startsAt',
          label: 'Thời gian bắt đầu',
          type: 'date',
        },
        {
          name: 'endsAt',
          label: 'Thời gian kết thúc',
          type: 'date',
        },
      ],
    },
    {
      name: 'jury',
      label: 'Giám khảo',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
    },
    {
      name: 'relatedPeople',
      label: 'Cố vấn/Cố vấn liên quan',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
    },
    {
      name: 'blocks',
      label: 'Nội dung mở rộng',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      localized: true,
    },
  ],
};
