import type { CollectionConfig } from 'payload/types';
import { tenantFieldAccess, tenantScopedAccess } from '../access/tenant';
import { createCollectionRevalidateHooks } from '../hooks/revalidate';

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'key', 'tenant'],
  },
  access: {
    read: tenantScopedAccess('tenant'),
    create: tenantScopedAccess('tenant'),
    update: tenantScopedAccess('tenant'),
    delete: tenantScopedAccess('tenant'),
  },
  hooks: createCollectionRevalidateHooks('forms'),
  fields: [
    {
      name: 'name',
      label: 'Tên form',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'key',
      label: 'Khoá form',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Dùng trong endpoint `/api/forms/:key`.',
      },
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
      label: 'Ngôn ngữ mặc định',
      type: 'select',
      defaultValue: 'vi',
      options: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      name: 'successMessage',
      label: 'Thông báo thành công',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'errorMessage',
      label: 'Thông báo lỗi',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'fields',
      label: 'Trường form',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'label',
          label: 'Nhãn',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'name',
          label: 'Tên trường',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          label: 'Loại',
          type: 'select',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Select', value: 'select' },
            { label: 'Checkbox', value: 'checkbox' },
            { label: 'Phone', value: 'tel' },
          ],
        },
        {
          name: 'placeholder',
          label: 'Placeholder',
          type: 'text',
          localized: true,
        },
        {
          name: 'required',
          label: 'Bắt buộc',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'options',
          label: 'Tuỳ chọn (với select/checkbox)',
          type: 'array',
          admin: {
            condition: (_data, siblingData) =>
              ['select', 'checkbox'].includes(siblingData?.type),
          },
          fields: [
            {
              name: 'label',
              label: 'Nhãn',
              type: 'text',
              localized: true,
            },
            {
              name: 'value',
              label: 'Giá trị',
              type: 'text',
            },
          ],
        },
        {
          name: 'validation',
          label: 'Validation',
          type: 'group',
          fields: [
            {
              name: 'pattern',
              label: 'Regex pattern',
              type: 'text',
            },
            {
              name: 'message',
              label: 'Thông báo lỗi',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'recipients',
      label: 'Email nhận thông báo',
      type: 'array',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      name: 'notifications',
      label: 'Thông báo bổ sung',
      type: 'group',
      fields: [
        {
          name: 'webhookUrl',
          label: 'Webhook URL',
          type: 'text',
        },
        {
          name: 'notifySubmitter',
          label: 'Gửi email lại cho người gửi',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
};
