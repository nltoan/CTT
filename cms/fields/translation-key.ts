import { randomUUID } from 'crypto';
import type { Field } from 'payload/types';

export const translationKeyField = ({
  name = 'translationKey',
  label = 'Translation Key',
}: {
  name?: string;
  label?: string;
} = {}): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [({ value }) => value ?? randomUUID()],
  },
});
