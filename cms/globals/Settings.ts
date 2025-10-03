import type { GlobalConfig } from 'payload/types';
import { settingsRevalidateHook } from '../hooks/revalidate';
import { seoFields } from '../fields/seo';

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Cài đặt',
  hooks: {
    afterChange: [settingsRevalidateHook],
  },
  fields: [
    seoFields(),
    {
      name: 'revalidateSeconds',
      label: 'TTL revalidate mặc định (giây)',
      type: 'number',
      defaultValue: 60,
    },
    {
      name: 'analytics',
      label: 'Analytics',
      type: 'group',
      fields: [
        {
          name: 'gaId',
          label: 'Google Analytics ID',
          type: 'text',
        },
        {
          name: 'gtmId',
          label: 'Google Tag Manager ID',
          type: 'text',
        },
        {
          name: 'metaPixelId',
          label: 'Meta Pixel ID',
          type: 'text',
        },
        {
          name: 'requiresConsent',
          label: 'Chỉ tải script khi người dùng đồng ý cookie',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'cookieBanner',
      label: 'Banner cookie',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Bật banner cookie',
          defaultValue: true,
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Thông điệp',
          localized: true,
        },
        {
          name: 'acceptLabel',
          type: 'text',
          label: 'Nút chấp nhận',
          localized: true,
        },
        {
          name: 'rejectLabel',
          type: 'text',
          label: 'Nút từ chối',
          localized: true,
        },
        {
          name: 'moreInfoLabel',
          type: 'text',
          label: 'Nhãn xem thêm',
          localized: true,
        },
        {
          name: 'moreInfoUrl',
          type: 'text',
          label: 'Đường dẫn chi tiết',
        },
      ],
    },
    {
      name: 'tenantOverrides',
      label: 'Override theo tenant',
      type: 'array',
      fields: [
        {
          name: 'tenant',
          label: 'Tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
        seoFields(),
        {
          name: 'analytics',
          label: 'Analytics override',
          type: 'group',
          fields: [
            {
              name: 'gaId',
              type: 'text',
            },
            {
              name: 'gtmId',
              type: 'text',
            },
            {
              name: 'metaPixelId',
              type: 'text',
            },
            {
              name: 'requiresConsent',
              type: 'checkbox',
            },
          ],
        },
        {
          name: 'cookieBanner',
          label: 'Cookie banner override',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
            },
            {
              name: 'message',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'acceptLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'rejectLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'moreInfoLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'moreInfoUrl',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};
