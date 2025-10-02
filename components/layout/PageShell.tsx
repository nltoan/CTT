import {SiteFooter} from './SiteFooter';
import {SiteHeader} from './SiteHeader';

import type {Navigation, Tenant} from '@types/cms';
import {getTenantThemeCssVariables} from '@lib/tenant';
import {buildOrganizationJsonLd, buildSiteNavigationJsonLd} from '@lib/seo';

export function PageShell({
  tenant,
  locale,
  headerNavigation,
  footerNavigation,
  tenantPath = '',
  children
}: {
  tenant: Tenant;
  locale: string;
  headerNavigation?: Navigation;
  footerNavigation?: Navigation;
  tenantPath?: string;
  children: React.ReactNode;
}) {
  const organizationJsonLd = buildOrganizationJsonLd({tenant, locale, tenantPath});
  const navigationJsonLd = buildSiteNavigationJsonLd({
    navigation: headerNavigation,
    locale,
    tenantPath
  });

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
