import {SiteFooter} from './SiteFooter';
import {SiteHeader} from './SiteHeader';

import type {Navigation, Tenant} from '@types/cms';
import {getTenantThemeCssVariables} from '@lib/tenant';

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
    </div>
  );
}
