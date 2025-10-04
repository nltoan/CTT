import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';

import {defaultLocale, locales} from '@i18n/config';

function normalizeSlug(slug?: string | string[]) {
  if (!slug) {
    return '';
  }

  if (Array.isArray(slug)) {
    return slug.join('/');
  }

  return slug.replace(/^\//, '');
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({message: 'Invalid JSON payload'}, {status: 400});
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({message: 'Invalid body'}, {status: 400});
  }

  const {secret, slug, tenant, collection, paths} = body as {
    secret?: string;
    slug?: string | string[];
    tenant?: string;
    collection?: string;
    paths?: string[];
  };

  const expectedSecret = process.env.REVALIDATE_SECRET ?? 'dev-secret';

  if (secret !== expectedSecret) {
    return NextResponse.json({message: 'Invalid token'}, {status: 401});
  }

  const tenantPath = tenant ? `/t/${tenant}` : '';
  const normalizedSlug = normalizeSlug(slug);

  const computedPaths: string[] = [];

  if (paths && Array.isArray(paths)) {
    computedPaths.push(
      ...paths
        .filter((path) => typeof path === 'string' && path.startsWith('/'))
        .map((path) => path.trim())
    );
  }

  for (const locale of locales) {
    const basePath = `/${locale}${tenantPath}`;
    if (!normalizedSlug) {
      computedPaths.push(basePath);
    } else {
      computedPaths.push(`${basePath}/${normalizedSlug}`.replace(/\/+/g, '/'));
    }

    if (collection === 'posts') {
      computedPaths.push(`${basePath}/news`);
      if (normalizedSlug) {
        computedPaths.push(`${basePath}/news/${normalizedSlug}`.replace(/\/+/g, '/'));
      }
    }

    if (collection === 'pages') {
      computedPaths.push(basePath);
    }

    if (collection === 'navigations' || collection === 'settings' || collection === 'tenants') {
      computedPaths.push(basePath);
    }
  }

  const uniquePaths = unique(
    computedPaths
      .map((path) => (path === '/' ? `/${defaultLocale}` : path))
      .map((path) => (path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path))
  );

  await Promise.all(uniquePaths.map((path) => revalidatePath(path)));

  return NextResponse.json({
    revalidated: true,
    paths: uniquePaths,
    timestamp: new Date().toISOString()
  });
}
