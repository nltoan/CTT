import {SiteFooter} from './SiteFooter';
import {SiteHeader} from './SiteHeader';
import {CookieBanner} from './CookieBanner';
import {AnalyticsScripts} from './AnalyticsScripts';

import type {Navigation, Tenant} from '@types/cms';
import {getTenantThemeCssVariables} from '@lib/tenant';
import {buildOrganizationJsonLd, buildSiteNavigationJsonLd} from '@lib/seo';
import type {ResolvedSiteSettings} from '@lib/settings';

export function PageShell({
  tenant,
  locale,
  headerNavigation,
  footerNavigation,
  tenantPath = '',
  settings,
  children
}: {
  tenant: Tenant;
  locale: string;
  headerNavigation?: Navigation;
  footerNavigation?: Navigation;
  tenantPath?: string;
  settings?: ResolvedSiteSettings;
  children: React.ReactNode;
}) {
  const organizationJsonLd = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const navigationJsonLd = buildSiteNavigationJsonLd({
    navigation: headerNavigation,
    locale,
    tenantPath
  });
  const cookieStorageKey = `cookie-consent:${tenant.id}:${locale}`;

  return (
    <div
      className="flex min-h-screen flex-col font-body"
      style={getTenantThemeCssVariables(tenant)}
      data-tenant={tenant.slug}
    >
      <SiteHeader
        tenant={tenant}
        navigation={headerNavigation}
        locale={locale}
        tenantPath={tenantPath}
      />
      <div className="flex-1">{children}</div>
      <SiteFooter tenant={tenant} navigation={footerNavigation} locale={locale} tenantPath={tenantPath} />
      <AnalyticsScripts
        analytics={settings?.analytics}
        storageKey={cookieStorageKey}
      />
      {settings?.cookieBanner?.enabled && (
        <CookieBanner
          storageKey={cookieStorageKey}
          locale={locale}
          settings={settings.cookieBanner}
          tenant={tenant}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd)}}
      />
      {navigationJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(navigationJsonLd)}}
        />
      )}
    </div>
  );
}
