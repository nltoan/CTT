import clsx from 'clsx';

import type {RichContentBlock} from '@types/blocks';
import {BlockSection} from './BlockSection';

export function RichContent({block}: {block: RichContentBlock}) {
  if (!block.content) {
    return null;
  }

  return (
    <BlockSection block={block} innerClassName="rich-content mx-auto w-full max-w-3xl text-secondary">
      {block.title ? (
        <h2
          className={clsx(
            'mb-6 text-3xl font-semibold tracking-tight sm:text-4xl',
            block.style?.align === 'center' && 'text-center',
            block.style?.align === 'end' && 'text-right'
          )}
        >
          {block.title}
        </h2>
      ) : null}
      <div className="rich-content__body" dangerouslySetInnerHTML={{__html: block.content}} />
    </BlockSection>
  );
}
