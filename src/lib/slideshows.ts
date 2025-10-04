import {
  findSlideshowById,
  listSlideshowsByTenant
} from '@data/slideshows';
import type {Slideshow} from '@types/cms';

export async function getSlideshow({
  tenantId,
  locale,
  id,
  limit,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  id: string;
  limit?: number;
  preview?: boolean;
}): Promise<Slideshow | null> {
  return findSlideshowById({tenantId, locale, id, limit, includeDrafts: preview});
}

export async function getSlideshows({
  tenantId,
  locale,
  limit,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  preview?: boolean;
}): Promise<Slideshow[]> {
  return listSlideshowsByTenant({tenantId, locale, limit, includeDrafts: preview});
}

export type SlideshowSummary = Awaited<ReturnType<typeof getSlideshows>>[number];
