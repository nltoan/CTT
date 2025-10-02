import type {Tenant} from '@types/cms';

export const tenants: Tenant[] = [
  {
    id: 'tenant-main',
    slug: 'main',
    name: 'CTT Music Showcase',
    description:
      'Nền tảng giới thiệu các cuộc thi và sự kiện âm nhạc quốc tế với đa dạng bộ môn.',
    primaryColor: '#d72638',
    secondaryColor: '#292f36',
    accentColor: '#f5a623',
    fontDisplay: '"Playfair Display", serif',
    fontBody: 'Inter, sans-serif',
    locales: ['vi', 'en'],
    domain: 'cimfc.local',
    socialLinks: [
      {id: 'main-facebook', label: 'Facebook', platform: 'facebook', url: 'https://facebook.com/cttmusic'},
      {id: 'main-youtube', label: 'YouTube', platform: 'youtube', url: 'https://youtube.com/@cttmusic'},
      {id: 'main-website', label: 'Website', platform: 'website', url: 'https://cttmusic.example.com'}
    ]
  },
  {
    id: 'tenant-classic',
    slug: 'classic',
    name: 'CTT Classical Academy',
    description:
      'Học viện âm nhạc cổ điển với các chương trình đào tạo và biểu diễn dành cho học viên trẻ.',
    primaryColor: '#1a5f7a',
    secondaryColor: '#0f172a',
    accentColor: '#f59e0b',
    fontDisplay: '"Cormorant Garamond", serif',
    fontBody: '"Source Sans Pro", sans-serif',
    locales: ['vi', 'en'],
    domain: 'classic.cimfc.local',
    socialLinks: [
      {id: 'classic-facebook', label: 'Facebook', platform: 'facebook', url: 'https://facebook.com/cttclassical'},
      {id: 'classic-instagram', label: 'Instagram', platform: 'instagram', url: 'https://instagram.com/cttclassical'}
    ]
  }
];

export function findTenantBySlug(slug: string) {
  return tenants.find((tenant) => tenant.slug === slug);
}

export function findTenantByDomain(domain: string) {
  return tenants.find((tenant) => tenant.domain === domain);
}
