import {EventList} from '@components/blocks/EventList';
import {PageShell} from '@components/layout/PageShell';
import {getEvents, getNavigation} from '@lib/pages';
import {readTenantResolutionFromRequest} from '@lib/tenant';

export const dynamic = 'force-static';

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

  const [headerNavigation, footerNavigation, events] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getEvents({tenantId: tenant.id, locale})
  ]);

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
    >
      <EventList block={buildEventBlock(locale)} events={events} locale={locale} tenantPath={tenantPath} />
    </PageShell>
  );
}
