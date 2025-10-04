import Link from 'next/link';
import clsx from 'clsx';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  className,
  tone = 'default'
}: {
  items: BreadcrumbItem[];
  className?: string;
  tone?: 'default' | 'inverted';
}) {
  if (!items.length) {
    return null;
  }

  const navClass = tone === 'inverted' ? 'text-white/70' : 'text-gray-500';
  const separatorClass = tone === 'inverted' ? 'text-white/40' : 'text-gray-300';
  const currentClass = tone === 'inverted' ? 'text-white' : 'text-secondary';
  const linkClass =
    tone === 'inverted'
      ? 'no-underline text-white/80 transition hover:opacity-80'
      : 'no-underline text-gray-600 transition hover:opacity-80';

  return (
    <nav aria-label="Breadcrumb" className={clsx('text-sm', navClass, className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className={separatorClass}>/</span> : null}
              {isLast || !item.href ? (
                <span className={clsx('font-semibold', currentClass)}>{item.label}</span>
              ) : (
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
