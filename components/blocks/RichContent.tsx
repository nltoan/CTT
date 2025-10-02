import type {RichContentBlock} from '@types/blocks';

export function RichContent({block}: {block: RichContentBlock}) {
  if (!block.content) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="prose prose-lg mx-auto w-full max-w-3xl px-6 text-secondary prose-headings:font-semibold prose-a:text-primary prose-a:transition-opacity hover:prose-a:opacity-80">
        {block.title ? <h2>{block.title}</h2> : null}
        <div dangerouslySetInnerHTML={{__html: block.content}} />
      </div>
    </section>
  );
}
