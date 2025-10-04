import Link from 'next/link';
import clsx from 'clsx';

import type {CtaButtonsBlock} from '@types/blocks';
import type {Locale} from '@i18n/config';
import {BlockSection} from './BlockSection';

function resolveHref({
  href,
  locale,
  tenantPath
}: {
  href: string;
  locale: Locale;
  tenantPath?: string;
}) {
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  if (isExternal) {
    return {href, external: true};
  }
  const normalized = href.startsWith('/') ? href : `/${href}`;
  const scopedPath = `/${locale}${tenantPath ?? ''}${normalized}`;
  return {href: scopedPath, external: false};
}

export function CtaButtons({
  block,
  locale,
  tenantPath
}: {
  block: CtaButtonsBlock;
  locale: Locale;
  tenantPath?: string;
}) {
  if (!block.items.length) {
    return null;
  }

  const resolvedAlign = block.align ?? block.style?.align ?? 'center';
  const alignClass =
    resolvedAlign === 'center' ? 'items-center text-center' : resolvedAlign === 'end' ? 'items-end text-right' : 'items-start text-left';
  const justifyClass =
    resolvedAlign === 'start' ? 'md:justify-start justify-center' : resolvedAlign === 'end' ? 'md:justify-end justify-center' : 'justify-center';
  const useDefaultDarkTheme = !block.style?.variant && !block.style?.theme;

  return (
    <BlockSection
      block={block}
      className={useDefaultDarkTheme ? 'bg-secondary text-white' : undefined}
      innerClassName="mx-auto flex w-full max-w-4xl flex-col gap-6"
    >
      {(block.title || block.description) && (
        <div className={clsx('flex flex-col gap-3 text-center', alignClass)}>
          {block.title ? <h2 className="text-2xl font-semibold">{block.title}</h2> : null}
          {block.description ? (
            <p className={useDefaultDarkTheme ? 'text-base text-white/80' : 'text-base text-gray-600'}>{block.description}</p>
          ) : null}
        </div>
      )}
      <div className={clsx('flex flex-wrap gap-4', justifyClass)}>
        {block.items.map((item, index) => {
          const {href, external} = resolveHref({
            href: item.href,
            locale,
            tenantPath
          });
          const content = (
            <span
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase transition',
                useDefaultDarkTheme ? 'bg-white text-secondary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90'
              )}
            >
              {item.label}
            </span>
          );
          return external || item.external ? (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <Link key={index} href={href}>
              {content}
            </Link>
          );
        })}
      </div>
    </BlockSection>
  );
}
