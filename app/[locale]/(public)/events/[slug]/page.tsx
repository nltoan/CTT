import {notFound} from 'next/navigation';
import Link from 'next/link';

import type {Metadata} from 'next';
import {PageShell} from '@components/layout/PageShell';
import {Breadcrumbs} from '@components/layout/Breadcrumbs';
import {PageRenderer} from '@components/PageRenderer';
import {getNavigation, getRecentPosts} from '@lib/pages';
import {getEvent, getEvents as fetchEventsForBlocks} from '@lib/events';
import {getGalleryPreview} from '@lib/galleries';
import {
  createEventMetadata,
  buildEventJsonLd,
  buildBreadcrumbJsonLd,
  buildPath
} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootEventStaticParams} from '@lib/static-paths';
import {getSlideshow as getSlideshowForTenant} from '@lib/slideshows';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getRootEventStaticParams();
}

function formatDateTime({
  startsAt,
  endsAt,
  locale
}: {
  startsAt: string;
  endsAt?: string;
  locale: 'vi' | 'en';
}) {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : undefined;
  const formatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    dateStyle: 'full',
    timeStyle: 'short'
  });
  if (!end) {
    return formatter.format(start);
  }
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    const timeFormatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formatter.format(start)} → ${timeFormatter.format(end)}`;
  }
  return `${formatter.format(start)} → ${formatter.format(end)}`;
}

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; slug: string; tenant?: string};
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });
  const event = await getEvent({tenantId: tenant.id, locale, slug: params.slug});

  if (!event) {
    return {};
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createEventMetadata({event, tenant, locale, tenantPath, settings});
}

export default async function EventDetail({
  params
}: {
  params: {locale: 'vi' | 'en'; slug: string; tenant?: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });
  const event = await getEvent({tenantId: tenant.id, locale, slug: params.slug});

  if (!event) {
    notFound();
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const [headerNavigation, footerNavigation] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale})
  ]);

  let relatedEvents = (await fetchEventsForBlocks({
    tenantId: tenant.id,
    locale,
    status: 'upcoming',
    limit: 3
  })).filter((item) => item.id !== event.id);

  if (!relatedEvents.length) {
    relatedEvents = (await fetchEventsForBlocks({
      tenantId: tenant.id,
      locale,
      status: 'all',
      limit: 3
    })).filter((item) => item.id !== event.id);
  }

  const eventJsonLd = buildEventJsonLd({event, tenant, locale, tenantPath, settings});
  const breadcrumbItems: {label: string; slugSegments?: string[]}[] = [
    {label: locale === 'vi' ? 'Trang chủ' : 'Home'},
    {label: locale === 'vi' ? 'Sự kiện' : 'Events', slugSegments: ['events']},
    {label: event.title, slugSegments: ['events', event.slug]}
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    locale,
    tenantPath,
    items: breadcrumbItems.map((item) => ({name: item.label, slugSegments: item.slugSegments}))
  });
  const breadcrumbLinks = breadcrumbItems.map((item, index) => ({
    label: item.label,
    href:
      index === breadcrumbItems.length - 1
        ? undefined
        : buildPath({locale, tenantPath, slugSegments: item.slugSegments})
  }));

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      <article className="bg-white py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(eventJsonLd)}} />
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbJsonLd)}}
          />
        )}
        <Breadcrumbs
          items={breadcrumbLinks}
          className="mx-auto w-full max-w-3xl px-6 pb-4 text-gray-500"
        />
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6">
          <header className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {event.category ?? (locale === 'vi' ? 'Sự kiện' : 'Event')}
            </span>
            <h1 className="font-display text-4xl text-secondary">{event.title}</h1>
            {event.summary && <p className="text-base text-gray-600">{event.summary}</p>}
            <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-secondary">
                  {locale === 'vi' ? 'Thời gian' : 'When'}
                </p>
                <p>{formatDateTime({startsAt: event.startsAt, endsAt: event.endsAt, locale})}</p>
              </div>
              {event.location && (
                <div>
                  <p className="font-semibold text-secondary">
                    {locale === 'vi' ? 'Địa điểm' : 'Venue'}
                  </p>
                  <p>{event.location}</p>
                </div>
              )}
            </div>
          </header>
          {event.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full rounded-3xl object-cover shadow-lg"
            />
          )}
          <div className="space-y-4 text-lg leading-relaxed text-gray-700">
            {event.content ? (
              <div dangerouslySetInnerHTML={{__html: event.content}} />
            ) : event.description ? (
              <p>{event.description}</p>
            ) : null}
          </div>
          {event.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-4">
              {event.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      {event.blocks?.length ? (
        <PageRenderer
          blocks={event.blocks}
          locale={locale}
          tenantPath={tenantPath}
          tenantId={tenant.id}
          getPosts={(query) =>
            getRecentPosts({
              tenantId: tenant.id,
              locale,
              limit: query?.limit,
              category: query?.category,
              tag: query?.tag,
              q: query?.q
            })
          }
          getEvents={(options) =>
            fetchEventsForBlocks({
              tenantId: tenant.id,
              locale,
              from: options?.from,
              to: options?.to,
              limit: options?.limit,
              status: options?.status,
              category: options?.category,
              q: options?.q
            })
          }
          getGallery={(options) =>
            getGalleryPreview({
              tenantId: tenant.id,
              locale,
              slug: options.slug,
              limit: options.limit,
              sort: options.sort
            })
          }
          getSlideshow={(options) =>
            getSlideshowForTenant({
              tenantId: tenant.id,
              locale,
              id: options.id,
              limit: options.limit
            })
          }
        />
      ) : null}

      {relatedEvents.length ? (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
            <h2 className="text-2xl font-semibold text-secondary">
              {locale === 'vi' ? 'Các sự kiện khác' : 'More events'}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedEvents.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <time className="text-xs uppercase tracking-wide text-primary">
                    {new Date(item.startsAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN')}
                  </time>
                  <h3 className="mt-2 text-base font-semibold text-secondary">{item.title}</h3>
                  {item.summary && <p className="mt-2 text-xs text-gray-600">{item.summary}</p>}
                  <Link
                    href={`/${locale}${tenantPath}/events/${item.slug}`}
                    className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:opacity-80"
                  >
                    {locale === 'vi' ? 'Xem chi tiết' : 'View details'} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
