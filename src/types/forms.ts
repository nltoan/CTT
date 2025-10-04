import type {Locale} from '@i18n/config';

export type FormFieldType = 'text' | 'email' | 'textarea';

export type FormField = {
  id?: string;
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  helpText?: string;
  rows?: number;
};

export type FormLocaleContent = {
  title: string;
  description?: string;
  submitLabel: string;
  successMessage: string;
  errorMessage?: string;
  fields: FormField[];
};

export type FormDefinition = {
  key: string;
  tenantId: string;
  honeypotField?: string;
  locales: Record<Locale, FormLocaleContent>;
};

export type FormView = FormLocaleContent & {
  key: string;
  tenantId: string;
  honeypotField?: string;
};

export type FormSubmission = {
  formKey: string;
  tenantId: string;
  locale: Locale;
  data: Record<string, string>;
  submittedAt: string;
  metadata?: {
    ip?: string | null;
    userAgent?: string | null;
  };
};

export type FormValidationError = {
  field: string;
  message: string;
};
