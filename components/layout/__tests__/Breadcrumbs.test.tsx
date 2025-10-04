import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import type {ReactNode} from 'react';

vi.mock('next/link', () => ({
  default: ({children, ...props}: {children: ReactNode}) => <a {...props}>{children}</a>
}));

import {Breadcrumbs} from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders links for intermediate items and text for the current page', () => {
    render(
      <Breadcrumbs
        items={[
          {label: 'Home', href: '/vi'},
          {label: 'News', href: '/vi/news'},
          {label: 'New scholarship announced'}
        ]}
      />
    );

    const nav = screen.getByLabelText(/Breadcrumb/i);
    expect(nav).toBeInTheDocument();

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/vi');
    expect(screen.getByText('News').closest('a')).toHaveAttribute('href', '/vi/news');
    expect(screen.getByText('New scholarship announced').tagName).toBe('SPAN');
  });

  it('returns null when no items are provided', () => {
    const {container} = render(<Breadcrumbs items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('supports inverted tone for dark sections', () => {
    render(
      <Breadcrumbs
        tone="inverted"
        items={[
          {label: 'Home', href: '/'},
          {label: 'Events', href: '/events'},
          {label: 'Final round'}
        ]}
      />
    );

    const nav = screen.getByLabelText(/Breadcrumb/i);
    expect(nav.className).toContain('text-white/70');
    expect(screen.getByText('Final round').className).toContain('text-white');
  });
});
