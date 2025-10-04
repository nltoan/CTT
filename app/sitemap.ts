import type {MetadataRoute} from 'next';

import {tenants} from '@data/tenants';
import {listPagesByTenant} from '@data/pages';
import {listPostsByTenant, listPostCategories, listPostTags} from '@data/posts';
import {listEventsByTenant} from '@data/events';
import {listGalleriesByTenant, listGalleryCategories, listGalleryTags} from '@data/galleries';
import {listPeopleByTenant} from '@data/people';
import {listDisciplinesByTenant} from '@data/disciplines';
import {buildAbsoluteUrl, buildPath} from '@lib/seo';
import {ensureSlug} from '@/utils/slug';

function toDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  tenants.forEach((tenant) => {
    const tenantPath = tenant.slug === 'main' ? '' : `/t/${tenant.slug}`;

    tenant.locales.forEach((locale) => {
      const pages = listPagesByTenant({tenantId: tenant.id, locale});
      pages.forEach((page) => {
        const slugSegments = page.slug ? page.slug.split('/').filter(Boolean) : [];
        const path = buildPath({locale, tenantPath, slugSegments});
        entries.push({
          url: buildAbsoluteUrl(path),
          lastModified: toDate(page.updatedAt),
          changeFrequency: 'weekly',
          priority: slugSegments.length === 0 ? 1 : 0.7
        });
      });

      const posts = listPostsByTenant({tenantId: tenant.id, locale});
      posts.forEach((post) => {
        const path = buildPath({locale, tenantPath, slugSegments: ['news', post.slug]});
        entries.push({
          url: buildAbsoluteUrl(path),
          lastModified: toDate(post.updatedAt ?? post.publishedAt),
          changeFrequency: 'monthly',
          priority: 0.6
        });
      });

      const newsPath = buildPath({locale, tenantPath, slugSegments: ['news']});
      const latestPost = posts[0];
      entries.push({
        url: buildAbsoluteUrl(newsPath),
        lastModified: toDate(latestPost?.updatedAt ?? latestPost?.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.8
      });

      const postCategories = listPostCategories({tenantId: tenant.id, locale});
      postCategories.forEach((category) => {
        const latestInCategory = posts.find((post) =>
          post.category
            ? ensureSlug(post.category, post.category.toLowerCase()) === category.slug
            : false
        );
        const categoryPath = buildPath({
          locale,
          tenantPath,
          slugSegments: ['news', 'category', category.slug]
        });
        entries.push({
          url: buildAbsoluteUrl(categoryPath),
          lastModified: toDate(latestInCategory?.updatedAt ?? latestInCategory?.publishedAt),
          changeFrequency: 'weekly',
          priority: 0.6
        });
      });

      const postTags = listPostTags({tenantId: tenant.id, locale});
      postTags.forEach((tag) => {
        const latestWithTag = posts.find((post) =>
          post.tags?.some(
            (tagItem) => ensureSlug(tagItem, tagItem.toLowerCase()) === tag.slug
          )
        );
        const tagPath = buildPath({
          locale,
          tenantPath,
          slugSegments: ['news', 'tag', tag.slug]
        });
        entries.push({
          url: buildAbsoluteUrl(tagPath),
          lastModified: toDate(latestWithTag?.updatedAt ?? latestWithTag?.publishedAt),
          changeFrequency: 'weekly',
          priority: 0.55
        });
      });

      const events = listEventsByTenant({tenantId: tenant.id, locale});
      events.forEach((event) => {
        const eventPath = buildPath({locale, tenantPath, slugSegments: ['events', event.slug]});
        entries.push({
          url: buildAbsoluteUrl(eventPath),
          lastModified: toDate(event.updatedAt ?? event.startsAt),
          changeFrequency: 'weekly',
          priority: 0.7
        });
      });
      const eventsPath = buildPath({locale, tenantPath, slugSegments: ['events']});
      entries.push({
        url: buildAbsoluteUrl(eventsPath),
        lastModified: events[0]?.startsAt ? new Date(events[0].startsAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.75
      });

      const disciplines = listDisciplinesByTenant({tenantId: tenant.id, locale});
      disciplines.forEach((discipline) => {
        const disciplinePath = buildPath({
          locale,
          tenantPath,
          slugSegments: ['disciplines', discipline.slug]
        });
        entries.push({
          url: buildAbsoluteUrl(disciplinePath),
          lastModified: toDate(discipline.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.65
        });
      });
      const disciplinesPath = buildPath({locale, tenantPath, slugSegments: ['disciplines']});
      entries.push({
        url: buildAbsoluteUrl(disciplinesPath),
        lastModified: toDate(disciplines[0]?.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7
      });

      const galleries = listGalleriesByTenant({tenantId: tenant.id, locale});
      const galleryCategories = listGalleryCategories({tenantId: tenant.id, locale});
      const galleryTags = listGalleryTags({tenantId: tenant.id, locale});
      const people = listPeopleByTenant({tenantId: tenant.id, locale});
      galleries.forEach((gallery) => {
        const galleryPath = buildPath({locale, tenantPath, slugSegments: ['galleries', gallery.slug]});
        entries.push({
          url: buildAbsoluteUrl(galleryPath),
          lastModified: toDate(gallery.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.65
        });
      });
      galleryCategories.forEach((category) => {
        const categoryPath = buildPath({
          locale,
          tenantPath,
          slugSegments: ['galleries', 'category', category.slug]
        });
        const latestInCategory = galleries.find((gallery) => gallery.category === category.key);
        entries.push({
          url: buildAbsoluteUrl(categoryPath),
          lastModified: toDate(latestInCategory?.updatedAt ?? galleries[0]?.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6
        });
      });
      galleryTags.forEach((tag) => {
        const tagPath = buildPath({locale, tenantPath, slugSegments: ['galleries', 'tag', tag.slug]});
        const latestWithTag = galleries.find((gallery) => gallery.tags?.includes(tag.key));
        entries.push({
          url: buildAbsoluteUrl(tagPath),
          lastModified: toDate(latestWithTag?.updatedAt ?? galleries[0]?.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.55
        });
      });
      const galleriesPath = buildPath({locale, tenantPath, slugSegments: ['galleries']});
      entries.push({
        url: buildAbsoluteUrl(galleriesPath),
        lastModified: toDate(galleries[0]?.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7
      });

      people.forEach((person) => {
        const personPath = buildPath({locale, tenantPath, slugSegments: ['people', person.slug]});
        entries.push({
          url: buildAbsoluteUrl(personPath),
          lastModified: toDate(person.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.65
        });
      });

      const peoplePath = buildPath({locale, tenantPath, slugSegments: ['people']});
      entries.push({
        url: buildAbsoluteUrl(peoplePath),
        lastModified: toDate(people[0]?.updatedAt ?? pages.find((page) => page.slug === 'people')?.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7
      });

      const partnersPath = buildPath({locale, tenantPath, slugSegments: ['partners']});
      entries.push({
        url: buildAbsoluteUrl(partnersPath),
        lastModified: toDate(pages.find((page) => page.slug === 'partners')?.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6
      });

      const searchPath = buildPath({locale, tenantPath, slugSegments: ['search']});
      entries.push({
        url: buildAbsoluteUrl(searchPath),
        changeFrequency: 'daily',
        priority: 0.4
      });
    });
  });

  return entries;
}
