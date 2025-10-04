import type { Field } from 'payload/types';

export const slugField = ({ name = 'slug', label = 'Slug', localized = false }: {
  name?: string;
  label?: string;
  localized?: boolean;
} = {}): Field => ({
  name,
  label,
  type: 'text',
  localized,
  required: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [({ value, siblingData }) => {
      if (value) return value;
      const source = siblingData?.title || siblingData?.name;
      if (!source || typeof source !== 'string') return value;
      return source
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }],
  },
});
