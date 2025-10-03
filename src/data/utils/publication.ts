export type PublicationStatus = 'draft' | 'published' | 'scheduled';

export type Publishable = {
  status?: PublicationStatus;
  publishedAt?: string | null;
  publishAt?: string | null;
  releaseAt?: string | null;
  availableFrom?: string | null;
};

export function matchesPublicationState(
  item: Publishable,
  {includeDrafts = false, now = new Date()}: {includeDrafts?: boolean; now?: Date} = {}
) {
  const status = item.status ?? 'published';

  if (status === 'draft') {
    return includeDrafts;
  }

  if (status === 'scheduled') {
    if (includeDrafts) {
      return true;
    }

    const publishDate =
      item.publishedAt ?? item.publishAt ?? item.releaseAt ?? item.availableFrom;

    if (!publishDate) {
      return false;
    }

    return new Date(publishDate).getTime() <= now.getTime();
  }

  return true;
}
