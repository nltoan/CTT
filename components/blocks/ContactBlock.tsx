import {ContactForm} from '@components/forms/ContactForm';

import type {ContactBlock as ContactBlockType} from '@types/blocks';
import type {FormView} from '@types/forms';
import type {Locale} from '@i18n/config';

export function ContactBlock({
  block,
  form,
  tenantId,
  locale
}: {
  block: ContactBlockType;
  form?: FormView | null;
  tenantId: string;
  locale: Locale;
}) {
  const hasForm = Boolean(form);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-5xl space-y-12 px-6">
        <div
          className={`grid gap-10 ${
            hasForm ? 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : ''
          }`}
        >
          <div className="space-y-4">
            {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
            {block.address && (
              <p className="text-base text-gray-600">
                <strong className="block font-semibold text-secondary">
                  {block.addressLabel ?? 'Address'}
                </strong>
                {block.address}
              </p>
            )}
            {block.phone && (
              <p className="text-base text-gray-600">
                <strong className="block font-semibold text-secondary">
                  {block.phoneLabel ?? 'Phone'}
                </strong>
                <a className="text-primary" href={`tel:${block.phone}`}>
                  {block.phone}
                </a>
              </p>
            )}
            {block.email && (
              <p className="text-base text-gray-600">
                <strong className="block font-semibold text-secondary">
                  {block.emailLabel ?? 'Email'}
                </strong>
                <a className="text-primary" href={`mailto:${block.email}`}>
                  {block.email}
                </a>
              </p>
            )}
            {block.mapEmbed && (
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <iframe
                  src={block.mapEmbed}
                  title="Map"
                  className="h-80 w-full"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}
            {block.formKey && !hasForm && (
              <p className="text-sm text-gray-500">
                {locale === 'vi'
                  ? 'Biểu mẫu liên hệ chưa được cấu hình cho tenant này.'
                  : 'The contact form is not configured for this tenant yet.'}
              </p>
            )}
          </div>
          {hasForm ? <ContactForm form={form!} tenantId={tenantId} locale={locale} /> : null}
        </div>
      </div>
    </section>
  );
}
