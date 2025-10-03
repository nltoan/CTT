import {buildEventsIcs} from '@lib/feeds';
import {textResponseWithCache} from '@lib/http';
import {getEvents} from '@lib/events';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {readTenantResolutionFromRequest} from '@lib/tenant';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export async function GET(
  request: Request,
  {params}: {params: {locale: 'vi' | 'en'}}
) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {slug: ['events', 'calendar.ics']},
    locale: params.locale
  });

  const [events, settings] = await Promise.all([
    getEvents({tenantId: tenant.id, locale, status: 'upcoming', limit: 100}),
    getSettingsForTenant({tenantId: tenant.id, locale})
  ]);

  const ics = buildEventsIcs({tenant, locale, tenantPath, events, settings});

  return textResponseWithCache({
    request,
    body: ics,
    ttl: settings.revalidateSeconds,
    contentType: 'text/calendar; charset=utf-8',
    headers: {
      'Content-Disposition': `attachment; filename="${tenant.slug}-events-${locale}.ics"`
    },
    cacheTags: ['events-calendar', tenant.id]
  });
}
