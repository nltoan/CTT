import clsx from 'clsx';

import type {PrizesBlock} from '@types/blocks';
import {BlockSection} from './BlockSection';

export function Prizes({block}: {block: PrizesBlock}) {
  const headingAlign =
    block.style?.align === 'center'
      ? 'text-center'
      : block.style?.align === 'end'
        ? 'text-right'
        : 'text-left';

  return (
    <BlockSection block={block}>
      {(block.title || block.description) && (
        <div className={clsx('mb-8', headingAlign)}>
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.description && <p className="text-base text-gray-600">{block.description}</p>}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {block.items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-primary">{item.title}</h3>
            {item.description && <p className="mt-3 text-gray-600">{item.description}</p>}
          </article>
        ))}
      </div>
    </BlockSection>
  );
}
