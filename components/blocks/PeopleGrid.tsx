import clsx from 'clsx';

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
          {block.items.map((item) => (
            <article
              key={item.name}
              className={clsx(
                'flex flex-col items-center gap-4 rounded-2xl p-6 text-center shadow-lg backdrop-blur',
                isDarkBackground ? 'bg-white/10' : 'bg-white'
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
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                {item.title && (
                  <p className={isDarkBackground ? 'text-sm text-white/70' : 'text-sm text-gray-600'}>{item.title}</p>
                )}
                {item.bio && (
                  <p className={isDarkBackground ? 'text-sm text-white/60' : 'text-sm text-gray-500'}>{item.bio}</p>
                )}
              </div>
            </article>
          ))}
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
