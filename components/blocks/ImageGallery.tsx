import Link from 'next/link';
import clsx from 'clsx';

import type {ImageGalleryBlock} from '@types/blocks';
import type {Gallery} from '@types/cms';
import type {Locale} from '@i18n/config';
import {BlockSection} from './BlockSection';

type GalleryPreview = (Gallery & {totalItems?: number; hasMore?: boolean}) | null;

export function ImageGallery({
  block,
  gallery,
  locale,
  tenantPath = ''
}: {
  block: ImageGalleryBlock;
  gallery?: GalleryPreview;
  locale: Locale;
  tenantPath?: string;
}) {
  const items = gallery?.items?.length ? gallery.items : block.items ?? [];

  if (!items.length) {
    const emptyMessage =
      block.emptyStateMessage ??
      (locale === 'vi'
        ? 'Hiện chưa có ảnh hoặc video nào trong bộ sưu tập.'
        : 'There are no media items in this gallery yet.');

    return (
      <BlockSection block={block} innerClassName="flex w-full max-w-4xl flex-col gap-4 text-center">
        <p className="rounded-2xl border border-dashed border-secondary border-opacity-20 bg-white/80 p-8 text-sm text-secondary text-opacity-70">
          {emptyMessage}
        </p>
      </BlockSection>
    );
  }

  const layout = block.layout ?? gallery?.layout ?? 'grid';
  const heading = block.title ?? gallery?.title;
  const description = block.description ?? gallery?.description;
  const normalizedTenantPath = tenantPath.replace(/^\//, '');
  const autoViewAllHref = gallery?.slug
    ? `/${[locale, normalizedTenantPath, 'galleries', gallery.slug].filter(Boolean).join('/')}`
    : undefined;
  const viewAllHref = block.viewAll?.href ?? (gallery?.hasMore ? autoViewAllHref : undefined);
  const viewAllLabel = block.viewAll?.label ?? (locale === 'vi' ? 'Xem toàn bộ' : 'View full gallery');

  return (
    <BlockSection block={block} innerClassName="flex w-full max-w-6xl flex-col gap-8">
      {(heading || description) && (
        <header
          className={clsx('max-w-2xl', {
            'text-center mx-auto': block.style?.align === 'center',
            'text-right ml-auto': block.style?.align === 'end'
          })}
        >
          {heading ? <h2 className="text-3xl font-semibold text-secondary">{heading}</h2> : null}
          {description ? (
            <p className="mt-3 text-base text-secondary text-opacity-80">{description}</p>
          ) : null}
        </header>
      )}
      {layout === 'masonry' ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <figure key={index} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
              <img
                src={item.media.url}
                alt={item.media.alt ?? ''}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {item.caption ? (
                <figcaption className="bg-secondary bg-opacity-80 px-4 py-3 text-sm text-white">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <figure
              key={index}
              className="flex flex-col overflow-hidden rounded-xl border border-secondary border-opacity-10"
            >
              <img
                src={item.media.url}
                alt={item.media.alt ?? ''}
                className="h-64 w-full object-cover"
                loading="lazy"
              />
              {item.caption ? (
                <figcaption className="px-4 py-3 text-sm text-secondary text-opacity-80">{item.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      )}
      {viewAllHref ? (
        <div className="flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center rounded-full border border-primary border-opacity-40 px-6 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary hover:bg-opacity-10 hover:shadow"
          >
            {viewAllLabel}
          </Link>
        </div>
      ) : null}
    </BlockSection>
  );
}
