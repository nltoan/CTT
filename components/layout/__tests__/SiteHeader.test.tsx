import {fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ReactNode} from 'react';

import type {Navigation, Tenant} from '@types/cms';

vi.mock('next/link', () => ({
  default: ({children, ...props}: {children: ReactNode}) => <a {...props}>{children}</a>
}));

const mockUsePathname = vi.fn(() => '/vi');

vi.mock('next/navigation', () => ({
  usePathname: mockUsePathname
}));

vi.mock('../LanguageSwitcher', () => ({
  LanguageSwitcher: ({currentLocale}: {currentLocale: string}) => (
    <button type="button">switch-{currentLocale}</button>
  )
}));

import {SiteHeader} from '../SiteHeader';

const tenant: Tenant = {
  id: 'main',
  name: 'Main Tenant',
  slug: 'main',
  description: 'desc',
  primaryColor: '#111',
  secondaryColor: '#222',
  accentColor: '#333',
  fontDisplay: 'Display',
  fontBody: 'Body',
  socialLinks: [
    {id: 'fb', label: 'Facebook', url: 'https://facebook.com/main'}
  ]
};

const navigation: Navigation = {
  id: 'header',
  title: 'Header',
  items: [
    {id: 'home', label: 'Home', href: '', order: 1},
    {id: 'news', label: 'News', href: '/news', order: 2}
  ]
};

describe('SiteHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/vi');
  });

  it('renders desktop navigation links and language switcher', () => {
    render(<SiteHeader tenant={tenant} navigation={navigation} locale="vi" tenantPath="" />);

    expect(screen.getByText('Main Tenant')).toBeInTheDocument();
    expect(screen.getByText('switch-vi')).toBeInTheDocument();
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/vi');
    expect(screen.getByText('News').closest('a')).toHaveAttribute('href', '/vi/news');
  });

  it('toggles the mobile navigation menu', () => {
    render(<SiteHeader tenant={tenant} navigation={navigation} locale="vi" tenantPath="" />);

    const openButton = screen.getByRole('button', {name: /mở menu/i});
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', {name: /đóng menu/i});
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(openButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu when the route changes', () => {
    const {rerender} = render(
      <SiteHeader tenant={tenant} navigation={navigation} locale="vi" tenantPath="" />
    );

    fireEvent.click(screen.getByRole('button', {name: /mở menu/i}));
    expect(screen.getByRole('button', {name: /đóng menu/i})).toBeInTheDocument();

    mockUsePathname.mockReturnValue('/vi/news');
    rerender(<SiteHeader tenant={tenant} navigation={navigation} locale="vi" tenantPath="" />);

    expect(screen.queryByRole('button', {name: /đóng menu/i})).not.toBeInTheDocument();
  });
});
