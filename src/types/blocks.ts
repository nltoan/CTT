export type Cta = {
  label: string;
  href: string;
  external?: boolean;
};

export type MediaRef = {
  id: string;
  url: string;
  alt?: string;
  type?: 'image' | 'video';
};

export type BlockStyle = {
  id?: string;
  variant?: 'default' | 'muted' | 'contrast' | 'highlight' | 'accent';
  container?: 'content' | 'wide' | 'narrow' | 'full' | 'edge';
  align?: 'start' | 'center' | 'end';
  spacing?: {
    padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
    top?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
    bottom?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  };
  divider?: 'none' | 'top' | 'bottom' | 'both';
  background?: {
    color?: string;
    image?: MediaRef;
    position?: 'top' | 'center' | 'bottom';
    overlay?: 'light' | 'dark';
  };
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
};

export type BlockBase = {
  id?: string;
  style?: BlockStyle;
};

export type HeroCountdownBlock = BlockBase & {
  type: 'hero-countdown';
  heading: string;
  subheading?: string;
  description?: string;
  deadline?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  background?: MediaRef;
  overlay?: boolean;
  countdownLabel?: string;
};

export type DisciplinesGridBlock = BlockBase & {
  type: 'disciplines-grid';
  title?: string;
  description?: string;
  linkLabel?: string;
  items: {
    title: string;
    description?: string;
    image: MediaRef;
    href?: string;
    disciplineSlug?: string;
    linkLabel?: string;
  }[];
};

export type TimelineBlock = BlockBase & {
  type: 'timeline';
  title?: string;
  description?: string;
  items: {
    title: string;
    datetime: string;
    description?: string;
  }[];
};

export type PrizesBlock = BlockBase & {
  type: 'prizes';
  title?: string;
  description?: string;
  items: {
    title: string;
    description?: string;
    icon?: MediaRef;
  }[];
};

export type SponsorsGridBlock = BlockBase & {
  type: 'sponsors-grid';
  title?: string;
  description?: string;
  emptyStateMessage?: string;
  items: {
    name: string;
    logo: MediaRef;
    tier?: 'gold' | 'silver' | 'bronze';
    url?: string;
  }[];
};

export type PeopleGridBlock = BlockBase & {
  type: 'people-grid';
  title?: string;
  description?: string;
  emptyStateMessage?: string;
  items: {
    name: string;
    title?: string;
    photo?: MediaRef;
    bio?: string;
    disciplines?: string[];
    href?: string;
    ctaLabel?: string;
  }[];
};

export type PostListBlock = BlockBase & {
  type: 'post-list';
  title?: string;
  description?: string;
  ctaLabel?: string;
  emptyStateMessage?: string;
  query?: {
    limit?: number;
    category?: string;
    tag?: string;
    q?: string;
  };
};

export type EventListBlock = BlockBase & {
  type: 'event-list';
  title?: string;
  description?: string;
  ctaLabel?: string;
  detailLabel?: string;
  showDetailLinks?: boolean;
  emptyStateMessage?: string;
  query?: {
    from?: string;
    to?: string;
    limit?: number;
    status?: 'upcoming' | 'past' | 'all';
    category?: string;
    q?: string;
  };
};

export type ContactBlock = BlockBase & {
  type: 'contact';
  title?: string;
  address?: string;
  addressLabel?: string;
  phone?: string;
  phoneLabel?: string;
  email?: string;
  emailLabel?: string;
  mapEmbed?: string;
  formKey?: string;
};

export type TestimonialsBlock = BlockBase & {
  type: 'testimonials';
  title?: string;
  description?: string;
  items: {
    quote: string;
    name: string;
    title?: string;
    avatar?: MediaRef;
  }[];
};

export type ImageGalleryBlock = BlockBase & {
  type: 'image-gallery';
  title?: string;
  description?: string;
  layout?: 'grid' | 'masonry';
  items?: {
    media: MediaRef;
    caption?: string;
    href?: string;
  }[];
  source?: {
    type: 'gallery';
    slug: string;
    limit?: number;
    sort?: 'latest' | 'oldest';
  };
  emptyStateMessage?: string;
  viewAll?: {
    label?: string;
    href?: string;
  };
};

export type CtaButtonsBlock = BlockBase & {
  type: 'cta-buttons';
  title?: string;
  description?: string;
  items: Cta[];
  align?: 'start' | 'center';
};

export type SlideshowBlock = BlockBase & {
  type: 'slideshow';
  title?: string;
  description?: string;
  slides: {
    id: string;
    image: MediaRef;
    title?: string;
    caption?: string;
    href?: string;
  }[];
  options?: {
    autoplay?: boolean;
    interval?: number;
    loop?: boolean;
  };
};

export type RichContentBlock = BlockBase & {
  type: 'rich-content';
  title?: string;
  content: string;
};

export type Block =
  | HeroCountdownBlock
  | DisciplinesGridBlock
  | TimelineBlock
  | PrizesBlock
  | SponsorsGridBlock
  | PeopleGridBlock
  | PostListBlock
  | EventListBlock
  | ContactBlock
  | TestimonialsBlock
  | ImageGalleryBlock
  | CtaButtonsBlock
  | SlideshowBlock
  | RichContentBlock;
