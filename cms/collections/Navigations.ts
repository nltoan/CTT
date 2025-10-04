import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { linkFields } from '../fields/link';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';

export const Navigations: CollectionConfig = {
  slug: 'navigations',
  labels: {
    singular: 'Điều hướng',
    plural: 'Điều hướng',
  },
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'tenant'],
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  hooks: createCollectionRevalidateHooks('navigations'),
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
      name: 'key',
      label: 'Loại menu',
      type: 'select',
      required: true,
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Secondary', value: 'secondary' },
      ],
    },
    {
      name: 'items',
      label: 'Mục điều hướng',
      type: 'array',
      fields: [
        linkFields({ name: 'link', label: 'Liên kết', requiredLabel: true }),
        {
          name: 'order',
          label: 'Thứ tự',
          type: 'number',
        },
        {
          name: 'icon',
          label: 'Icon (class)',
          type: 'text',
        },
        {
          name: 'children',
          label: 'Menu con',
          type: 'array',
          fields: [
            linkFields({ name: 'link', label: 'Liên kết', requiredLabel: true }),
            {
              name: 'description',
              label: 'Mô tả',
              type: 'textarea',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
};
