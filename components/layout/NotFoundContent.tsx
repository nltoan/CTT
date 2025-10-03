import Link from 'next/link';

export function NotFoundContent({
  title,
  description,
  homeHref,
  searchHref,
  homeLabel,
  searchLabel
}: {
  title: string;
  description: string;
  homeHref: string;
  searchHref: string;
  homeLabel: string;
  searchLabel: string;
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
      <div className="rounded-full border border-primary border-opacity-20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        404
      </div>
      <h1 className="text-3xl font-display tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base text-gray-600 sm:text-lg">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={homeHref}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80"
        >
          {homeLabel}
        </Link>
        <Link
          href={searchHref}
          className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:opacity-80"
        >
          {searchLabel}
        </Link>
      </div>
    </section>
  );
}
