import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'tenant', 'alt'],
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  fields: [
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
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      localized: true,
    },
    {
      name: 'focalPoint',
      label: 'Điểm nhấn',
      type: 'point',
    },
    {
      name: 'transcript',
      label: 'Transcript / Caption',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      fields: [
        {
          name: 'value',
          label: 'Tag',
          type: 'text',
        },
      ],
    },
  ],
};
