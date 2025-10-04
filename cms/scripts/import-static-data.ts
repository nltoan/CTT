import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import payload from 'payload';

import payloadConfig from '../payload.config';

dotenv.config();

type Locale = 'vi' | 'en';

type SnapshotTenant = {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  status?: 'active' | 'paused' | 'draft';
  domain?: string;
  subdomain?: string;
  locales: Locale[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontHeading?: string;
    fontBody?: string;
  };
  socialLinks?: Array<{
    id?: string;
    label?: string;
    platform?: string;
    url?: string;
  }>;
};

type SnapshotNavigation = {
  tenant: string;
  key: string;
  items: Array<{
    id?: string;
    order?: number;
    link: {
      label?: Record<Locale, string>;
      type: string;
      url?: string;
      newTab?: boolean;
    };
    children?: Array<{
      id?: string;
      link: {
        label?: Record<Locale, string>;
        type: string;
        url?: string;
        newTab?: boolean;
      };
      description?: Record<Locale, string>;
    }>;
  }>;
};

type SnapshotBlock = Record<string, unknown> & {blockType: string};

type SnapshotPage = {
  tenant: string;
  translationKey: string;
  slug: string;
  title: Record<Locale, string>;
  status?: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  blocks: SnapshotBlock[];
  seo?: {
    title?: Record<Locale, string>;
    description?: Record<Locale, string>;
  };
};

type SnapshotSettings = {
  seo?: {
    title?: Record<Locale, string>;
    description?: Record<Locale, string>;
  };
  analytics?: {
    gaId?: string;
    gtmId?: string;
    metaPixelId?: string;
    requiresConsent?: boolean;
  };
  cookieBanner?: {
    enabled?: boolean;
    message?: Record<Locale, string>;
    acceptLabel?: Record<Locale, string>;
    rejectLabel?: Record<Locale, string>;
    moreInfoLabel?: Record<Locale, string>;
    moreInfoUrl?: string;
  };
  revalidateSeconds?: number;
  tenantOverrides?: Array<{
    tenant: string;
    seo?: {
      title?: Record<Locale, string>;
      description?: Record<Locale, string>;
    };
    analytics?: {
      gaId?: string;
      gtmId?: string;
      metaPixelId?: string;
      requiresConsent?: boolean;
    };
    cookieBanner?: {
      enabled?: boolean;
      message?: Record<Locale, string>;
      acceptLabel?: Record<Locale, string>;
      rejectLabel?: Record<Locale, string>;
      moreInfoLabel?: Record<Locale, string>;
      moreInfoUrl?: string;
    };
  }>;
};

type Snapshot = {
  generatedAt?: string;
  locales?: Locale[];
  tenants?: SnapshotTenant[];
  navigations?: SnapshotNavigation[];
  pages?: SnapshotPage[];
  settings?: SnapshotSettings;
  media?: Array<{
    url: string;
    alt?: string;
    context?: string;
  }>;
};

type ImportOptions = {
  filePath: string;
  dryRun: boolean;
};

type SummaryCounters = {
  created: number;
  updated: number;
  skipped: number;
};

type ImportSummary = {
  tenants: SummaryCounters;
  pages: SummaryCounters;
  navigations: SummaryCounters;
  settings: boolean;
  missingTenants: Set<string>;
};

const DEFAULT_SNAPSHOT_PATH = path.resolve(__dirname, '../seed/static-payload.json');

function parseArgs(): ImportOptions {
  const args = process.argv.slice(2);
  let filePath = DEFAULT_SNAPSHOT_PATH;
  let dryRun = false;

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg.startsWith('--file=')) {
      const value = arg.slice('--file='.length);
      filePath = path.resolve(process.cwd(), value);
    }
  }

  return {filePath, dryRun};
}

function readSnapshot(filePath: string): Snapshot {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file snapshot: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw) as Snapshot;
  } catch (error) {
    throw new Error(`Không thể parse JSON từ ${filePath}: ${(error as Error).message}`);
  }
}

function sanitize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

type TenantIdMap = Map<string, string>;

type UpsertResult = {
  action: 'created' | 'updated' | 'skipped';
  cmsId: string;
};

async function upsertTenant(
  entry: SnapshotTenant,
  tenantIds: TenantIdMap,
  options: ImportOptions
): Promise<UpsertResult> {
  const identifier = entry.slug;
  const targetId = entry.id ?? identifier;

  const registerMapping = (cmsId: string) => {
    tenantIds.set(targetId, cmsId);
    tenantIds.set(identifier, cmsId);
  };

  if (options.dryRun) {
    const cmsId = targetId;
    registerMapping(cmsId);
    // eslint-disable-next-line no-console
    console.log(`[dry-run] Tenant ${identifier} sẽ được upsert`);
    return {action: 'skipped', cmsId};
  }

  const payloadInstance = payload;
  const existing = await payloadInstance.find({
    collection: 'tenants',
    limit: 1,
    locale: 'vi',
    where: {
      slug: {
        equals: identifier
      }
    }
  });

  const data = sanitize({
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    status: entry.status ?? 'active',
    domain: entry.domain,
    subdomain: entry.subdomain ?? entry.slug,
    locales: entry.locales,
    theme: entry.theme,
    socialLinks: entry.socialLinks
  });

  if (existing.total > 0) {
    const updated = await payloadInstance.update({
      collection: 'tenants',
      id: existing.docs[0].id,
      locale: 'all',
      data
    });
    const cmsId = updated.id as string;
    registerMapping(cmsId);
    return {action: 'updated', cmsId};
  }

  const created = await payloadInstance.create({
    collection: 'tenants',
    locale: 'all',
    data
  });
  const cmsId = created.id as string;
  registerMapping(cmsId);
  return {action: 'created', cmsId};
}

async function upsertNavigation(
  entry: SnapshotNavigation,
  tenantIds: TenantIdMap,
  options: ImportOptions
): Promise<'created' | 'updated' | 'skipped'> {
  const tenantId = tenantIds.get(entry.tenant);

  if (!tenantId) {
    return 'skipped';
  }

  if (options.dryRun) {
    // eslint-disable-next-line no-console
    console.log(`[dry-run] Navigation ${entry.key} (${entry.tenant}) sẽ được upsert`);
    return 'skipped';
  }

  const payloadInstance = payload;
  const existing = await payloadInstance.find({
    collection: 'navigations',
    limit: 1,
    locale: 'all',
    where: {
      and: [
        { key: { equals: entry.key } },
        { tenant: { equals: tenantId } }
      ]
    }
  });

  const data = sanitize({
    key: entry.key,
    tenant: tenantId,
    items: entry.items?.map((item) => ({
      id: item.id,
      order: item.order,
      link: item.link,
      children: item.children?.map((child) => ({
        id: child.id,
        link: child.link,
        description: child.description
      })) ?? []
    })) ?? []
  });

  if (existing.total > 0) {
    await payloadInstance.update({
      collection: 'navigations',
      id: existing.docs[0].id,
      locale: 'all',
      data
    });
    return 'updated';
  }

  await payloadInstance.create({
    collection: 'navigations',
    locale: 'all',
    data
  });
  return 'created';
}

async function upsertPage(
  entry: SnapshotPage,
  tenantIds: TenantIdMap,
  options: ImportOptions
): Promise<'created' | 'updated' | 'skipped'> {
  const tenantId = tenantIds.get(entry.tenant);

  if (!tenantId) {
    return 'skipped';
  }

  if (options.dryRun) {
    // eslint-disable-next-line no-console
    console.log(`[dry-run] Page ${entry.translationKey} (${entry.slug}) sẽ được upsert`);
    return 'skipped';
  }

  const payloadInstance = payload;
  const existing = await payloadInstance.find({
    collection: 'pages',
    limit: 1,
    locale: 'all',
    where: {
      and: [
        { translationKey: { equals: entry.translationKey } },
        { tenant: { equals: tenantId } }
      ]
    }
  });

  const data = sanitize({
    slug: entry.slug,
    translationKey: entry.translationKey,
    title: entry.title,
    tenant: tenantId,
    status: entry.status ?? 'published',
    publishedAt: entry.publishedAt,
    blocks: entry.blocks,
    seo: entry.seo
  });

  if (existing.total > 0) {
    await payloadInstance.update({
      collection: 'pages',
      id: existing.docs[0].id,
      locale: 'all',
      data
    });
    return 'updated';
  }

  await payloadInstance.create({
    collection: 'pages',
    locale: 'all',
    data
  });
  return 'created';
}

async function updateSettings(
  settings: SnapshotSettings,
  tenantIds: TenantIdMap,
  options: ImportOptions,
  summary: ImportSummary
) {
  if (!settings) {
    return;
  }

  const overrides = settings.tenantOverrides?.map((override) => {
    const tenantId = tenantIds.get(override.tenant);
    if (!tenantId) {
      summary.missingTenants.add(override.tenant);
      return null;
    }

    return {
      ...override,
      tenant: tenantId
    };
  }).filter(Boolean) as Required<SnapshotSettings>['tenantOverrides'];

  const data = sanitize({
    seo: settings.seo,
    analytics: settings.analytics,
    cookieBanner: settings.cookieBanner,
    revalidateSeconds: settings.revalidateSeconds,
    tenantOverrides: overrides
  });

  if (options.dryRun) {
    // eslint-disable-next-line no-console
    console.log('[dry-run] Settings sẽ được cập nhật');
    summary.settings = true;
    return;
  }

  await payload.updateGlobal({
    slug: 'settings',
    locale: 'all',
    data
  });
  summary.settings = true;
}

function createEmptySummary(): ImportSummary {
  return {
    tenants: {created: 0, updated: 0, skipped: 0},
    pages: {created: 0, updated: 0, skipped: 0},
    navigations: {created: 0, updated: 0, skipped: 0},
    settings: false,
    missingTenants: new Set<string>()
  };
}

function logSummary(summary: ImportSummary) {
  const report = {
    tenants: summary.tenants,
    pages: summary.pages,
    navigations: summary.navigations,
    settingsUpdated: summary.settings,
    missingTenantReferences: Array.from(summary.missingTenants)
  };

  // eslint-disable-next-line no-console
  console.table(report);
}

async function main() {
  const options = parseArgs();
  const snapshot = readSnapshot(options.filePath);
  const summary = createEmptySummary();

  if (!snapshot.tenants?.length) {
    throw new Error('Snapshot không chứa dữ liệu tenants. Không thể import.');
  }

  const tenantIds: TenantIdMap = new Map();

  if (!options.dryRun) {
    await payload.init({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET || 'import-script-secret',
      local: true
    });
  }

  for (const tenant of snapshot.tenants) {
    const result = await upsertTenant(tenant, tenantIds, options);
    summary.tenants[result.action] += 1;
  }

  if (snapshot.navigations) {
    for (const navigation of snapshot.navigations) {
      const action = await upsertNavigation(navigation, tenantIds, options);
      summary.navigations[action] += 1;
      if (action === 'skipped' && !tenantIds.has(navigation.tenant)) {
        summary.missingTenants.add(navigation.tenant);
      }
    }
  }

  if (snapshot.pages) {
    for (const page of snapshot.pages) {
      const action = await upsertPage(page, tenantIds, options);
      summary.pages[action] += 1;
      if (action === 'skipped' && !tenantIds.has(page.tenant)) {
        summary.missingTenants.add(page.tenant);
      }
    }
  }

  if (snapshot.settings) {
    await updateSettings(snapshot.settings, tenantIds, options, summary);
  }

  if (snapshot.media?.length) {
    // eslint-disable-next-line no-console
    console.log(
      `\nGhi chú media (${snapshot.media.length} mục): hãy upload thủ công lên S3/R2 và liên kết lại trong CMS nếu cần.`
    );
  }

  logSummary(summary);

  if (!options.dryRun) {
    await payload.close?.();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
