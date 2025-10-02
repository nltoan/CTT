import type {ContactBlock as ContactBlockType} from '@types/blocks';

export function ContactBlock({block}: {block: ContactBlockType}) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
        <div className="space-y-4">
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.address && (
            <p className="text-base text-gray-600">
              <strong className="block font-semibold text-secondary">
                {block.addressLabel ?? 'Address'}
              </strong>
              {block.address}
            </p>
          )}
          {block.phone && (
            <p className="text-base text-gray-600">
              <strong className="block font-semibold text-secondary">
                {block.phoneLabel ?? 'Phone'}
              </strong>
              <a className="text-primary" href={`tel:${block.phone}`}>
                {block.phone}
              </a>
            </p>
          )}
          {block.email && (
            <p className="text-base text-gray-600">
              <strong className="block font-semibold text-secondary">
                {block.emailLabel ?? 'Email'}
              </strong>
              <a className="text-primary" href={`mailto:${block.email}`}>
                {block.email}
              </a>
            </p>
          )}
        </div>
        {block.mapEmbed && (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <iframe
              src={block.mapEmbed}
              title="Map"
              className="h-80 w-full"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  );
}
