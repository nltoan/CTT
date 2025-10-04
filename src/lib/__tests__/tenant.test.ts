import {describe, expect, it} from 'vitest';

import {tenants} from '@data/tenants';
import {
  assertLocale,
  getDefaultTenant,
  getTenantThemeCssVariables,
  resolveTenantByHost,
  resolveTenantFromParams
} from '@lib/tenant';

describe('tenant utilities', () => {
  it('validates supported locales correctly', () => {
    expect(assertLocale('vi')).toBe(true);
    expect(assertLocale('en')).toBe(true);
    expect(assertLocale('jp')).toBe(false);
  });

  it('resolves tenant by known host', () => {
    const tenant = resolveTenantByHost('classic.cimfc.local:3000');
    expect(tenant.slug).toBe('classic');
  });

  it('falls back to default tenant for unknown host', () => {
    const tenant = resolveTenantByHost('unknown.example.com');
    expect(tenant.slug).toBe(getDefaultTenant().slug);
  });

  it('prefers tenant parameter over host when provided', () => {
    const tenant = resolveTenantFromParams({tenantParam: 'classic', host: 'cimfc.local'});
    expect(tenant.slug).toBe('classic');
  });

  it('returns host tenant when parameter is missing or invalid', () => {
    const tenant = resolveTenantFromParams({tenantParam: 'non-existent', host: 'cimfc.local'});
    expect(tenant.slug).toBe('main');
  });

  it('returns CSS variables for tenant theming', () => {
    const tenant = tenants[0];
    const cssVars = getTenantThemeCssVariables(tenant);
    expect(cssVars['--color-primary']).toBe(tenant.primaryColor);
    expect(cssVars['--font-display']).toContain('Display');
  });
});
