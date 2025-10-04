import type {Metadata} from 'next';

import type {Navigation, Page, Post, Tenant, Event, Person, Sponsor, Gallery, Discipline} from '@types/cms';
import type {ResolvedSiteSettings} from '@lib/settings';
import type {SearchResponse} from './search';
import {findPageTranslations} from '@data/pages';
import {findPostTranslations} from '@data/posts';
import {findEventTranslations} from '@data/events';
import {findGalleryTranslations} from '@data/galleries';
import {findPersonTranslations} from '@data/people';
import {findDisciplineTranslations} from '@data/disciplines';

const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1485579149621-3123dd979885';
const LOCALE_TO_BCP47: Record<'vi' | 'en', string> = {
  vi: 'vi-VN',
  en: 'en-US'
};

function getTenantPathSegments(tenantPath?: string) {
  if (!tenantPath) {
    return [] as string[];
  }
  return tenantPath.replace(/^\//, '').split('/').filter(Boolean);
}

function toSlugSegments(slug?: string | string[]) {
  if (!slug) {
    return [] as string[];
  }
  if (Array.isArray(slug)) {
    return slug.flatMap((segment) => segment.split('/')).filter(Boolean);
  }
  return slug.split('/').filter(Boolean);
}

export function mapLocaleToBcp47(locale: 'vi' | 'en') {
  return LOCALE_TO_BCP47[locale] ?? locale;
}

export function getBaseUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://ctt.example.com';
  return value.replace(/\/$/, '');
}

export function buildAbsoluteUrl(path: string) {
  const baseUrl = getBaseUrl();
  try {
    return new URL(path, baseUrl).toString();
  } catch (error) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  }
}

export function buildPath({
  locale,
  tenantPath,
  slugSegments
}: {
  locale: 'vi' | 'en';
  tenantPath?: string;
  slugSegments?: string[];
}) {
  const segments = [locale, ...getTenantPathSegments(tenantPath), ...(slugSegments ?? [])].filter(Boolean);
  if (segments.length === 0) {
    return '/';
  }
  return `/${segments.join('/')}`.replace(/\/$/, '');
}

function uniqueImages(urls: (string | undefined)[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const url of urls) {
    if (!url) {
      continue;
    }
    if (!seen.has(url)) {
      seen.add(url);
      result.push(url);
    }
  }

  return result;
}

export function buildOgImagePath({
  locale,
  tenantPath,
  slugSegments
}: {
  locale: 'vi' | 'en';
  tenantPath?: string;
  slugSegments?: string[];
}) {
  const basePath = buildPath({locale, tenantPath, slugSegments});
  const trimmed = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const prefix = trimmed === '/' ? '' : trimmed;
  const path = `${prefix}/opengraph-image`;
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildOgImageUrl(args: {
  locale: 'vi' | 'en';
  tenantPath?: string;
  slugSegments?: string[];
}) {
  return buildAbsoluteUrl(buildOgImagePath(args));
}

function composeOgImages({
  primary,
  fallback,
  ogImageUrl
}: {
  primary?: string;
  fallback?: string;
  ogImageUrl: string;
}) {
  const images = uniqueImages([primary, ogImageUrl, fallback]);
  if (images.length === 0) {
    return [DEFAULT_OG_IMAGE];
  }
  return images;
}

function resolveImage(image?: string, tenant?: Tenant, fallback?: string) {
  return image ?? fallback ?? tenant?.logoUrl ?? DEFAULT_OG_IMAGE;
}

export function createPageMetadata({
  page,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  page: Page;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}): Metadata {
  const slugSegments = toSlugSegments(page.slug);
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const title = page.seo?.title ?? defaults.defaultTitle ?? page.title;
  const description = page.seo?.description ?? defaults.description ?? tenant.description ?? '';
  const translations = findPageTranslations({
    tenantId: page.tenantId,
    translationKey: page.translationKey
  });
  const alternateLanguages = Object.fromEntries(
    translations.map((translation) => {
      const path = buildPath({
        locale: translation.locale,
        tenantPath,
        slugSegments: toSlugSegments(translation.slug)
      });
      return [translation.locale, buildAbsoluteUrl(path)];
    })
  );

  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    primary: page.seo?.image,
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;
  const siteName = defaults.siteName ?? tenant.name;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName,
      locale: mapLocaleToBcp47(locale),
      images: images.map((url) => ({url}))
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function createCollectionMetadata({
  tenant,
  locale,
  tenantPath,
  slugSegments,
  title,
  description,
  settings,
  searchParams
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  slugSegments: string[];
  title: string;
  description: string;
  settings?: ResolvedSiteSettings;
  searchParams?: Record<string, string>;
}): Metadata {
  const basePath = buildPath({locale, tenantPath, slugSegments});
  const queryEntries = Object.entries(searchParams ?? {}).filter(([, value]) =>
    Boolean(value?.trim())
  ) as [string, string][];
  const queryString = queryEntries.length ? `?${new URLSearchParams(queryEntries).toString()}` : '';
  const canonicalPath = `${basePath}${queryString}`;
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;
  const siteName = defaults.siteName ?? tenant.name;
  const alternateLanguages = Object.fromEntries(
    tenant.locales.map((availableLocale) => {
      const path = buildPath({
        locale: availableLocale,
        tenantPath,
        slugSegments
      });
      const localizedPath = `${path}${queryString}`;
      return [availableLocale, buildAbsoluteUrl(localizedPath)];
    })
  );

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName,
      locale: mapLocaleToBcp47(locale),
      images: images.map((url) => ({url}))
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function createPostMetadata({
  post,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  post: Post;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}): Metadata {
  const slugSegments = ['news', post.slug];
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const description = post.excerpt ?? defaults.description ?? tenant.description ?? '';
  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    primary: post.coverImage,
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;
  const translations = findPostTranslations({
    tenantId: post.tenantId,
    translationKey: post.translationKey
  });
  const alternateLanguages = Object.fromEntries(
    translations.map((translation) => {
      const path = buildPath({
        locale: translation.locale,
        tenantPath,
        slugSegments: ['news', translation.slug]
      });
      return [translation.locale, buildAbsoluteUrl(path)];
    })
  );

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: post.title,
      description,
      siteName: defaults.siteName ?? tenant.name,
      locale: mapLocaleToBcp47(locale),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author ?? tenant.name],
      tags: post.tags,
      images: images.map((url) => ({url}))
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function createEventMetadata({
  event,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  event: Event;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}): Metadata {
  const slugSegments = ['events', event.slug];
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const description =
    event.summary ?? event.description ?? defaults.description ?? tenant.description ?? '';
  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    primary: event.coverImage,
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;
  const translations = findEventTranslations({
    translationKey: event.translationKey,
    eventId: event.id
  });
  const alternateLanguages = Object.fromEntries(
    translations.map((translation) => {
      const path = buildPath({
        locale: translation.locale,
        tenantPath,
        slugSegments: ['events', translation.slug]
      });
      return [translation.locale, buildAbsoluteUrl(path)];
    })
  );

  return {
    title: event.title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'event',
      url: canonicalUrl,
      title: event.title,
      description,
      siteName: defaults.siteName ?? tenant.name,
      locale: mapLocaleToBcp47(locale),
      images: images.map((url) => ({url})),
      startTime: event.startsAt,
      endTime: event.endsAt
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function createDisciplineMetadata({
  discipline,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  discipline: Discipline;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}): Metadata {
  const slugSegments = ['disciplines', discipline.slug];
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const description =
    discipline.shortDescription ?? discipline.description ?? defaults.description ?? tenant.description ?? '';
  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    primary: discipline.coverImage?.url,
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;
  const translations = findDisciplineTranslations({
    translationKey: discipline.translationKey,
    disciplineId: discipline.id
  });
  const alternateLanguages = Object.fromEntries(
    translations.map((translation) => {
      const path = buildPath({
        locale: translation.locale,
        tenantPath,
        slugSegments: ['disciplines', translation.slug]
      });
      return [translation.locale, buildAbsoluteUrl(path)];
    })
  );

  return {
    title: discipline.name,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: discipline.name,
      description,
      siteName: defaults.siteName ?? tenant.name,
      locale: mapLocaleToBcp47(locale),
      images: images.map((url) => ({url}))
    },
    twitter: {
      card: 'summary_large_image',
      title: discipline.name,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function createGalleryMetadata({
  gallery,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  gallery: Gallery;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}): Metadata {
  const slugSegments = ['galleries', gallery.slug];
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const description = gallery.description ?? defaults.description ?? tenant.description ?? '';
  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    primary: gallery.coverImage?.url,
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;
  const translations = findGalleryTranslations({
    translationKey: gallery.translationKey,
    galleryId: gallery.id
  });
  const alternateLanguages = Object.fromEntries(
    translations.map((translation) => {
      const path = buildPath({
        locale: translation.locale,
        tenantPath,
        slugSegments: ['galleries', translation.slug]
      });
      return [translation.locale, buildAbsoluteUrl(path)];
    })
  );

  return {
    title: gallery.title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: gallery.title,
      description,
      siteName: defaults.siteName ?? tenant.name,
      locale: mapLocaleToBcp47(locale),
      images: images.map((url) => ({url})),
      modifiedTime: gallery.updatedAt
    },
    twitter: {
      card: 'summary_large_image',
      title: gallery.title,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function buildOrganizationJsonLd({
  tenant,
  locale,
  tenantPath,
  settings
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  const url = buildAbsoluteUrl(buildPath({locale, tenantPath}));
  const defaults = settings?.seo ?? {};
  const logo = resolveImage(undefined, tenant, defaults.image);
  const name = defaults.organizationName ?? defaults.siteName ?? tenant.name;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: tenant.socialLinks?.map((link) => link.url) ?? []
  };
}

function hrefToSlugSegments(href: string) {
  if (!href || href === '/') {
    return [] as string[];
  }
  return href.replace(/^\//, '').split('/').filter(Boolean);
}

export function buildSiteNavigationJsonLd({
  navigation,
  locale,
  tenantPath
}: {
  navigation?: Navigation;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  if (!navigation || navigation.items.length === 0) {
    return null;
  }

  const itemListElement = navigation.items.map((item, index) => {
    const url = item.href.startsWith('http')
      ? item.href
      : buildAbsoluteUrl(
          buildPath({locale, tenantPath, slugSegments: hrefToSlugSegments(item.href)})
        );
    return {
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name: item.label,
      url
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement
  };
}

export function buildBreadcrumbJsonLd({
  locale,
  tenantPath,
  items
}: {
  locale: 'vi' | 'en';
  tenantPath: string;
  items: {name: string; slugSegments?: string[]}[];
}) {
  if (!items.length) {
    return null;
  }

  const itemListElement = items.map((item, index) => {
    const path = buildPath({
      locale,
      tenantPath,
      slugSegments: item.slugSegments ?? []
    });
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(path)
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

export function buildArticleJsonLd({
  post,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  post: Post;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  const canonicalPath = buildPath({locale, tenantPath, slugSegments: ['news', post.slug]});
  const url = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const image = resolveImage(post.coverImage, tenant, defaults.image);
  const organization = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const {['@context']: _context, ...affiliation} = organization as Record<string, unknown>;
  const description = post.excerpt ?? defaults.description ?? tenant.description ?? '';
  const authorName = post.author ?? defaults.organizationName ?? defaults.siteName ?? tenant.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: mapLocaleToBcp47(locale),
    mainEntityOfPage: url,
    image: [image],
    author: {
      '@type': 'Organization',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: organization.name,
      url: organization.url,
      logo: {
        '@type': 'ImageObject',
        url: organization.logo
      }
    }
  };
}

export function createPersonMetadata({
  person,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  person: Person;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}): Metadata {
  const canonicalPath = buildPath({locale, tenantPath, slugSegments: ['people', person.slug]});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const defaults = settings?.seo ?? {};
  const description = person.bio ?? defaults.description ?? tenant.description ?? '';
  const ogImageUrl = buildOgImageUrl({locale, tenantPath, slugSegments: ['people', person.slug]});
  const fallbackImage = resolveImage(undefined, tenant, defaults.image);
  const images = composeOgImages({
    primary: person.photo?.url,
    fallback: fallbackImage,
    ogImageUrl
  });
  const primaryImage = images[0] ?? ogImageUrl;

  const translations = findPersonTranslations({tenantId: person.tenantId, slug: person.slug});
  const alternateLanguages = Object.fromEntries(
    translations
      .filter((translation) => translation.locale !== locale)
      .map((translation) => [
        translation.locale,
        buildAbsoluteUrl(
          buildPath({locale: translation.locale, tenantPath, slugSegments: ['people', translation.slug]})
        )
      ])
  );

  return {
    title: `${person.name} – ${tenant.name}`,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'profile',
      url: canonicalUrl,
      title: person.name,
      description,
      siteName: defaults.siteName ?? tenant.name,
      locale: mapLocaleToBcp47(locale),
      images: images.map((url) => ({url})),
      updatedTime: person.updatedAt
    },
    twitter: {
      card: 'summary_large_image',
      title: person.name,
      description,
      images: [primaryImage]
    }
  } satisfies Metadata;
}

export function buildPeopleJsonLd({
  people,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  people: Person[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  if (!people.length) {
    return null;
  }

  const basePath = buildPath({locale, tenantPath, slugSegments: ['people']});
  const baseUrl = buildAbsoluteUrl(basePath);
  const defaults = settings?.seo ?? {};
  const listName = defaults.siteName ?? tenant.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: people.length,
    itemListElement: people.map((person, index) => ({
      '@type': 'Person',
      position: index + 1,
      name: person.name,
      jobTitle: person.title,
      description: person.bio,
      image: person.photo?.url,
      url: `${baseUrl}#person-${person.id}`
    }))
  };
}

export function buildPersonJsonLd({
  person,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  person: Person;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  const path = buildPath({locale, tenantPath, slugSegments: ['people', person.slug]});
  const url = buildAbsoluteUrl(path);
  const defaults = settings?.seo ?? {};
  const image = resolveImage(person.photo?.url, tenant, defaults.image);
  const organization = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const {['@context']: _context, ...affiliation} = organization as Record<string, unknown>;
  const sameAs = person.socialLinks?.map((link) => link.url).filter(Boolean) ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.title,
    description: person.bio,
    image,
    url,
    affiliation,
    award: person.achievements ?? [],
    knowsAbout: person.disciplines ?? [],
    sameAs,
    email: person.contactEmail,
    telephone: person.contactPhone
  };
}

export function buildSponsorsJsonLd({
  sponsors,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  sponsors: Sponsor[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  if (!sponsors.length) {
    return null;
  }

  const basePath = buildPath({locale, tenantPath, slugSegments: ['partners']});
  const baseUrl = buildAbsoluteUrl(basePath);
  const defaults = settings?.seo ?? {};
  const listName = `${defaults.siteName ?? tenant.name} sponsors`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: sponsors.length,
    itemListElement: sponsors.map((sponsor, index) => ({
      '@type': 'Organization',
      position: index + 1,
      name: sponsor.name,
      url: sponsor.url ?? baseUrl,
      image: sponsor.logo.url,
      description: sponsor.description,
      identifier: sponsor.tier
    }))
  };
}

export function buildNewsListJsonLd({
  posts,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  posts: Post[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  if (!posts.length) {
    return null;
  }

  const defaults = settings?.seo ?? {};
  const listName = `${defaults.siteName ?? tenant.name} news`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'Article',
      position: index + 1,
      name: post.title,
      url: buildAbsoluteUrl(
        buildPath({locale, tenantPath, slugSegments: ['news', post.slug]})
      ),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt
    }))
  };
}

export function buildGalleryListJsonLd({
  galleries,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  galleries: Gallery[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  if (!galleries.length) {
    return null;
  }

  const defaults = settings?.seo ?? {};
  const listName = `${defaults.siteName ?? tenant.name} galleries`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: galleries.length,
    itemListElement: galleries.map((gallery, index) => ({
      '@type': 'CollectionPage',
      position: index + 1,
      name: gallery.title,
      url: buildAbsoluteUrl(
        buildPath({locale, tenantPath, slugSegments: ['galleries', gallery.slug]})
      ),
      dateModified: gallery.updatedAt
    }))
  };
}

export function buildDisciplinesListJsonLd({
  disciplines,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  disciplines: Discipline[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  if (!disciplines.length) {
    return null;
  }

  const defaults = settings?.seo ?? {};
  const listName = `${defaults.siteName ?? tenant.name} disciplines`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: disciplines.length,
    itemListElement: disciplines.map((discipline, index) => ({
      '@type': 'Course',
      position: index + 1,
      name: discipline.name,
      description: discipline.shortDescription ?? discipline.description,
      url: buildAbsoluteUrl(
        buildPath({locale, tenantPath, slugSegments: ['disciplines', discipline.slug]})
      )
    }))
  };
}

export function buildSearchResultsJsonLd({
  tenant,
  locale,
  tenantPath,
  query,
  results,
  settings
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  query: string;
  results: SearchResponse;
  settings?: ResolvedSiteSettings;
}) {
  if (!query || results.totalResults === 0) {
    return null;
  }

  const defaults = settings?.seo ?? {};
  const baseName = `${defaults.siteName ?? tenant.name} search`;
  const baseUrl = buildAbsoluteUrl(
    buildPath({locale, tenantPath, slugSegments: ['search']})
  );

  const itemLists: unknown[] = [];

  if (results.posts.total > 0) {
    itemLists.push({
      '@type': 'ItemList',
      name: `${baseName} articles`,
      numberOfItems: results.posts.items.length,
      itemListElement: results.posts.items.map((post, index) => ({
        '@type': 'Article',
        position: index + 1,
        name: post.title,
        url: buildAbsoluteUrl(
          buildPath({locale, tenantPath, slugSegments: ['news', post.slug]})
        ),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt
      }))
    });
  }

  if (results.events.total > 0) {
    itemLists.push({
      '@type': 'ItemList',
      name: `${baseName} events`,
      numberOfItems: results.events.items.length,
      itemListElement: results.events.items.map((event, index) => ({
        '@type': 'Event',
        position: index + 1,
        name: event.title,
        url: buildAbsoluteUrl(
          buildPath({locale, tenantPath, slugSegments: ['events', event.slug]})
        ),
        startDate: event.startsAt,
        endDate: event.endsAt ?? event.startsAt,
        location: event.location
          ? {
              '@type': 'Place',
              name: event.location
            }
          : undefined
      }))
    });
  }

  if (results.disciplines.total > 0) {
    itemLists.push({
      '@type': 'ItemList',
      name: `${baseName} disciplines`,
      numberOfItems: results.disciplines.items.length,
      itemListElement: results.disciplines.items.map((discipline, index) => ({
        '@type': 'Course',
        position: index + 1,
        name: discipline.name,
        description: discipline.shortDescription ?? discipline.description,
        url: buildAbsoluteUrl(
          buildPath({locale, tenantPath, slugSegments: ['disciplines', discipline.slug]})
        )
      }))
    });
  }

  if (results.people.total > 0) {
    itemLists.push({
      '@type': 'ItemList',
      name: `${baseName} jury`,
      numberOfItems: results.people.items.length,
      itemListElement: results.people.items.map((person, index) => ({
        '@type': 'Person',
        position: index + 1,
        name: person.name,
        jobTitle: person.title,
        url: buildAbsoluteUrl(
          buildPath({locale, tenantPath, slugSegments: ['people', person.slug]})
        ),
        description: person.bio
      }))
    });
  }

  if (results.galleries.total > 0) {
    itemLists.push({
      '@type': 'ItemList',
      name: `${baseName} galleries`,
      numberOfItems: results.galleries.items.length,
      itemListElement: results.galleries.items.map((gallery, index) => ({
        '@type': 'CollectionPage',
        position: index + 1,
        name: gallery.title,
        url: buildAbsoluteUrl(
          buildPath({locale, tenantPath, slugSegments: ['galleries', gallery.slug]})
        )
      }))
    });
  }

  if (!itemLists.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: baseName,
    inLanguage: mapLocaleToBcp47(locale),
    about: query,
    mainEntity: itemLists,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function buildEventJsonLd({
  event,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  event: Event;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  const organizerInfo = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const path = buildPath({locale, tenantPath, slugSegments: ['events', event.slug]});
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAt,
    endDate: event.endsAt ?? event.startsAt,
    description: event.description ?? event.summary ?? tenant.description ?? '',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: mapLocaleToBcp47(locale),
    organizer: {
      '@type': 'Organization',
      name: organizerInfo.name,
      url: organizerInfo.url,
      sameAs: organizerInfo.sameAs
    },
    location: event.location
      ? {
          '@type': 'Place',
          name: event.location
        }
      : undefined,
    image: event.coverImage ? [event.coverImage] : undefined,
    url: buildAbsoluteUrl(path)
  };
}

export function buildDisciplineJsonLd({
  discipline,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  discipline: Discipline;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  const organization = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const path = buildPath({locale, tenantPath, slugSegments: ['disciplines', discipline.slug]});
  const url = buildAbsoluteUrl(path);
  const courseInstances = (discipline.schedule ?? [])
    .filter((item) => item.startsAt)
    .map((item) => ({
      '@type': 'CourseInstance',
      name: item.title,
      startDate: item.startsAt,
      endDate: item.endsAt ?? item.startsAt,
      description: item.description
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: discipline.name,
    description: discipline.shortDescription ?? discipline.description,
    url,
    image: discipline.coverImage?.url ? [discipline.coverImage.url] : undefined,
    provider: organization,
    educationalLevel: discipline.level,
    courseMode: discipline.category,
    keywords: discipline.tags,
    audience: discipline.ageRange
      ? {
          '@type': 'Audience',
          audienceType: discipline.ageRange
        }
      : undefined,
    coursePrerequisites: discipline.requirements,
    hasCourseInstance: courseInstances.length ? courseInstances : undefined
  };
}

export function buildGalleryJsonLd({
  gallery,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  gallery: Gallery;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  const organization = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const path = buildPath({locale, tenantPath, slugSegments: ['galleries', gallery.slug]});
  const items = gallery.items.map((item, index) => {
    const base = {
      '@type': item.media.type === 'video' ? 'VideoObject' : 'ImageObject',
      position: index + 1,
      name: item.caption ?? gallery.title,
      contentUrl: item.media.url,
      url: item.media.url,
      thumbnailUrl: item.media.url
    } as Record<string, unknown>;
    if (item.description ?? item.caption) {
      base.description = item.description ?? item.caption;
    }
    return base;
  });

  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: gallery.title,
    description: gallery.description ?? tenant.description ?? '',
    inLanguage: mapLocaleToBcp47(locale),
    url: buildAbsoluteUrl(path),
    dateModified: gallery.updatedAt,
    isPartOf: {
      '@type': 'Organization',
      name: organization.name,
      url: organization.url,
      sameAs: organization.sameAs
    },
    hasPart: items
  };

  if (gallery.tags?.length) {
    payload.about = gallery.tags;
  }

  return payload;
}

export function buildEventsGraphJsonLd({
  events,
  tenant,
  locale,
  tenantPath,
  settings
}: {
  events: Event[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  settings?: ResolvedSiteSettings;
}) {
  if (!events.length) {
    return null;
  }

  const organizerInfo = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const defaults = settings?.seo ?? {};
  const graph = events.map((event) => {
    const path = buildPath({locale, tenantPath, slugSegments: ['events', event.slug]});
    return {
      '@type': 'Event',
      name: event.title,
      startDate: event.startsAt,
      endDate: event.endsAt ?? event.startsAt,
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: event.location
        ? {
            '@type': 'Place',
            name: event.location
          }
        : undefined,
      description: event.description ?? defaults.description ?? tenant.description ?? '',
      inLanguage: mapLocaleToBcp47(locale),
      organizer: {
        '@type': 'Organization',
        name: organizerInfo.name,
        url: organizerInfo.url,
        sameAs: organizerInfo.sameAs
      },
      image: event.coverImage ? [event.coverImage] : undefined,
      url: buildAbsoluteUrl(path)
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
