import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: {
    singular: 'Nhà tài trợ',
    plural: 'Nhà tài trợ',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'tenant'],
    group: 'Đối tác',
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  fields: [
    {
      name: 'name',
      label: 'Tên',
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
      name: 'tier',
      label: 'Hạng',
      type: 'select',
      defaultValue: 'gold',
      options: [
        { label: 'Vàng', value: 'gold' },
        { label: 'Bạc', value: 'silver' },
        { label: 'Đồng', value: 'bronze' },
      ],
    },
    {
      name: 'url',
      label: 'Website',
      type: 'text',
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
  ],
};
