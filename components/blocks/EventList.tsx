import Link from 'next/link';
import clsx from 'clsx';

import type {EventListBlock} from '@types/blocks';
import type {Event} from '@types/cms';
import type {Locale} from '@i18n/config';
import {BlockSection} from './BlockSection';

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
  const detailLabel = block.detailLabel ?? (locale === 'vi' ? 'Xem chi tiết' : 'View details');
  const emptyMessage =
    block.emptyStateMessage ??
    (locale === 'vi'
      ? 'Chưa có sự kiện nào trong giai đoạn này. Hãy quay lại sau!'
      : 'No events are scheduled for this period. Please check back soon!');
  const showDetailLinks = block.showDetailLinks ?? true;
  const viewAllLabel = block.ctaLabel ?? (locale === 'vi' ? 'Xem toàn bộ lịch' : 'View full schedule');

  const headingAlign =
    block.style?.align === 'center'
      ? 'text-center'
      : block.style?.align === 'end'
        ? 'text-right'
        : 'text-left';

  return (
    <BlockSection block={block} innerClassName="flex flex-col gap-8">
      <header className={clsx('space-y-3', headingAlign)}>
        <h2 className="font-display text-3xl text-secondary md:text-4xl">{title}</h2>
        <p className="text-base text-gray-600">{description}</p>
      </header>
      {events.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-slate-50 p-10 text-center text-sm text-gray-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => {
            const detailHref = `/${locale}${tenantPath}/events/${event.slug}`;
            return (
              <article
                key={event.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      {event.category ?? (locale === 'vi' ? 'Sự kiện' : 'Event')}
                    </span>
                    <time className="text-xs font-medium uppercase tracking-wide text-secondary">
                      {formatDateRange({startsAt: event.startsAt, endsAt: event.endsAt, locale})}
                    </time>
                  </div>
                  <h3 className="text-xl font-semibold text-secondary">
                    {showDetailLinks ? (
                      <Link href={detailHref} className="hover:opacity-80">
                        {event.title}
                      </Link>
                    ) : (
                      event.title
                    )}
                  </h3>
                  {event.summary && <p className="text-sm text-gray-600">{event.summary}</p>}
                  {event.location && (
                    <p className="text-sm font-medium text-secondary">
                      {locale === 'vi' ? 'Địa điểm: ' : 'Venue: '}
                      <span className="font-normal text-gray-600">{event.location}</span>
                    </p>
                  )}
                  {event.tags?.length ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {showDetailLinks && (
                  <div className="pt-4">
                    <Link
                      href={detailHref}
                      className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                    >
                      {detailLabel} →
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      {block.ctaLabel && (
        <div className="flex justify-center pt-2">
          <Link
            href={`/${locale}${tenantPath}/events`}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/5"
          >
            {viewAllLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </BlockSection>
  );
}
