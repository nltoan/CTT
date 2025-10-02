import {format} from 'date-fns';
import {vi, enUS} from 'date-fns/locale';

import type {TimelineBlock} from '@types/blocks';
import type {Locale} from '@i18n/config';

function formatDate(value: string, locale: Locale) {
  const parsed = new Date(value);
  const localeModule = locale === 'vi' ? vi : enUS;
  return format(parsed, 'PPPp', {locale: localeModule});
}

export function Timeline({block, locale}: {block: TimelineBlock; locale: Locale}) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        {(block.title || block.description) && (
          <header className="space-y-2 text-center">
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
      </div>
    </section>
  );
}
