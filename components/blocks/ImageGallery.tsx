import type {ImageGalleryBlock} from '@types/blocks';

export function ImageGallery({block}: {block: ImageGalleryBlock}) {
  if (!block.items.length) {
    return null;
  }

  const layout = block.layout ?? 'grid';

  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        {(block.title || block.description) && (
          <header className="max-w-2xl">
            {block.title ? <h2 className="text-3xl font-semibold text-secondary">{block.title}</h2> : null}
            {block.description ? (
              <p className="mt-3 text-base text-secondary text-opacity-80">{block.description}</p>
            ) : null}
          </header>
        )}
        {layout === 'masonry' ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {block.items.map((item, index) => (
              <figure key={index} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
                <img
                  src={item.media.url}
                  alt={item.media.alt ?? ''}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {item.caption ? (
                  <figcaption className="bg-secondary bg-opacity-80 px-4 py-3 text-sm text-white">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item, index) => (
              <figure
                key={index}
                className="flex flex-col overflow-hidden rounded-xl border border-secondary border-opacity-10"
              >
                <img
                  src={item.media.url}
                  alt={item.media.alt ?? ''}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
                {item.caption ? (
                  <figcaption className="px-4 py-3 text-sm text-secondary text-opacity-80">{item.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
