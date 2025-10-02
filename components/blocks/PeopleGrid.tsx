import type {PeopleGridBlock} from '@types/blocks';

export function PeopleGrid({block}: {block: PeopleGridBlock}) {
  const hasPeople = block.items.length > 0;
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        {(block.title || block.description) && (
          <header className="text-center">
            {block.title && <h2 className="font-display text-3xl">{block.title}</h2>}
            {block.description && <p className="text-base text-white/70">{block.description}</p>}
          </header>
        )}
        {hasPeople ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <article
                key={item.name}
                className="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-6 text-center shadow-lg backdrop-blur"
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
                  {item.title && <p className="text-sm text-white/70">{item.title}</p>}
                  {item.bio && <p className="text-sm text-white/60">{item.bio}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white/10 p-6 text-center text-sm text-white/70">
            {block.emptyStateMessage ?? 'Đang cập nhật danh sách cố vấn & giám khảo.'}
          </p>
        )}
      </div>
    </section>
  );
}
