import Link from 'next/link';

import type {CtaButtonsBlock} from '@types/blocks';
import type {Locale} from '@i18n/config';

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

  const alignClass = block.align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <section className="bg-secondary py-14 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 text-center">
        {(block.title || block.description) && (
          <div className={`flex flex-col gap-3 ${alignClass}`}>
            {block.title ? <h2 className="text-2xl font-semibold">{block.title}</h2> : null}
            {block.description ? <p className="text-base text-white/80">{block.description}</p> : null}
          </div>
        )}
        <div className={`flex flex-wrap justify-center gap-4 ${block.align === 'start' ? 'md:justify-start' : ''}`}>
          {block.items.map((item, index) => {
            const {href, external} = resolveHref({
              href: item.href,
              locale,
              tenantPath
            });
            const content = (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-secondary transition hover:bg-white/90">
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
      </div>
    </section>
  );
}
