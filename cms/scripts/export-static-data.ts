import fs from 'fs';
import path from 'path';

import type {Field} from 'payload/types';

import {pageBuilderBlocks} from '../fields/blocks';
import {tenants as tenantData} from '@data/tenants';
import {navigations as navigationData} from '@data/navigations';
import {pages as pageData} from '@data/pages';
import {settings as settingsData} from '@data/settings';
import type {Navigation, NavigationItem, Page, SiteSettings} from '@types/cms';
import type {Block} from '@types/blocks';

type Locale = 'vi' | 'en';

const LOCALES: Locale[] = ['vi', 'en'];
const DEFAULT_LOCALE: Locale = 'vi';

const OUTPUT_PATH = path.resolve(__dirname, '../seed/static-payload.json');

type LocaleMap<T> = Partial<Record<Locale, T>>;

type BlockDefinition = (typeof pageBuilderBlocks)[number];

const blockDefinitionMap = new Map<string, BlockDefinition>(
  pageBuilderBlocks.map((block) => [block.slug, block])
);

type MediaReference = {
  id?: string;
  url: string;
  alt?: string;
  context: string;
};

const mediaReferences = new Map<string, MediaReference>();

function recordMedia(ref: unknown, context: string) {
  if (!ref || typeof ref !== 'object') {
    return;
  }

  const candidate = ref as {url?: unknown; alt?: unknown; id?: unknown};
  if (typeof candidate.url !== 'string') {
    return;
  }

  const key = `${candidate.url}::${context}`;
  if (mediaReferences.has(key)) {
    return;
  }

  mediaReferences.set(key, {
    context,
    url: candidate.url,
    alt: typeof candidate.alt === 'string' ? candidate.alt : undefined,
    id: typeof candidate.id === 'string' ? candidate.id : undefined
  });
}

function pickFirstDefined<T>(map: LocaleMap<T>, forced?: Locale): T | undefined {
  const order = forced
    ? [forced, ...LOCALES.filter((locale) => locale !== forced)]
    : LOCALES;

  for (const locale of order) {
    const value = map[locale];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function transformField(
  field: Field,
  valuesByLocale: LocaleMap<unknown>,
  context: string,
  forcedLocale?: Locale
): unknown {
  switch (field.type) {
    case 'array':
      return transformArray(field, valuesByLocale, context, forcedLocale);
    case 'group':
      return transformGroup(field, valuesByLocale, context, forcedLocale);
    case 'upload': {
      const sample = pickFirstDefined(valuesByLocale, forcedLocale);
      recordMedia(sample, context);
      return null;
    }
    case 'relationship': {
      const sample = pickFirstDefined(valuesByLocale, forcedLocale);
      if (field.hasMany) {
        if (!sample) return [];
        if (Array.isArray(sample)) return sample;
        return [sample];
      }
      return sample ?? null;
    }
    default:
      break;
  }

  if ('localized' in field && field.localized) {
    const locales = forcedLocale ? [forcedLocale] : LOCALES;
    const output: Record<string, unknown> = {};

    locales.forEach((locale) => {
      const value = valuesByLocale[locale];
      if (value !== undefined) {
        output[locale] = value;
      }
    });

    return Object.keys(output).length ? output : undefined;
  }

  return pickFirstDefined(valuesByLocale, forcedLocale);
}

function transformGroup(
  field: Field,
  valuesByLocale: LocaleMap<unknown>,
  context: string,
  forcedLocale?: Locale
): unknown {
  if (!('fields' in field) || !field.fields) {
    return undefined;
  }

  if ('localized' in field && field.localized) {
    if (forcedLocale) {
      const value = valuesByLocale[forcedLocale];
      if (!value || typeof value !== 'object') {
        return undefined;
      }

      const result: Record<string, unknown> = {};
      for (const child of field.fields) {
        if (!('name' in child) || !child.name) continue;
        const childValues: LocaleMap<unknown> = {
          [forcedLocale]: (value as Record<string, unknown>)[child.name]
        };
        const transformed = transformField(
          child,
          childValues,
          `${context}.${child.name}`,
          forcedLocale
        );
        if (transformed !== undefined) {
          result[child.name] = transformed;
        }
      }

      return Object.keys(result).length ? result : undefined;
    }

    const localizedResult: Record<string, unknown> = {};
    for (const locale of LOCALES) {
      const value = valuesByLocale[locale];
      if (!value || typeof value !== 'object') continue;

      const result: Record<string, unknown> = {};
      for (const child of field.fields) {
        if (!('name' in child) || !child.name) continue;
        const childValues: LocaleMap<unknown> = {
          [locale]: (value as Record<string, unknown>)[child.name]
        };
        const transformed = transformField(
          child,
          childValues,
          `${context}.${child.name}`,
          locale
        );
        if (transformed !== undefined) {
          result[child.name] = transformed;
        }
      }

      if (Object.keys(result).length) {
        localizedResult[locale] = result;
      }
    }

    return Object.keys(localizedResult).length ? localizedResult : undefined;
  }

  const result: Record<string, unknown> = {};
  for (const child of field.fields) {
    if (!('name' in child) || !child.name) continue;

    const childValues: LocaleMap<unknown> = {};
    for (const locale of LOCALES) {
      const value = valuesByLocale[locale];
      if (!value || typeof value !== 'object') continue;
      childValues[locale] = (value as Record<string, unknown>)[child.name];
    }

    const transformed = transformField(
      child,
      childValues,
      `${context}.${child.name}`,
      forcedLocale
    );
    if (transformed !== undefined) {
      result[child.name] = transformed;
    }
  }

  return Object.keys(result).length ? result : undefined;
}

function transformArray(
  field: Field,
  valuesByLocale: LocaleMap<unknown>,
  context: string,
  forcedLocale?: Locale
): unknown {
  if (!('fields' in field) || !field.fields) {
    return undefined;
  }

  if ('localized' in field && field.localized) {
    const localizedResult: Record<string, unknown[]> = {};
    for (const locale of LOCALES) {
      const entries = valuesByLocale[locale];
      if (!Array.isArray(entries)) continue;

      localizedResult[locale] = entries.map((entry, index) =>
        transformArrayRow(
          field.fields!,
          {[locale]: entry},
          `${context}[${index}]`,
          locale
        )
      );
    }

    return Object.keys(localizedResult).length ? localizedResult : undefined;
  }

  const maxLength = Math.max(
    ...LOCALES.map((locale) =>
      Array.isArray(valuesByLocale[locale])
        ? (valuesByLocale[locale] as unknown[]).length
        : 0
    )
  );

  const result: unknown[] = [];
  for (let index = 0; index < maxLength; index += 1) {
    const rowValues: LocaleMap<unknown> = {};
    for (const locale of LOCALES) {
      const entries = valuesByLocale[locale];
      if (!Array.isArray(entries)) continue;
      if (entries[index] === undefined) continue;
      rowValues[locale] = entries[index];
    }

    result.push(
      transformArrayRow(field.fields!, rowValues, `${context}[${index}]`, forcedLocale)
    );
  }

  return result;
}

function transformArrayRow(
  fields: Field[],
  valuesByLocale: LocaleMap<unknown>,
  context: string,
  forcedLocale?: Locale
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const sample = pickFirstDefined(valuesByLocale, forcedLocale);
  if (sample && typeof sample === 'object' && 'id' in sample) {
    const candidateId = (sample as {id?: unknown}).id;
    if (typeof candidateId === 'string') {
      result.id = candidateId;
    }
  }

  for (const field of fields) {
    if (!('name' in field) || !field.name) continue;

    const childValues: LocaleMap<unknown> = {};
    for (const locale of LOCALES) {
      const value = valuesByLocale[locale];
      if (!value || typeof value !== 'object') continue;
      childValues[locale] = (value as Record<string, unknown>)[field.name];
    }

    const transformed = transformField(
      field,
      childValues,
      `${context}.${field.name}`,
      forcedLocale
    );

    if (transformed !== undefined) {
      result[field.name] = transformed;
    }
  }

  return result;
}

function convertBlocks(blocksByLocale: LocaleMap<Block[]>, context: string) {
  const maxLength = Math.max(
    ...LOCALES.map((locale) => blocksByLocale[locale]?.length ?? 0)
  );

  const result: Record<string, unknown>[] = [];
  for (let index = 0; index < maxLength; index += 1) {
    const perLocale: LocaleMap<Block> = {};
    for (const locale of LOCALES) {
      const entries = blocksByLocale[locale];
      if (!entries || !entries[index]) continue;
      perLocale[locale] = entries[index];
    }

    const sample = pickFirstDefined(perLocale);
    if (!sample) continue;

    const definition = blockDefinitionMap.get(sample.type);
    if (!definition) {
      // eslint-disable-next-line no-console
      console.warn(`Bỏ qua block không xác định: ${sample.type}`);
      continue;
    }

    const blockEntry: Record<string, unknown> = {blockType: sample.type};
    if ('id' in sample && typeof sample.id === 'string') {
      blockEntry.id = sample.id;
    }

    if (definition.fields) {
      for (const field of definition.fields) {
        if (!('name' in field) || !field.name) continue;
        const valueMap: LocaleMap<unknown> = {};
        for (const locale of LOCALES) {
          const block = perLocale[locale];
          if (!block) continue;
          valueMap[locale] = (block as Record<string, unknown>)[field.name];
        }

        const transformed = transformField(
          field as Field,
          valueMap,
          `${context}.${sample.type}.${field.name}`
        );

        if (transformed !== undefined) {
          blockEntry[field.name] = transformed;
        }
      }
    }

    result.push(blockEntry);
  }

  return result;
}

type PageGroup = {
  tenantId: string;
  translationKey: string;
  slug: string;
  locales: LocaleMap<Page>;
};

function groupPages(entries: Page[]): PageGroup[] {
  const map = new Map<string, PageGroup>();

  for (const entry of entries) {
    const key = `${entry.tenantId}::${entry.translationKey}`;
    const existing = map.get(key);

    if (existing) {
      existing.locales[entry.locale] = entry;
      if (!existing.slug && entry.slug) {
        existing.slug = entry.slug;
      }
      continue;
    }

    map.set(key, {
      tenantId: entry.tenantId,
      translationKey: entry.translationKey,
      slug: entry.slug,
      locales: {[entry.locale]: entry}
    });
  }

  return Array.from(map.values());
}

function buildLocalizedValue<T>(
  locales: LocaleMap<Page>,
  selector: (page: Page) => T | undefined
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const locale of LOCALES) {
    const entry = locales[locale];
    if (!entry) continue;
    const value = selector(entry);
    if (value !== undefined && value !== null) {
      result[locale] = value;
    }
  }

  return result;
}

function convertPageGroup(group: PageGroup) {
  const blocksByLocale: LocaleMap<Block[]> = {};
  for (const locale of LOCALES) {
    const entry = group.locales[locale];
    if (entry) {
      blocksByLocale[locale] = entry.blocks;
    }
  }

  const seoTitle = buildLocalizedValue(group.locales, (page) => page.seo?.title ?? page.title);
  const seoDescription = buildLocalizedValue(
    group.locales,
    (page) => page.seo?.description
  );

  const title = buildLocalizedValue(group.locales, (page) => page.title);

  const publishedAt = pickFirstDefined(
    Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        group.locales[locale]?.publishedAt ?? group.locales[locale]?.updatedAt
      ])
    ) as LocaleMap<string>
  ) ?? new Date().toISOString();

  return {
    tenant: group.tenantId,
    translationKey: group.translationKey,
    slug: group.slug,
    title,
    status: 'published',
    publishedAt,
    blocks: convertBlocks(blocksByLocale, `pages.${group.translationKey}`),
    seo: {
      title: seoTitle,
      description: seoDescription
    }
  };
}

type NavigationGroup = {
  tenantId: string;
  key: Navigation['key'];
  locales: LocaleMap<Navigation>;
};

function groupNavigations(entries: Navigation[]): NavigationGroup[] {
  const map = new Map<string, NavigationGroup>();

  for (const entry of entries) {
    const key = `${entry.tenantId}::${entry.key}`;
    const existing = map.get(key);
    if (existing) {
      existing.locales[entry.locale] = entry;
      continue;
    }

    map.set(key, {
      tenantId: entry.tenantId,
      key: entry.key,
      locales: {[entry.locale]: entry}
    });
  }

  return Array.from(map.values());
}

function convertNavigationGroup(group: NavigationGroup) {
  type ItemLocale = LocaleMap<NavigationItem> & {order?: number};
  const itemMap = new Map<string, ItemLocale>();

  for (const locale of LOCALES) {
    const nav = group.locales[locale];
    if (!nav) continue;

    nav.items.forEach((item, index) => {
      const existing = itemMap.get(item.id);
      if (existing) {
        existing[locale] = item;
        if (item.order !== undefined) existing.order = item.order;
        return;
      }

      itemMap.set(item.id, {
        [locale]: item,
        order: item.order ?? index
      });
    });
  }

  const items = Array.from(itemMap.values())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((entry, index) => {
      const label: Record<string, string> = {};
      for (const locale of LOCALES) {
        const item = entry[locale];
        if (item?.label) {
          label[locale] = item.label;
        }
      }

      const href = pickFirstDefined(
        Object.fromEntries(
          LOCALES.map((locale) => [locale, entry[locale]?.href])
        ) as LocaleMap<string>,
        DEFAULT_LOCALE
      );

      return {
        link: {
          label,
          type: 'custom',
          url: href ?? '#',
          newTab: false
        },
        order: entry.order ?? index,
        children: [] as unknown[]
      };
    });

  return {
    tenant: group.tenantId,
    key: group.key,
    items
  };
}

function convertTenants() {
  return tenantData.map((tenant) => {
    if (tenant.logoUrl) {
      recordMedia(
        {url: tenant.logoUrl},
        `tenant.${tenant.slug}.logo`
      );
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      description: tenant.description,
      status: 'active',
      domain: tenant.domain,
      subdomain: tenant.slug,
      locales: tenant.locales,
      theme: {
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        accentColor: tenant.accentColor,
        fontHeading: tenant.fontDisplay,
        fontBody: tenant.fontBody
      },
      socialLinks: tenant.socialLinks?.map((link, index) => ({
        id: link.id ?? `${tenant.slug}-social-${index}`,
        label: link.label,
        platform: link.platform,
        url: link.url
      })) ?? []
    };
  });
}

function convertSettings() {
  const globalEntries = settingsData.filter((entry) => !entry.tenantId);
  const globalByLocale: LocaleMap<SiteSettings> = {};
  for (const entry of globalEntries) {
    globalByLocale[entry.locale] = entry;
    if (entry.seo?.image) {
      recordMedia(
        {url: entry.seo.image},
        `settings.global.${entry.locale}.seoImage`
      );
    }
  }

  const globalSeoTitle: Record<string, string> = {};
  const globalSeoDescription: Record<string, string> = {};
  for (const locale of LOCALES) {
    const entry = globalByLocale[locale];
    if (entry?.seo?.defaultTitle) {
      globalSeoTitle[locale] = entry.seo.defaultTitle;
    }
    if (entry?.seo?.description) {
      globalSeoDescription[locale] = entry.seo.description;
    }
  }

  const globalAnalytics = pickFirstDefined(
    Object.fromEntries(
      LOCALES.map((locale) => [locale, globalByLocale[locale]?.analytics])
    ) as LocaleMap<SiteSettings['analytics']>
  );

  const globalCookieBanner = (() => {
    const message: Record<string, string> = {};
    const acceptLabel: Record<string, string> = {};
    const rejectLabel: Record<string, string> = {};
    const moreInfoLabel: Record<string, string> = {};
    let moreInfoUrl: string | undefined;

    for (const locale of LOCALES) {
      const banner = globalByLocale[locale]?.cookieBanner;
      if (!banner) continue;
      if (banner.message) message[locale] = banner.message;
      if (banner.acceptLabel) acceptLabel[locale] = banner.acceptLabel;
      if (banner.rejectLabel) rejectLabel[locale] = banner.rejectLabel;
      if (banner.moreInfoLabel) moreInfoLabel[locale] = banner.moreInfoLabel;
      if (!moreInfoUrl && banner.moreInfoUrl) moreInfoUrl = banner.moreInfoUrl;
    }

    return {
      enabled: pickFirstDefined(
        Object.fromEntries(
          LOCALES.map((locale) => [locale, globalByLocale[locale]?.cookieBanner?.enabled])
        ) as LocaleMap<boolean>,
        DEFAULT_LOCALE
      ) ?? true,
      message,
      acceptLabel,
      rejectLabel,
      moreInfoLabel,
      moreInfoUrl
    };
  })();

  const tenantOverrides = settingsData
    .filter((entry) => entry.tenantId)
    .reduce<Record<string, LocaleMap<SiteSettings>>>((acc, entry) => {
      if (!entry.tenantId) return acc;
      acc[entry.tenantId] = acc[entry.tenantId] ?? {};
      acc[entry.tenantId]![entry.locale] = entry;
      if (entry.seo?.image) {
        recordMedia(
          {url: entry.seo.image},
          `settings.${entry.tenantId}.${entry.locale}.seoImage`
        );
      }
      return acc;
    }, {});

  const overrides = Object.entries(tenantOverrides).map(([tenantId, locales]) => {
    const seoTitle: Record<string, string> = {};
    const seoDescription: Record<string, string> = {};
    for (const locale of LOCALES) {
      const entry = locales[locale];
      if (!entry?.seo) continue;
      if (entry.seo.defaultTitle) seoTitle[locale] = entry.seo.defaultTitle;
      if (entry.seo.description) seoDescription[locale] = entry.seo.description;
    }

    const analytics = pickFirstDefined(
      Object.fromEntries(
        LOCALES.map((locale) => [locale, locales[locale]?.analytics])
      ) as LocaleMap<SiteSettings['analytics']>,
      DEFAULT_LOCALE
    );

    const banner = (() => {
      const message: Record<string, string> = {};
      const acceptLabel: Record<string, string> = {};
      const rejectLabel: Record<string, string> = {};
      const moreInfoLabel: Record<string, string> = {};
      let moreInfoUrl: string | undefined;

      for (const locale of LOCALES) {
        const entry = locales[locale]?.cookieBanner;
        if (!entry) continue;
        if (entry.message) message[locale] = entry.message;
        if (entry.acceptLabel) acceptLabel[locale] = entry.acceptLabel;
        if (entry.rejectLabel) rejectLabel[locale] = entry.rejectLabel;
        if (entry.moreInfoLabel) moreInfoLabel[locale] = entry.moreInfoLabel;
        if (!moreInfoUrl && entry.moreInfoUrl) {
          moreInfoUrl = entry.moreInfoUrl;
        }
      }

      if (!Object.keys(message).length && !Object.keys(acceptLabel).length) {
        return undefined;
      }

      return {
        enabled: pickFirstDefined(
          Object.fromEntries(
            LOCALES.map((locale) => [locale, locales[locale]?.cookieBanner?.enabled])
          ) as LocaleMap<boolean>,
          DEFAULT_LOCALE
        ),
        message,
        acceptLabel,
        rejectLabel,
        moreInfoLabel,
        moreInfoUrl
      };
    })();

    return {
      tenant: tenantId,
      seo: {
        title: seoTitle,
        description: seoDescription
      },
      analytics: analytics ?? undefined,
      cookieBanner: banner
    };
  });

  const revalidateSeconds = pickFirstDefined(
    Object.fromEntries(
      LOCALES.map((locale) => [locale, globalByLocale[locale]?.revalidateSeconds])
    ) as LocaleMap<number>,
    DEFAULT_LOCALE
  ) ?? 120;

  return {
    seo: {
      title: globalSeoTitle,
      description: globalSeoDescription
    },
    analytics: globalAnalytics ?? undefined,
    cookieBanner: globalCookieBanner,
    revalidateSeconds,
    tenantOverrides: overrides
  };
}

function ensureOutputDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
}

function main() {
  const tenants = convertTenants();
  const navigations = groupNavigations(navigationData).map(convertNavigationGroup);
  const pages = groupPages(pageData).map(convertPageGroup);
  const settings = convertSettings();

  const output = {
    generatedAt: new Date().toISOString(),
    locales: LOCALES,
    tenants,
    navigations,
    pages,
    settings,
    media: Array.from(mediaReferences.values())
  };

  ensureOutputDir(OUTPUT_PATH);
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Đã tạo snapshot dữ liệu Payload: ${OUTPUT_PATH}`);
}

main();
