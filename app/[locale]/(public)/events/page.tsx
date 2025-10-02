import type {Metadata} from 'next';

import {EventList} from '@components/blocks/EventList';
import {PageShell} from '@components/layout/PageShell';
import {getEvents, getNavigation} from '@lib/pages';
import {createCollectionMetadata, buildEventsGraphJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

export const dynamic = 'force-static';

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant?: string};
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const title = locale === 'vi' ? 'Sự kiện & lịch trình' : 'Events & schedule';
  const description =
    locale === 'vi'
      ? 'Theo dõi đầy đủ các mốc audition, workshop và concert quan trọng của cuộc thi.'
      : 'Explore every upcoming audition, workshop, and concert for the competition.';

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['events'],
    title,
    description,
    settings
  });
}

const buildEventBlock = (locale: 'vi' | 'en') => ({
  type: 'event-list' as const,
  title: locale === 'vi' ? 'Sự kiện & lịch trình' : 'Events & schedule',
  description:
    locale === 'vi'
      ? 'Theo dõi đầy đủ các mốc audition, workshop và concert quan trọng của cuộc thi.'
      : 'Explore every upcoming audition, workshop, and concert for the competition.',
  emptyStateMessage:
    locale === 'vi'
      ? 'Hiện chưa có sự kiện nào được công bố. Vui lòng quay lại sau.'
      : 'No events have been announced yet. Please check back soon!'
});

export default async function EventsIndex({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant?: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const [headerNavigation, footerNavigation, events] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getEvents({tenantId: tenant.id, locale})
  ]);

  const eventsJsonLd = buildEventsGraphJsonLd({
    events,
    tenant,
    locale,
    tenantPath,
    settings
  });

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {eventsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(eventsJsonLd)}}
        />
      )}
      <EventList block={buildEventBlock(locale)} events={events} locale={locale} tenantPath={tenantPath} />
    </PageShell>
  );
}
