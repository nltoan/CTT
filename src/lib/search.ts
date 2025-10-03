import {searchPostsByTenant} from '@data/posts';
import {searchEventsByTenant} from '@data/events';
import {searchGalleriesByTenant} from '@data/galleries';
import {searchPeopleByTenant} from '@data/people';
import type {Post, Event, Gallery, Person} from '@types/cms';

type SearchType = 'posts' | 'events' | 'galleries' | 'people';

type SearchBucket<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

type SearchResponse = {
  query: string;
  totalResults: number;
  posts: SearchBucket<Post>;
  events: SearchBucket<Event>;
  galleries: SearchBucket<Gallery>;
  people: SearchBucket<Person>;
};

const EMPTY_BUCKET: SearchBucket<never> = {
  items: [],
  total: 0,
  page: 1,
  limit: 0,
  totalPages: 1,
  hasMore: false
};

function cloneBucket<T>(bucket: SearchBucket<T>): SearchBucket<T> {
  return {
    items: bucket.items,
    total: bucket.total,
    page: bucket.page,
    limit: bucket.limit,
    totalPages: bucket.totalPages,
    hasMore: bucket.hasMore
  };
}

function normalizeTypes(types?: SearchType[]) {
  if (!types || types.length === 0) {
    return new Set<SearchType>(['posts', 'events', 'galleries', 'people']);
  }
  return new Set<SearchType>(types);
}

function sanitizeLimit(limit?: number | null) {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return 5;
  }
  return Math.max(1, Math.min(Math.floor(limit), 25));
}

function toGalleryBucket(result: ReturnType<typeof searchGalleriesByTenant>): SearchBucket<Gallery> {
  return {
    items: result.items,
    total: result.meta.totalItems,
    page: result.meta.page,
    limit: result.meta.limit,
    totalPages: result.meta.totalPages,
    hasMore: result.meta.page < result.meta.totalPages
  };
}

export async function searchAllContent({
  tenantId,
  locale,
  query,
  limit,
  types
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  query?: string;
  limit?: number | null;
  types?: SearchType[];
}): Promise<SearchResponse> {
  const sanitizedQuery = query?.trim() ?? '';
  const normalizedTypes = normalizeTypes(types);
  const limitPerType = sanitizeLimit(limit);

  if (!sanitizedQuery) {
    return {
      query: '',
      totalResults: 0,
      posts: cloneBucket(EMPTY_BUCKET),
      events: cloneBucket(EMPTY_BUCKET),
      galleries: cloneBucket(EMPTY_BUCKET),
      people: cloneBucket(EMPTY_BUCKET)
    } satisfies SearchResponse;
  }

  const [postResults, eventResults, galleryResults, personResults] = await Promise.all([
    normalizedTypes.has('posts')
      ? Promise.resolve(
          searchPostsByTenant({tenantId, locale, q: sanitizedQuery, limit: limitPerType, page: 1})
        )
      : Promise.resolve(cloneBucket(EMPTY_BUCKET)),
    normalizedTypes.has('events')
      ? Promise.resolve(
          searchEventsByTenant({tenantId, locale, q: sanitizedQuery, limit: limitPerType, page: 1})
        )
      : Promise.resolve(cloneBucket(EMPTY_BUCKET)),
    normalizedTypes.has('galleries')
      ? Promise.resolve(
          toGalleryBucket(
            searchGalleriesByTenant({
              tenantId,
              locale,
              q: sanitizedQuery,
              page: 1,
              limit: limitPerType
            })
          )
        )
      : Promise.resolve(cloneBucket(EMPTY_BUCKET)),
    normalizedTypes.has('people')
      ? Promise.resolve(
          searchPeopleByTenant({
            tenantId,
            locale,
            q: sanitizedQuery,
            page: 1,
            limit: limitPerType
          }) as SearchBucket<Person>
        )
      : Promise.resolve(cloneBucket(EMPTY_BUCKET))
  ]);

  const totalResults =
    postResults.total + eventResults.total + galleryResults.total + personResults.total;

  return {
    query: sanitizedQuery,
    totalResults,
    posts: postResults,
    events: eventResults,
    galleries: galleryResults,
    people: personResults
  } satisfies SearchResponse;
}

export type {SearchResponse, SearchBucket, SearchType};
