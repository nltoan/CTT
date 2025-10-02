import type {Navigation} from '@types/cms';

const mainNavigations: Navigation[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `nav-header-${locale}`,
    key: 'header',
    tenantId: 'tenant-main',
    locale,
    items: [
      {id: `home-${locale}`, label: locale === 'vi' ? 'Trang chủ' : 'Home', href: '/'},
      {
        id: `news-${locale}`,
        label: locale === 'vi' ? 'Tin tức' : 'News',
        href: '/news'
      },
      {
        id: `events-${locale}`,
        label: locale === 'vi' ? 'Sự kiện' : 'Events',
        href: '/events'
      },
      {
        id: `about-${locale}`,
        label: locale === 'vi' ? 'Giới thiệu' : 'About',
        href: '/about'
      },
      {
        id: `contact-${locale}`,
        label: locale === 'vi' ? 'Liên hệ' : 'Contact',
        href: '/contact'
      }
    ]
  },
  {
    id: `nav-footer-${locale}`,
    key: 'footer',
    tenantId: 'tenant-main',
    locale,
    items: [
      {id: `privacy-${locale}`, label: locale === 'vi' ? 'Chính sách' : 'Policy', href: '/privacy'},
      {id: `terms-${locale}`, label: locale === 'vi' ? 'Điều khoản' : 'Terms', href: '/terms'}
    ]
  }
]);

const classicNavigations: Navigation[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `classic-nav-header-${locale}`,
    key: 'header',
    tenantId: 'tenant-classic',
    locale,
    items: [
      {id: `classic-home-${locale}`, label: locale === 'vi' ? 'Trang chủ' : 'Home', href: '/'},
      {
        id: `classic-about-${locale}`,
        label: locale === 'vi' ? 'Về học viện' : 'About',
        href: '/about'
      },
      {
        id: `classic-events-${locale}`,
        label: locale === 'vi' ? 'Lịch sự kiện' : 'Events',
        href: '/events'
      },
      {
        id: `classic-admissions-${locale}`,
        label: locale === 'vi' ? 'Tuyển sinh' : 'Admissions',
        href: '/news'
      }
    ]
  },
  {
    id: `classic-nav-footer-${locale}`,
    key: 'footer',
    tenantId: 'tenant-classic',
    locale,
    items: [
      {id: `classic-privacy-${locale}`, label: locale === 'vi' ? 'Chính sách' : 'Policy', href: '/privacy'},
      {id: `classic-terms-${locale}`, label: locale === 'vi' ? 'Điều khoản' : 'Terms', href: '/terms'}
    ]
  }
]);

export const navigations: Navigation[] = [...mainNavigations, ...classicNavigations];

export function findNavigation({
  tenantId,
  key,
  locale
}: {
  tenantId: string;
  key: 'header' | 'footer';
  locale: 'vi' | 'en';
}) {
  return navigations.find(
    (navigation) =>
      navigation.tenantId === tenantId && navigation.key === key && navigation.locale === locale
  );
}
