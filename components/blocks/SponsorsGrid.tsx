import clsx from 'clsx';

import type {SponsorsGridBlock} from '@types/blocks';

const tierLabel: Record<NonNullable<SponsorsGridBlock['items'][number]['tier']>, string> = {
  gold: 'Gold Partner',
  silver: 'Silver Partner',
  bronze: 'Bronze Partner'
};

export function SponsorsGrid({block}: {block: SponsorsGridBlock}) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        {(block.title || block.description) && (
          <header className="text-center">
            {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
            {block.description && <p className="text-base text-gray-600">{block.description}</p>}
          </header>
        )}
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
      </div>
    </section>
  );
}
