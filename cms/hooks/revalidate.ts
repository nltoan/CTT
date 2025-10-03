import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload/types';

const REVALIDATE_ENDPOINT = process.env.REVALIDATE_ENDPOINT;
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? 'dev-secret';

const triggerRevalidate = async (body: Record<string, unknown>) => {
  if (!REVALIDATE_ENDPOINT) {
    return;
  }

  try {
    await fetch(REVALIDATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body, secret: REVALIDATE_SECRET }),
    });
  } catch (error) {
    console.error('Failed to trigger revalidate', error);
  }
};

const extractTenant = (doc: any): string | undefined => {
  if (!doc) return undefined;
  if (typeof doc.tenant === 'string') return doc.tenant;
  if (typeof doc.tenant === 'object' && doc.tenant !== null) {
    return doc.tenant.id ?? doc.tenant.slug ?? doc.tenant.value;
  }
  if (doc.tenantId) return doc.tenantId;
  return undefined;
};

const extractLocales = (doc: any): string[] | undefined => {
  if (!doc) return undefined;
  if (doc.locale) {
    return [doc.locale];
  }
  if (Array.isArray(doc.locales)) {
    return doc.locales.filter(Boolean);
  }
  return undefined;
};

export const createCollectionRevalidateHooks = (collection: string) => {
  const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
    await triggerRevalidate({
      collection,
      slug: doc?.slug ?? doc?.id,
      tenant: extractTenant(doc),
      locales: extractLocales(doc),
      operation: 'change',
    });
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    await triggerRevalidate({
      collection,
      slug: doc?.slug ?? doc?.id,
      tenant: extractTenant(doc),
      locales: extractLocales(doc),
      operation: 'delete',
    });
  };

  return {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  };
};

export const settingsRevalidateHook: GlobalAfterChangeHook = async ({ doc }) => {
  await triggerRevalidate({
    collection: 'settings',
    tenant: extractTenant(doc),
    locales: extractLocales(doc),
    operation: 'change',
  });
  return doc;
};
