import {PageShell} from '@components/layout/PageShell';
import {NotFoundContent} from '@components/layout/NotFoundContent';
import {getDictionary} from '@i18n/get-dictionary';
import {getNavigation} from '@lib/pages';
import {getSettingsForTenant} from '@lib/settings';
import {buildLocalizedPath} from '@lib/url';
import {readTenantResolutionFromRequest} from '@lib/tenant';

export default async function TenantScopedNotFound({
  params
}: {
  params: {locale: string; tenant: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const [dictionary, headerNavigation, footerNavigation] = await Promise.all([
    getDictionary(locale),
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale})
  ]);

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const homeHref = buildLocalizedPath({locale, tenantPath});
  const searchHref = buildLocalizedPath({locale, tenantPath, slug: 'search'});

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      tenantPath={tenantPath}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      settings={settings}
    >
      <NotFoundContent
        title={dictionary.notFound.title}
        description={dictionary.notFound.description}
        homeHref={homeHref}
        searchHref={searchHref}
        homeLabel={dictionary.notFound.homeCta}
        searchLabel={dictionary.notFound.searchCta}
      />
    </PageShell>
  );
}
