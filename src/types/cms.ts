import type {Block} from './blocks';

export type TenantSocialLink = {
  id: string;
  label: string;
  url: string;
  platform?: 'facebook' | 'youtube' | 'instagram' | 'tiktok' | 'website' | string;
};

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  locales: ('vi' | 'en')[];
  domain?: string;
  fontDisplay?: string;
  fontBody?: string;
  socialLinks?: TenantSocialLink[];
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  order?: number;
  target?: '_blank' | '_self';
};

export type Navigation = {
  id: string;
  key: 'header' | 'footer';
  tenantId: string;
  items: NavigationItem[];
  locale: 'vi' | 'en';
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  tenantId: string;
  locale: 'vi' | 'en';
  blocks: Block[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  content?: string;
  publishedAt: string;
  tenantId: string;
  locale: 'vi' | 'en';
};

export type Event = {
  id: string;
  tenantId: string;
  locale: 'vi' | 'en';
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  description?: string;
};
