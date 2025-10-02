import {notFound} from 'next/navigation';

import {PageRenderer} from '@components/PageRenderer';
import {PageShell} from '@components/layout/PageShell';
import {
  getNavigation,
  getPageForTenant,
  getRecentPosts,
  getEvents as getEventsForTenant
} from '@lib/pages';
import {readTenantResolutionFromRequest} from '@lib/tenant';

export async function generateMetadata({
  params
}: {
  params: {locale: string; tenant: string; slug?: string[]};
}) {
  const {tenant, slug, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale});

  if (!page) {
    return {};
  }

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? tenant.description
  };
}

export default async function TenantPage({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string; slug?: string[]};
}) {
  const {tenant, slug, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const page = await getPageForTenant({tenantId: tenant.id, slug, locale});

  if (!page) {
    notFound();
  }

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
    >
      <PageRenderer
        blocks={page.blocks}
        locale={locale}
        getPosts={(limit) => getRecentPosts({tenantId: tenant.id, locale, limit})}
        getEvents={(options) =>
          getEventsForTenant({
            tenantId: tenant.id,
            locale,
            from: options?.from,
            to: options?.to,
            limit: options?.limit
          })
        }
        tenantPath={tenantPath}
        tenantId={tenant.id}
      />
    </PageShell>
  );
}
