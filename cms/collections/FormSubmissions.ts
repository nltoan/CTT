import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess, isSuperAdmin } from '../access/tenant';

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Form submission',
    plural: 'Form submissions',
  },
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['form', 'tenant', 'createdAt'],
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: () => true,
    update: isSuperAdmin,
    delete: tenantScopedAccess('tenant'),
  },
  fields: [
    {
      name: 'form',
      label: 'Form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
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
      name: 'locale',
      label: 'Ngôn ngữ',
      type: 'text',
    },
    {
      name: 'data',
      label: 'Payload',
      type: 'json',
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Mới', value: 'new' },
        { label: 'Đang xử lý', value: 'processing' },
        { label: 'Hoàn tất', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'ipAddress',
      label: 'Địa chỉ IP',
      type: 'text',
    },
    {
      name: 'userAgent',
      label: 'User agent',
      type: 'text',
    },
  ],
};
