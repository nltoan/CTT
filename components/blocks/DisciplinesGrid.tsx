import type {DisciplinesGridBlock} from '@types/blocks';

export function DisciplinesGrid({block}: {block: DisciplinesGridBlock}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      {(block.title || block.description) && (
        <div className="mb-8 flex flex-col gap-2 text-center">
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.description && <p className="text-base text-gray-600">{block.description}</p>}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item) => (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={item.image.url}
              alt={item.image.alt ?? item.title}
              className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="space-y-2 p-6">
              <h3 className="text-xl font-semibold text-secondary">{item.title}</h3>
              {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              {item.href && (
                <a
                  href={item.href}
                  className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                >
                  Tìm hiểu thêm →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
