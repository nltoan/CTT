import Link from 'next/link';
import clsx from 'clsx';

export function Pagination({
  currentPage,
  totalPages,
  makeHref,
  locale
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
  locale: 'vi' | 'en';
}) {
  if (totalPages <= 1) {
    return null;
  }

  const labels = {
    previous: locale === 'vi' ? 'Trang trước' : 'Previous',
    next: locale === 'vi' ? 'Trang sau' : 'Next',
    pagination: locale === 'vi' ? 'Phân trang bài viết' : 'News pagination'
  } as const;

  const candidates = [
    1,
    totalPages,
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2
  ].filter((page) => page >= 1 && page <= totalPages);

  const pages = Array.from(new Set(candidates)).sort((a, b) => a - b);

  const items: (number | 'ellipsis')[] = [];
  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const previous = pages[index - 1];
    if (previous && page - previous > 1) {
      items.push('ellipsis');
    }
    items.push(page);
  }

  return (
    <nav
      aria-label={labels.pagination}
      className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white px-4 py-3 shadow-sm"
    >
      <Link
        href={makeHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={clsx(
          'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition',
          currentPage === 1
            ? 'cursor-not-allowed border-gray-200 text-gray-300'
            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
        )}
      >
        ← {labels.previous}
      </Link>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`} className="text-xs text-gray-400">
                …
              </li>
            );
          }
          const isActive = item === currentPage;
          return (
            <li key={item}>
              <Link
                href={makeHref(item)}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition',
                  isActive
                    ? 'bg-primary text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'
                )}
              >
                {item}
              </Link>
            </li>
          );
        })}
      </ol>
      <Link
        href={makeHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={clsx(
          'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition',
          currentPage === totalPages
            ? 'cursor-not-allowed border-gray-200 text-gray-300'
            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
        )}
      >
        {labels.next} →
      </Link>
    </nav>
  );
}
