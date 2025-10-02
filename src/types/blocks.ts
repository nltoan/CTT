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

export type HeroCountdownBlock = {
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

export type DisciplinesGridBlock = {
  type: 'disciplines-grid';
  title?: string;
  description?: string;
  items: {
    title: string;
    description?: string;
    image: MediaRef;
    href?: string;
  }[];
};

export type TimelineBlock = {
  type: 'timeline';
  title?: string;
  description?: string;
  items: {
    title: string;
    datetime: string;
    description?: string;
  }[];
};

export type PrizesBlock = {
  type: 'prizes';
  title?: string;
  description?: string;
  items: {
    title: string;
    description?: string;
    icon?: MediaRef;
  }[];
};

export type SponsorsGridBlock = {
  type: 'sponsors-grid';
  title?: string;
  description?: string;
  items: {
    name: string;
    logo: MediaRef;
    tier?: 'gold' | 'silver' | 'bronze';
    url?: string;
  }[];
};

export type PeopleGridBlock = {
  type: 'people-grid';
  title?: string;
  description?: string;
  items: {
    name: string;
    title?: string;
    photo?: MediaRef;
    bio?: string;
  }[];
};

export type PostListBlock = {
  type: 'post-list';
  title?: string;
  description?: string;
  ctaLabel?: string;
  query?: {
    limit?: number;
    category?: string;
  };
};

export type ContactBlock = {
  type: 'contact';
  title?: string;
  address?: string;
  addressLabel?: string;
  phone?: string;
  phoneLabel?: string;
  email?: string;
  emailLabel?: string;
  mapEmbed?: string;
};

export type TestimonialsBlock = {
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

export type ImageGalleryBlock = {
  type: 'image-gallery';
  title?: string;
  description?: string;
  layout?: 'grid' | 'masonry';
  items: {
    media: MediaRef;
    caption?: string;
    href?: string;
  }[];
};

export type CtaButtonsBlock = {
  type: 'cta-buttons';
  title?: string;
  description?: string;
  items: Cta[];
  align?: 'start' | 'center';
};

export type SlideshowBlock = {
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

export type RichContentBlock = {
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
  | ContactBlock
  | TestimonialsBlock
  | ImageGalleryBlock
  | CtaButtonsBlock
  | SlideshowBlock
  | RichContentBlock;
