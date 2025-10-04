import {format} from 'date-fns';
import {vi, enUS} from 'date-fns/locale';
import clsx from 'clsx';

import type {TimelineBlock} from '@types/blocks';
import type {Locale} from '@i18n/config';
import {BlockSection} from './BlockSection';

function formatDate(value: string, locale: Locale) {
  const parsed = new Date(value);
  const localeModule = locale === 'vi' ? vi : enUS;
  return format(parsed, 'PPPp', {locale: localeModule});
}

export function Timeline({block, locale}: {block: TimelineBlock; locale: Locale}) {
  const headingAlign =
    block.style?.align === 'center'
      ? 'text-center'
      : block.style?.align === 'end'
        ? 'text-right'
        : 'text-left';

  return (
    <BlockSection block={block} innerClassName="flex flex-col gap-8">
      {(block.title || block.description) && (
        <header className={clsx('space-y-2', headingAlign)}>
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.description && <p className="text-base text-gray-600">{block.description}</p>}
        </header>
      )}
      <ol className="relative border-s border-gray-200 pl-6">
        {block.items.map((item) => (
          <li key={item.title} className="mb-10 ml-4">
            <div className="absolute -left-3 mt-1 h-6 w-6 rounded-full border-4 border-white bg-primary" />
            <time className="text-sm font-medium uppercase text-gray-500">
              {formatDate(item.datetime, locale)}
            </time>
            <h3 className="text-2xl font-semibold text-secondary">{item.title}</h3>
            {item.description && <p className="mt-2 text-gray-600">{item.description}</p>}
          </li>
        ))}
      </ol>
    </BlockSection>
  );
}
