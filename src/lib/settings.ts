import {settings as settingsData} from '@data/settings';
import {defaultLocale} from '@i18n/config';
import type {
  AnalyticsSettings,
  CookieBannerSettings,
  SeoDefaults,
  SiteSettings
} from '@types/cms';

export const DEFAULT_REVALIDATE_SECONDS = 120;

export type ResolvedSiteSettings = {
  id: string;
  tenantId?: string;
  locale: 'vi' | 'en';
  seo: SeoDefaults;
  revalidateSeconds: number;
  analytics?: AnalyticsSettings;
  cookieBanner?: CookieBannerSettings;
};

function mergeSeo(base?: SeoDefaults, override?: SeoDefaults): SeoDefaults {
  return {
    defaultTitle: override?.defaultTitle ?? base?.defaultTitle,
    description: override?.description ?? base?.description,
    image: override?.image ?? base?.image,
    siteName: override?.siteName ?? base?.siteName,
    organizationName: override?.organizationName ?? base?.organizationName
  };
}

function mergeAnalytics(
  base?: AnalyticsSettings,
  override?: AnalyticsSettings
): AnalyticsSettings | undefined {
  if (!base && !override) {
    return undefined;
  }

  return {
    gaId: override?.gaId ?? base?.gaId,
    gtmId: override?.gtmId ?? base?.gtmId,
    metaPixelId: override?.metaPixelId ?? base?.metaPixelId,
    requiresConsent: override?.requiresConsent ?? base?.requiresConsent
  };
}

function mergeCookieBanner(
  base?: CookieBannerSettings,
  override?: CookieBannerSettings
): CookieBannerSettings | undefined {
  if (!base && !override) {
    return undefined;
  }

  return {
    enabled: override?.enabled ?? base?.enabled ?? false,
    message: override?.message ?? base?.message ?? '',
    acceptLabel: override?.acceptLabel ?? base?.acceptLabel,
    rejectLabel: override?.rejectLabel ?? base?.rejectLabel,
    moreInfoLabel: override?.moreInfoLabel ?? base?.moreInfoLabel,
    moreInfoUrl: override?.moreInfoUrl ?? base?.moreInfoUrl
  };
}

function pickSettings({
  tenantId,
  locale
}: {
  tenantId?: string;
  locale: 'vi' | 'en';
}) {
  const global = settingsData.find(
    (entry) => !entry.tenantId && entry.locale === locale
  )
    ?? settingsData.find((entry) => !entry.tenantId && entry.locale === defaultLocale);

  const tenantSpecific = tenantId
    ? settingsData.find(
        (entry) => entry.tenantId === tenantId && entry.locale === locale
      )
        ?? settingsData.find(
          (entry) => entry.tenantId === tenantId && entry.locale === defaultLocale
        )
    : undefined;

  return {global, tenantSpecific};
}

function resolveSettingsId(base?: SiteSettings, override?: SiteSettings, fallback?: string) {
  if (override?.id) {
    return override.id;
  }
  if (base?.id) {
    return base.id;
  }
  return fallback ?? 'settings-default';
}

export function getSettingsForTenant({
  tenantId,
  locale
}: {
  tenantId?: string;
  locale: 'vi' | 'en';
}): ResolvedSiteSettings {
  const {global, tenantSpecific} = pickSettings({tenantId, locale});

  const seo = mergeSeo(global?.seo, tenantSpecific?.seo);
  const analytics = mergeAnalytics(global?.analytics, tenantSpecific?.analytics);
  const cookieBanner = mergeCookieBanner(global?.cookieBanner, tenantSpecific?.cookieBanner);

  return {
    id: resolveSettingsId(global, tenantSpecific, tenantId ? `${tenantId}-${locale}` : locale),
    tenantId,
    locale,
    seo,
    analytics,
    cookieBanner,
    revalidateSeconds:
      tenantSpecific?.revalidateSeconds
        ?? global?.revalidateSeconds
        ?? DEFAULT_REVALIDATE_SECONDS
  };
}

export function getApiCacheTtl({
  tenantId,
  locale
}: {
  tenantId?: string;
  locale: 'vi' | 'en';
}) {
  return getSettingsForTenant({tenantId, locale}).revalidateSeconds;
}
