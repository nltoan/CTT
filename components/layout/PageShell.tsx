import {SiteFooter} from './SiteFooter';
import {SiteHeader} from './SiteHeader';
import {CookieBanner} from './CookieBanner';
import {AnalyticsScripts} from './AnalyticsScripts';
import {SkipLink} from './SkipLink';

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

  const skipLabel = locale === 'vi' ? 'Bỏ qua tới nội dung chính' : 'Skip to main content';

  return (
    <div
      className="flex min-h-screen flex-col font-body"
      style={getTenantThemeCssVariables(tenant)}
      data-tenant={tenant.slug}
    >
      <SkipLink label={skipLabel} />
      <SiteHeader
        tenant={tenant}
        navigation={headerNavigation}
        locale={locale}
        tenantPath={tenantPath}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col gap-16 focus:outline-none"
      >
        {children}
      </main>
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
