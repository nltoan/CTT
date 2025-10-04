import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { slugField } from '../fields/slug';

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: {
    singular: 'Chủ đề tin tức',
    plural: 'Chủ đề tin tức',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant'],
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  fields: [
    {
      name: 'title',
      label: 'Tên',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField(),
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
  ],
};
