import type {Metadata} from 'next';

import type {Navigation, Page, Post, Tenant, Event, Person, Sponsor} from '@types/cms';
import {findPageTranslations} from '@data/pages';
import {findPostTranslations} from '@data/posts';

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

function resolveImage(image?: string, tenant?: Tenant) {
  return image ?? tenant?.logoUrl ?? DEFAULT_OG_IMAGE;
}

export function createPageMetadata({
  page,
  tenant,
  locale,
  tenantPath
}: {
  page: Page;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}): Metadata {
  const slugSegments = toSlugSegments(page.slug);
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const description = page.seo?.description ?? tenant.description ?? '';
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

  const image = resolveImage(page.seo?.image, tenant);

  return {
    title: page.seo?.title ?? page.title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: page.seo?.title ?? page.title,
      description,
      siteName: tenant.name,
      locale: mapLocaleToBcp47(locale),
      images: [{url: image}]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo?.title ?? page.title,
      description,
      images: [image]
    }
  } satisfies Metadata;
}

export function createCollectionMetadata({
  tenant,
  locale,
  tenantPath,
  slugSegments,
  title,
  description
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
  slugSegments: string[];
  title: string;
  description: string;
}): Metadata {
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const image = resolveImage(undefined, tenant);
  const alternateLanguages = Object.fromEntries(
    tenant.locales.map((availableLocale) => {
      const path = buildPath({
        locale: availableLocale,
        tenantPath,
        slugSegments
      });
      return [availableLocale, buildAbsoluteUrl(path)];
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
      siteName: tenant.name,
      locale: mapLocaleToBcp47(locale),
      images: [{url: image}]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  } satisfies Metadata;
}

export function createPostMetadata({
  post,
  tenant,
  locale,
  tenantPath
}: {
  post: Post;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}): Metadata {
  const slugSegments = ['news', post.slug];
  const canonicalPath = buildPath({locale, tenantPath, slugSegments});
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const description = post.excerpt ?? tenant.description ?? '';
  const image = resolveImage(post.coverImage, tenant);
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
      siteName: tenant.name,
      locale: mapLocaleToBcp47(locale),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author ?? tenant.name],
      tags: post.tags,
      images: [{url: image}]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image]
    }
  } satisfies Metadata;
}

export function buildOrganizationJsonLd({
  tenant,
  locale,
  tenantPath
}: {
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  const url = buildAbsoluteUrl(buildPath({locale, tenantPath}));
  const logo = resolveImage(undefined, tenant);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: tenant.name,
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
  tenantPath
}: {
  post: Post;
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  const canonicalPath = buildPath({locale, tenantPath, slugSegments: ['news', post.slug]});
  const url = buildAbsoluteUrl(canonicalPath);
  const image = resolveImage(post.coverImage, tenant);
  const organization = buildOrganizationJsonLd({tenant, locale, tenantPath});

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt ?? tenant.description ?? '',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: mapLocaleToBcp47(locale),
    mainEntityOfPage: url,
    image: [image],
    author: {
      '@type': 'Organization',
      name: post.author ?? tenant.name
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

export function buildPeopleJsonLd({
  people,
  tenant,
  locale,
  tenantPath
}: {
  people: Person[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  if (!people.length) {
    return null;
  }

  const basePath = buildPath({locale, tenantPath, slugSegments: ['people']});
  const baseUrl = buildAbsoluteUrl(basePath);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: tenant.name,
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

export function buildSponsorsJsonLd({
  sponsors,
  tenant,
  locale,
  tenantPath
}: {
  sponsors: Sponsor[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  if (!sponsors.length) {
    return null;
  }

  const basePath = buildPath({locale, tenantPath, slugSegments: ['partners']});
  const baseUrl = buildAbsoluteUrl(basePath);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tenant.name} sponsors`,
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
  tenantPath
}: {
  posts: Post[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  if (!posts.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tenant.name} news`,
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

export function buildEventsGraphJsonLd({
  events,
  tenant,
  locale,
  tenantPath
}: {
  events: Event[];
  tenant: Tenant;
  locale: 'vi' | 'en';
  tenantPath: string;
}) {
  if (!events.length) {
    return null;
  }

  const organizer = buildOrganizationJsonLd({tenant, locale, tenantPath});
  const graph = events.map((event) => {
    const path = buildPath({locale, tenantPath, slugSegments: ['events']});
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
      description: event.description ?? tenant.description ?? '',
      inLanguage: mapLocaleToBcp47(locale),
      organizer: {
        '@type': 'Organization',
        name: organizer.name,
        url: organizer.url
      },
      url: buildAbsoluteUrl(`${path}#event-${event.id}`)
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
