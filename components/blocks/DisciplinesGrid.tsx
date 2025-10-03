import Link from 'next/link';
import clsx from 'clsx';

import type {DisciplinesGridBlock} from '@types/blocks';
import {BlockSection} from './BlockSection';
import type {Locale} from '@i18n/config';

export function DisciplinesGrid({
  block,
  locale,
  tenantPath = ''
}: {
  block: DisciplinesGridBlock;
  locale: Locale;
  tenantPath?: string;
}) {
  const headingAlign =
    block.style?.align === 'center'
      ? 'text-center'
      : block.style?.align === 'end'
        ? 'text-right'
        : 'text-left';

  const defaultLinkLabel = locale === 'vi' ? 'Tìm hiểu thêm' : 'Learn more';

  return (
    <BlockSection block={block}>
      {(block.title || block.description) && (
        <div className={clsx('mb-8 flex flex-col gap-2', headingAlign)}>
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.description && <p className="text-base text-gray-600">{block.description}</p>}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item) => (
          // Compute destination path with tenant + locale awareness
          (() => {
            const normalizedTenantPath = tenantPath.startsWith('/') ? tenantPath : `/${tenantPath}`;
            const sanitizedTenantPath = normalizedTenantPath === '/' ? '' : normalizedTenantPath;
            const internalHref = item.disciplineSlug
              ? `/${locale}${sanitizedTenantPath}/disciplines/${item.disciplineSlug}`
              : undefined;
            const href = item.href ?? internalHref;
            const isExternal = href ? /^https?:\/\//.test(href) || href.startsWith('mailto:') : false;
            const linkLabel = item.linkLabel ?? block.linkLabel ?? defaultLinkLabel;

            return (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={item.image.url}
              alt={item.image.alt ?? item.title}
              className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="space-y-2 p-6">
              <h3 className="text-xl font-semibold text-secondary">{item.title}</h3>
              {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              {href && (
                isExternal ? (
                  <a
                    href={href}
                    className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {linkLabel} →
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                  >
                    {linkLabel} →
                  </Link>
                )
              )}
            </div>
          </article>
            );
          })()
        ))}
      </div>
    </BlockSection>
  );
}
