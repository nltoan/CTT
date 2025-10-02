import Link from 'next/link';

import type {EventListBlock} from '@types/blocks';
import type {Event} from '@types/cms';
import type {Locale} from '@i18n/config';

function formatDateRange({
  startsAt,
  endsAt,
  locale
}: {
  startsAt: string;
  endsAt?: string;
  locale: Locale;
}) {
  const start = new Date(startsAt);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short'
  };

  const formatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', options);

  if (!endsAt) {
    return formatter.format(start);
  }

  const end = new Date(endsAt);
  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    const timeFormatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formatter.format(start)} – ${timeFormatter.format(end)}`;
  }

  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function EventList({
  block,
  events,
  locale,
  tenantPath = ''
}: {
  block: EventListBlock;
  events: Event[];
  locale: Locale;
  tenantPath?: string;
}) {
  const title = block.title ?? (locale === 'vi' ? 'Sự kiện & lịch trình' : 'Events & schedule');
  const description =
    block.description ??
    (locale === 'vi'
      ? 'Theo dõi các mốc audition, workshop và concert dành cho thí sinh.'
      : 'Keep track of auditions, workshops, and concerts for contestants.');
  const emptyMessage =
    block.emptyStateMessage ??
    (locale === 'vi'
      ? 'Chưa có sự kiện nào trong giai đoạn này. Hãy quay lại sau!'
      : 'No events are scheduled for this period. Please check back soon!');

  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <header className="space-y-3 text-center">
          <h2 className="font-display text-3xl text-secondary md:text-4xl">{title}</h2>
          <p className="text-base text-gray-600">{description}</p>
        </header>
        {events.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-slate-50 p-10 text-center text-sm text-gray-500">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    {locale === 'vi' ? 'Sự kiện' : 'Event'}
                  </span>
                  <h3 className="text-xl font-semibold text-secondary">{event.title}</h3>
                  <dl className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <dt className="font-medium text-secondary">
                        {locale === 'vi' ? 'Thời gian:' : 'When:'}
                      </dt>
                      <dd>{formatDateRange({startsAt: event.startsAt, endsAt: event.endsAt, locale})}</dd>
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-2">
                        <dt className="font-medium text-secondary">
                          {locale === 'vi' ? 'Địa điểm:' : 'Where:'}
                        </dt>
                        <dd>{event.location}</dd>
                      </div>
                    )}
                  </dl>
                  {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                </div>
                {block.ctaLabel && (
                  <div className="pt-4">
                    <Link
                      href={`/${locale}${tenantPath}/events`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                    >
                      {block.ctaLabel} →
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
