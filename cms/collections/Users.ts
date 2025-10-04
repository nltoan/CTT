import type { CollectionConfig } from 'payload/types';
import { isSuperAdmin } from '../access/tenant';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Người dùng',
    plural: 'Người dùng',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
    group: 'Quản trị',
  },
  auth: {
    verify: true,
    depth: 2,
  },
  access: {
    read: isSuperAdmin,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'firstName',
      label: 'Tên',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Họ',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Vai trò hệ thống',
      type: 'select',
      defaultValue: 'staff',
      options: [
        { label: 'Super admin', value: 'super-admin' },
        { label: 'Staff', value: 'staff' },
      ],
    },
    {
      name: 'memberships',
      label: 'Quyền tenant',
      type: 'relationship',
      relationTo: 'tenant-users',
      hasMany: true,
      admin: {
        description: 'Quản lý tại collection Tenant Users.',
      },
    },
    {
      name: 'preferences',
      label: 'Tuỳ chọn',
      type: 'group',
      fields: [
        {
          name: 'locale',
          label: 'Ngôn ngữ admin',
          type: 'select',
          options: [
            { label: 'Tiếng Việt', value: 'vi' },
            { label: 'English', value: 'en' },
          ],
        },
        {
          name: 'timezone',
          label: 'Timezone',
          type: 'text',
        },
      ],
    },
  ],
};
