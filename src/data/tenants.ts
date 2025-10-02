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
    locales: ['vi', 'en'],
    domain: 'cimfc.local'
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
    locales: ['vi', 'en'],
    domain: 'classic.cimfc.local'
  }
];

export function findTenantBySlug(slug: string) {
  return tenants.find((tenant) => tenant.slug === slug);
}

export function findTenantByDomain(domain: string) {
  return tenants.find((tenant) => tenant.domain === domain);
}
