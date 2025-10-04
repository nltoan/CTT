import clsx from 'clsx';

export function SkipLink({
  targetId = 'main-content',
  label,
  className
}: {
  targetId?: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={clsx(
        'skip-link',
        'rounded-full bg-secondary px-4 py-2 text-sm font-medium text-white focus-visible:outline-none',
        className
      )}
    >
      {label}
    </a>
  );
}
