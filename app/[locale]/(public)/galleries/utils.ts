export type SearchParams = Record<string, string | string[] | undefined>;

export type NormalizedGallerySearch = {
  categorySlug?: string;
  tagSlug?: string;
  q?: string;
  sort: 'latest' | 'oldest';
  page: number;
};

export function pickGalleryParam(value?: string | string[] | null): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

export function normalizeGallerySearchParams(searchParams?: SearchParams): NormalizedGallerySearch {
  const categorySlug = pickGalleryParam(searchParams?.category)?.trim() || undefined;
  const tagSlug = pickGalleryParam(searchParams?.tag)?.trim() || undefined;
  const q = pickGalleryParam(searchParams?.q)?.trim() || undefined;
  const sortParam = pickGalleryParam(searchParams?.sort);
  const pageParam = pickGalleryParam(searchParams?.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const sort = sortParam === 'oldest' ? 'oldest' : 'latest';

  return {categorySlug, tagSlug, q, sort, page};
}
