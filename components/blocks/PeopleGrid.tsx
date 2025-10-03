import clsx from 'clsx';
import Link from 'next/link';

import type {PeopleGridBlock} from '@types/blocks';
import {BlockSection} from './BlockSection';

export function PeopleGrid({block}: {block: PeopleGridBlock}) {
  const hasPeople = block.items.length > 0;
  const isDarkBackground =
    block.style?.variant === 'contrast' || (!block.style?.variant && !block.style?.theme);
  return (
    <BlockSection
      block={block}
      className={isDarkBackground && !block.style?.variant ? 'bg-slate-900 text-white' : undefined}
      innerClassName={clsx('flex flex-col gap-8', isDarkBackground && 'text-white')}
    >
      {(block.title || block.description) && (
        <header
          className={clsx('space-y-2', {
            'text-center': block.style?.align !== 'end' && block.style?.align !== 'start',
            'text-right': block.style?.align === 'end'
          })}
        >
          {block.title && <h2 className="font-display text-3xl">{block.title}</h2>}
          {block.description && (
            <p className={isDarkBackground ? 'text-base text-white/70' : 'text-base text-gray-600'}>{block.description}</p>
          )}
        </header>
      )}
      {hasPeople ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => {
            const cardContent = (
              <article
                className={clsx(
                  'flex h-full flex-col items-center gap-4 rounded-2xl p-6 text-center shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl',
                  isDarkBackground ? 'bg-white/10 text-white' : 'bg-white text-secondary'
                )}
              >
                {item.photo && (
                  <img
                    src={item.photo.url}
                    alt={item.photo.alt ?? item.name}
                    className="h-32 w-32 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    {item.title && (
                      <p className={isDarkBackground ? 'text-sm text-white/70' : 'text-sm text-gray-600'}>{item.title}</p>
                    )}
                  </div>
                  {item.disciplines?.length ? (
                    <ul className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-wide">
                      {item.disciplines.map((discipline) => (
                        <li
                          key={discipline}
                          className={clsx(
                            'rounded-full px-3 py-1 font-medium',
                            isDarkBackground ? 'bg-white/10 text-white/80' : 'bg-secondary/5 text-secondary/80'
                          )}
                        >
                          {discipline}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.bio && (
                    <p className={isDarkBackground ? 'text-sm text-white/60' : 'text-sm text-gray-500'}>{item.bio}</p>
                  )}
                </div>
                {item.ctaLabel && item.href ? (
                  <span
                    className={clsx(
                      'mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-colors',
                      isDarkBackground ? 'text-amber-200 hover:text-amber-100' : 'text-primary hover:opacity-80'
                    )}
                  >
                    {item.ctaLabel}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 0 1 0-1.06L11.94 7H7.5a.75.75 0 0 1 0-1.5h6.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V8.06l-6.72 6.72a.75.75 0 0 1-1.06 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : null}
              </article>
            );

            if (item.href) {
              return (
                <Link key={item.name} href={item.href} className="h-full">
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={item.name} className="h-full">
                {cardContent}
              </div>
            );
          })}
        </div>
      ) : (
        <p
          className={clsx(
            'rounded-xl p-6 text-center text-sm',
            isDarkBackground ? 'bg-white/10 text-white/70' : 'bg-gray-50 text-gray-600'
          )}
        >
          {block.emptyStateMessage ?? 'Đang cập nhật danh sách cố vấn & giám khảo.'}
        </p>
      )}
    </BlockSection>
  );
}
