import type {Locale} from '@i18n/config';
import {readDraftModeState} from '@lib/preview';
import {
  createOgImageResponse,
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  resolveOgImageDataForSegments
} from '@lib/og';
import {readTenantResolutionFromRequest} from '@lib/tenant';

export const runtime = 'edge';
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export async function GET(
  request: Request,
  {
    params
  }: {
    params: {locale: Locale; slug?: string[]; tenant?: string};
  }
) {
  const {tenant, locale} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const preview = readDraftModeState();
  const url = new URL(request.url);
  const rawQuery = url.searchParams.get('q');
  const searchQuery = rawQuery?.trim() ? rawQuery.trim() : null;
  const slugSegments = params.slug ?? [];

  const payload = await resolveOgImageDataForSegments({
    tenant,
    locale,
    slugSegments,
    preview,
    searchQuery
  });

  return createOgImageResponse({
    ...payload,
    tenant
  });
}
