import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';

import type {BlockBase, BlockStyle} from '@types/blocks';

type BlockSectionProps = {
  block: BlockBase;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  disableDefaultContainer?: boolean;
  style?: CSSProperties;
};

const paddingMap = {
  none: '',
  xs: 'py-6 sm:py-8',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-24'
} as const;

const marginTopMap = {
  none: '',
  xs: 'mt-4',
  sm: 'mt-8',
  md: 'mt-12',
  lg: 'mt-16'
} as const;

const marginBottomMap = {
  none: '',
  xs: 'mb-4',
  sm: 'mb-8',
  md: 'mb-12',
  lg: 'mb-16'
} as const;

const containerMap = {
  content: 'mx-auto w-full max-w-6xl px-6 md:px-8',
  wide: 'mx-auto w-full max-w-7xl px-6 md:px-10',
  narrow: 'mx-auto w-full max-w-3xl px-6 md:px-8',
  full: 'w-full px-6 md:px-8',
  edge: 'w-full'
} as const;

const variantClasses = {
  default: '',
  muted: 'bg-gray-50',
  contrast: 'bg-secondary text-white',
  highlight: 'bg-primary text-white',
  accent: 'bg-accent/10'
} as const;

function resolveVisibilityClasses(visibility?: BlockStyle['visibility']) {
  if (!visibility) {
    return '';
  }
  const classes: string[] = [];
  if (visibility.mobile === false) {
    classes.push('hidden sm:block');
  }
  if (visibility.tablet === false) {
    classes.push('sm:hidden lg:block');
  }
  if (visibility.desktop === false) {
    classes.push('lg:hidden');
  }
  return classes.join(' ');
}

export function BlockSection({
  block,
  children,
  className,
  innerClassName,
  disableDefaultContainer,
  style
}: BlockSectionProps) {
  const styleConfig = block.style;
  const paddingClass = styleConfig?.spacing?.padding
    ? paddingMap[styleConfig.spacing.padding]
    : paddingMap.none;
  const marginTopClass = styleConfig?.spacing?.top
    ? marginTopMap[styleConfig.spacing.top]
    : marginTopMap.none;
  const marginBottomClass = styleConfig?.spacing?.bottom
    ? marginBottomMap[styleConfig.spacing.bottom]
    : marginBottomMap.none;
  const containerClass = styleConfig?.container
    ? containerMap[styleConfig.container]
    : containerMap.content;
  const variantClass = styleConfig?.variant
    ? variantClasses[styleConfig.variant]
    : variantClasses.default;
  const visibilityClass = resolveVisibilityClasses(styleConfig?.visibility);

  const inlineStyle: CSSProperties = {
    ...(styleConfig?.theme?.primary && {'--color-primary': styleConfig.theme.primary}),
    ...(styleConfig?.theme?.secondary && {'--color-secondary': styleConfig.theme.secondary}),
    ...(styleConfig?.theme?.accent && {'--color-accent': styleConfig.theme.accent}),
    ...(styleConfig?.theme?.text && {color: styleConfig.theme.text}),
    ...(styleConfig?.theme?.background && {backgroundColor: styleConfig.theme.background}),
    ...(styleConfig?.background?.color && {backgroundColor: styleConfig.background.color}),
    ...(styleConfig?.background?.image?.url && {
      backgroundImage: `url(${styleConfig.background.image.url})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: styleConfig.background.position ?? 'center'
    }),
    ...style
  } as CSSProperties;

  const overlay = styleConfig?.background?.overlay;

  const sectionClasses = clsx(
    'relative',
    paddingClass,
    marginTopClass,
    marginBottomClass,
    variantClass,
    visibilityClass,
    styleConfig?.background?.image && 'overflow-hidden',
    (styleConfig?.divider === 'top' || styleConfig?.divider === 'both') && 'border-t border-gray-200',
    (styleConfig?.divider === 'bottom' || styleConfig?.divider === 'both') && 'border-b border-gray-200',
    className
  );

  const innerClasses = clsx(
    disableDefaultContainer ? undefined : containerClass,
    'relative z-10',
    styleConfig?.align === 'center' && 'text-center mx-auto',
    styleConfig?.align === 'end' && 'text-right ml-auto',
    innerClassName
  );

  return (
    <section className={sectionClasses} style={inlineStyle} data-block-id={block.style?.id ?? block.id}>
      {overlay && (
        <div
          className={clsx(
            'pointer-events-none absolute inset-0',
            overlay === 'dark' ? 'bg-black/60' : 'bg-white/60'
          )}
          aria-hidden="true"
        />
      )}
      <div className={innerClasses}>{children}</div>
    </section>
  );
}
