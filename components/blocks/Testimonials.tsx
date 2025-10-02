import {clsx} from 'clsx';

import type {TestimonialsBlock} from '@types/blocks';

export function Testimonials({block}: {block: TestimonialsBlock}) {
  if (!block.items.length) {
    return null;
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        {(block.title || block.description) && (
          <div className="max-w-2xl">
            {block.title ? (
              <h2 className="text-3xl font-semibold text-secondary">{block.title}</h2>
            ) : null}
            {block.description ? (
              <p className="mt-3 text-base text-secondary/80">{block.description}</p>
            ) : null}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {block.items.map((item, index) => (
            <figure
              key={index}
              className={clsx(
                'flex flex-col gap-4 rounded-2xl border border-secondary/10 bg-white/70 p-6 shadow-sm backdrop-blur',
                'transition hover:-translate-y-1 hover:shadow-lg'
              )}
            >
              <blockquote className="text-lg font-medium text-secondary">“{item.quote}”</blockquote>
              <figcaption className="flex items-center gap-4 text-sm text-secondary/70">
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatar.url}
                    alt={item.avatar.alt ?? item.name}
                    className="h-12 w-12 flex-none rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <div className="font-semibold text-secondary">{item.name}</div>
                  {item.title ? <div>{item.title}</div> : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
