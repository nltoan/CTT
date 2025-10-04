import {addSubmission} from '@data/form-submissions';
import {findForm, listFormsByTenant} from '@data/forms';
import {defaultLocale, locales, type Locale} from '@i18n/config';
import type {FormDefinition, FormSubmission, FormView, FormField} from '@types/forms';

const emailRegex = /\S+@\S+\.\S+/;

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function sanitizeValue(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function toFormView(definition: FormDefinition, locale: Locale): FormView {
  const formLocale = definition.locales[locale] ?? definition.locales[defaultLocale];

  return {
    ...formLocale,
    key: definition.key,
    tenantId: definition.tenantId,
    honeypotField: definition.honeypotField
  };
}

function validateField({
  field,
  value,
  locale
}: {
  field: FormField;
  value: string;
  locale: Locale;
}) {
  if (field.required && value.length === 0) {
    return locale === 'vi' ? 'Trường này là bắt buộc.' : 'This field is required.';
  }

  if (field.minLength && value.length > 0 && value.length < field.minLength) {
    return locale === 'vi'
      ? `Vui lòng nhập ít nhất ${field.minLength} ký tự.`
      : `Please enter at least ${field.minLength} characters.`;
  }

  if (field.maxLength && value.length > field.maxLength) {
    return locale === 'vi'
      ? `Vui lòng nhập tối đa ${field.maxLength} ký tự.`
      : `Please enter no more than ${field.maxLength} characters.`;
  }

  if (field.type === 'email' && value.length > 0 && !emailRegex.test(value)) {
    return locale === 'vi' ? 'Email không hợp lệ.' : 'Invalid email address.';
  }

  return null;
}

export function getFormView({
  tenantId,
  key,
  locale
}: {
  tenantId: string;
  key: string;
  locale: Locale;
}): FormView | null {
  const definition = findForm({tenantId, key});

  if (!definition) {
    return null;
  }

  return toFormView(definition, locale);
}

export function listFormViews({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: Locale;
}): FormView[] {
  return listFormsByTenant({tenantId}).map((definition) => toFormView(definition, locale));
}

export function validateSubmission({
  definition,
  locale,
  data
}: {
  definition: FormDefinition;
  locale: Locale;
  data: Record<string, unknown>;
}) {
  const errors: Record<string, string> = {};
  const cleaned: Record<string, string> = {};
  const formLocale = definition.locales[locale] ?? definition.locales[defaultLocale];

  for (const field of formLocale.fields) {
    const raw = sanitizeValue(data[field.name]);
    const error = validateField({field, value: raw, locale});
    if (error) {
      errors[field.name] = error;
    } else if (raw) {
      cleaned[field.name] = raw;
    } else {
      cleaned[field.name] = '';
    }
  }

  return {isValid: Object.keys(errors).length === 0, errors, cleanedData: cleaned};
}

export async function submitForm({
  tenantId,
  key,
  locale,
  data,
  metadata
}: {
  tenantId: string;
  key: string;
  locale: string;
  data: Record<string, unknown>;
  metadata?: FormSubmission['metadata'];
}) {
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const definition = findForm({tenantId, key});

  if (!definition) {
    return {
      success: false,
      status: 404,
      message: 'Form not found'
    } as const;
  }

  if (definition.honeypotField && data[definition.honeypotField]) {
    return {
      success: false,
      status: 400,
      message: 'Bot detection triggered'
    } as const;
  }

  const {isValid, errors, cleanedData} = validateSubmission({
    definition,
    locale: resolvedLocale,
    data
  });

  if (!isValid) {
    return {
      success: false,
      status: 422,
      message: definition.locales[resolvedLocale]?.errorMessage ?? 'Validation failed',
      errors
    } as const;
  }

  const submission: FormSubmission = {
    formKey: key,
    tenantId,
    locale: resolvedLocale,
    data: cleanedData,
    submittedAt: new Date().toISOString(),
    metadata
  };

  addSubmission(submission);

  return {
    success: true,
    status: 200,
    message: definition.locales[resolvedLocale]?.successMessage ?? 'Submitted'
  } as const;
}
