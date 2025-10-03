import {notFound} from 'next/navigation';

import {PageRenderer} from '@components/PageRenderer';
import {PageShell} from '@components/layout/PageShell';
import {getPageForTenant, getNavigation, getRecentPosts} from '@lib/pages';
import {getEvents as getEventsForTenant} from '@lib/events';
import {createPageMetadata} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootPageStaticParams} from '@lib/static-paths';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getRootPageStaticParams();
}

export async function generateMetadata({
  params
}: {
  params: {locale: string; slug?: string[]};
}) {
  const {tenant, slug, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale});

  if (!page) {
    return {};
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createPageMetadata({page, tenant, locale, tenantPath, settings});
}

export default async function Page({
  params
}: {
  params: {locale: 'vi' | 'en'; slug?: string[]};
}) {
  const {tenant, slug, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale});

  if (!page) {
    notFound();
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const [headerNavigation, footerNavigation] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale})
  ]);

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      <PageRenderer
        blocks={page.blocks}
        locale={locale}
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
          getEventsForTenant({
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
        tenantPath={tenantPath}
        tenantId={tenant.id}
      />
    </PageShell>
  );
}
