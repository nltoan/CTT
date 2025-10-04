import {PageShell} from '@components/layout/PageShell';
import {NotFoundContent} from '@components/layout/NotFoundContent';
import {getDictionary} from '@i18n/get-dictionary';
import {defaultLocale, type Locale} from '@i18n/config';
import {getNavigation} from '@lib/pages';
import {getSettingsForTenant} from '@lib/settings';
import {buildLocalizedPath} from '@lib/url';
import {assertLocale, getDefaultTenant} from '@lib/tenant';

export default async function PublicNotFound({
  params
}: {
  params: {locale: string};
}) {
  const locale: Locale = assertLocale(params.locale) ? params.locale : defaultLocale;
  const tenant = getDefaultTenant();

  const [dictionary, headerNavigation, footerNavigation] = await Promise.all([
    getDictionary(locale),
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale})
  ]);

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});
  const homeHref = buildLocalizedPath({locale});
  const searchHref = buildLocalizedPath({locale, slug: 'search'});

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
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
