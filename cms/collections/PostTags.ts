import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { slugField } from '../fields/slug';

export const PostTags: CollectionConfig = {
  slug: 'post-tags',
  labels: {
    singular: 'Thẻ tin tức',
    plural: 'Thẻ tin tức',
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
