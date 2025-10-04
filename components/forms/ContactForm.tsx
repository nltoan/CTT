'use client';

import {useState} from 'react';

import type {FormField, FormView} from '@types/forms';
import type {Locale} from '@i18n/config';

function getInputType(field: FormField) {
  if (field.type === 'textarea') {
    return 'textarea';
  }
  if (field.type === 'email') {
    return 'email';
  }
  return 'text';
}

type SubmissionState =
  | {status: 'idle'}
  | {status: 'submitting'}
  | {status: 'success'; message: string}
  | {status: 'error'; message: string};

type FieldErrors = Record<string, string>;

export function ContactForm({
  form,
  tenantId,
  locale
}: {
  form: FormView;
  tenantId: string;
  locale: Locale;
}) {
  const [state, setState] = useState<SubmissionState>({status: 'idle'});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    setState({status: 'submitting'});
    setFieldErrors({});

    try {
      const payload = {
        tenantId,
        locale,
        data: Object.fromEntries(formData.entries())
      };

      const response = await fetch(`/api/forms/${form.key}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        formElement.reset();
        setState({status: 'success', message: form.successMessage});
        return;
      }

      const result = await response.json().catch(() => ({}));

      if (response.status === 422 && result?.errors) {
        setFieldErrors(result.errors as FieldErrors);
        setState({status: 'error', message: result?.message ?? form.errorMessage ?? 'Validation error'});
        return;
      }

      if (response.status === 429) {
        setState({status: 'error', message: result?.message ?? form.errorMessage ?? 'Too many requests'});
        return;
      }

      setState({status: 'error', message: result?.message ?? form.errorMessage ?? 'Unexpected error'});
    } catch (error) {
      console.error('Failed to submit contact form', error);
      setState({status: 'error', message: form.errorMessage ?? 'Could not submit the form'});
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-secondary">{form.title}</h3>
          {form.description && <p className="text-sm text-gray-600">{form.description}</p>}
        </div>
        {form.honeypotField && (
          <div className="hidden" aria-hidden="true">
            <label htmlFor={form.honeypotField} className="sr-only">
              {form.honeypotField}
            </label>
            <input
              id={form.honeypotField}
              name={form.honeypotField}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}
        <div className="space-y-5">
          {form.fields.map((field) => {
            const inputType = getInputType(field);
            const commonProps = {
              id: field.id ?? field.name,
              name: field.name,
              required: field.required,
              'aria-invalid': fieldErrors[field.name] ? 'true' : 'false',
              'aria-describedby': fieldErrors[field.name] ? `${field.name}-error` : undefined,
              placeholder: field.placeholder,
              maxLength: field.maxLength,
              minLength: field.minLength,
              className:
                'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-secondary shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40'
            } as const;

            return (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.id ?? field.name} className="text-sm font-medium text-secondary">
                  {field.label}
                  {field.required && <span className="ml-1 text-primary">*</span>}
                </label>
                {inputType === 'textarea' ? (
                  <textarea rows={field.rows ?? 4} {...commonProps} />
                ) : (
                  <input type={inputType} {...commonProps} />
                )}
                {field.helpText && <p className="text-xs text-gray-500">{field.helpText}</p>}
                {fieldErrors[field.name] && (
                  <p id={`${field.name}-error`} className="text-xs text-red-600">
                    {fieldErrors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={state.status === 'submitting'}
          >
            {state.status === 'submitting' ? (locale === 'vi' ? 'Đang gửi…' : 'Submitting…') : form.submitLabel}
          </button>
          {state.status === 'success' && (
            <p className="text-sm font-medium text-green-600">{state.message}</p>
          )}
          {state.status === 'error' && (
            <p className="text-sm font-medium text-red-600">{state.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
