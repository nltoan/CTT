import type {RichContentBlock} from '@types/blocks';

export function RichContent({block}: {block: RichContentBlock}) {
  if (!block.content) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="rich-content mx-auto w-full max-w-3xl px-6 text-secondary">
        {block.title ? (
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-secondary sm:text-4xl">
            {block.title}
          </h2>
        ) : null}
        <div className="rich-content__body" dangerouslySetInnerHTML={{__html: block.content}} />
      </div>
    </section>
  );
}
