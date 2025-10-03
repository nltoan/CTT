import type { CollectionConfig } from 'payload/types';
import { membershipManagementAccess, tenantFieldAccess, tenantScopedAccess } from '../access/tenant';

export const TenantUsers: CollectionConfig = {
  slug: 'tenant-users',
  labels: {
    singular: 'Thành viên tenant',
    plural: 'Thành viên tenant',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['tenant', 'user', 'role'],
    group: 'Quản trị',
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: membershipManagementAccess,
    update: membershipManagementAccess,
    delete: membershipManagementAccess,
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
      name: 'user',
      label: 'Người dùng',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'role',
      label: 'Vai trò',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
        { label: 'Media Manager', value: 'media-manager' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
  ],
};
