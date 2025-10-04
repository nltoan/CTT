import clsx from 'clsx';

import type {SponsorsGridBlock} from '@types/blocks';
import {BlockSection} from './BlockSection';

const tierLabel: Record<NonNullable<SponsorsGridBlock['items'][number]['tier']>, string> = {
  gold: 'Gold Partner',
  silver: 'Silver Partner',
  bronze: 'Bronze Partner'
};

export function SponsorsGrid({block}: {block: SponsorsGridBlock}) {
  const hasSponsors = block.items.length > 0;
  return (
    <BlockSection block={block} innerClassName="flex flex-col gap-8">
      {(block.title || block.description) && (
        <header
          className={clsx('space-y-2', {
            'text-center': block.style?.align === 'center',
            'text-right': block.style?.align === 'end'
          })}
        >
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.description && <p className="text-base text-gray-600">{block.description}</p>}
        </header>
      )}
      {hasSponsors ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => (
            <a
              key={item.name}
              href={item.url ?? '#'}
              target={item.url ? '_blank' : undefined}
              rel={item.url ? 'noopener noreferrer' : undefined}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={clsx('text-xs font-semibold uppercase tracking-wide text-gray-500', {
                  'text-yellow-600': item.tier === 'gold',
                  'text-slate-500': item.tier === 'silver',
                  'text-amber-700': item.tier === 'bronze'
                })}
              >
                {item.tier ? tierLabel[item.tier] : 'Partner'}
              </span>
              <img
                src={item.logo.url}
                alt={item.logo.alt ?? item.name}
                className="h-16 w-auto object-contain"
                loading="lazy"
              />
              <span className="text-sm font-medium text-secondary">{item.name}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-600">
          {block.emptyStateMessage ?? 'Đang cập nhật danh sách đối tác.'}
        </p>
      )}
    </BlockSection>
  );
}
