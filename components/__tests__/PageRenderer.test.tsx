import React, {type ReactNode} from 'react';
import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

vi.mock('next/link', () => ({
  default: ({children, ...props}: {children: ReactNode}) => <a {...props}>{children}</a>
}));

import type {Block} from '@types/blocks';
import type {Event, Post, Slideshow as SlideshowData} from '@types/cms';
import {PageRenderer, isBlockHiddenEverywhere} from '../PageRenderer';

describe('PageRenderer', () => {
  it('identifies blocks hidden on all breakpoints', () => {
    const block: Block = {
      type: 'rich-content',
      content: '<p>Hidden block</p>',
      style: {visibility: {desktop: false, tablet: false, mobile: false}}
    };

    expect(isBlockHiddenEverywhere(block)).toBe(true);
  });

  it('renders visible blocks and loads posts', async () => {
    const visibleBlock: Block = {
      type: 'rich-content',
      content: '<p>Nội dung nổi bật</p>'
    };

    const postListBlock: Block = {
      type: 'post-list',
      title: 'Tin mới',
      query: {limit: 1}
    };

    const posts: Post[] = [
      {
        id: 'post-1',
        slug: 'post-1',
        title: 'Bài viết thử nghiệm',
        translationKey: 'post-1',
        publishedAt: new Date('2024-01-01').toISOString(),
        tenantId: 'tenant-main',
        locale: 'vi'
      }
    ];

    const getPosts = vi
      .fn<(query?: {limit?: number; category?: string; tag?: string; q?: string}) => Promise<Post[]>>()
      .mockResolvedValue(posts);
    const getEvents = vi
      .fn<(options?: {limit?: number; status?: string; category?: string; q?: string}) => Promise<Event[]>>()
      .mockResolvedValue([]);

    const getGallery = vi
      .fn<(options: {slug: string; limit?: number; sort?: 'latest' | 'oldest'}) => Promise<null>>()
      .mockResolvedValue(null);
    const getSlideshow = vi.fn<(options: {id: string; limit?: number}) => Promise<SlideshowData | null>>()
      .mockResolvedValue(null);

    const ui = await PageRenderer({
      blocks: [visibleBlock, postListBlock],
      locale: 'vi',
      getPosts,
      getEvents,
      getGallery,
      getSlideshow,
      tenantPath: '',
      tenantId: 'tenant-main'
    });

    render(ui);

    expect(getPosts).toHaveBeenCalledWith({limit: 1});
    expect(await screen.findByText('Nội dung nổi bật')).toBeInTheDocument();
    expect(await screen.findByText('Bài viết thử nghiệm')).toBeInTheDocument();
  });

  it('skips rendering blocks hidden everywhere', async () => {
    const visibleBlock: Block = {
      type: 'rich-content',
      content: '<p>Hiển thị</p>'
    };

    const hiddenBlock: Block = {
      type: 'rich-content',
      content: '<p>Không hiển thị</p>',
      style: {visibility: {desktop: false, tablet: false, mobile: false}}
    };

    const getPosts = vi
      .fn<(query?: {limit?: number; category?: string; tag?: string; q?: string}) => Promise<Post[]>>()
      .mockResolvedValue([]);
    const getEvents = vi
      .fn<(options?: {limit?: number; status?: string; category?: string; q?: string}) => Promise<Event[]>>()
      .mockResolvedValue([]);

    const getGallery = vi
      .fn<(options: {slug: string; limit?: number; sort?: 'latest' | 'oldest'}) => Promise<null>>()
      .mockResolvedValue(null);
    const getSlideshow = vi.fn<(options: {id: string; limit?: number}) => Promise<SlideshowData | null>>()
      .mockResolvedValue(null);

    const ui = await PageRenderer({
      blocks: [visibleBlock, hiddenBlock],
      locale: 'vi',
      getPosts,
      getEvents,
      getGallery,
      getSlideshow,
      tenantPath: '',
      tenantId: 'tenant-main'
    });

    render(ui);

    expect(screen.getByText('Hiển thị')).toBeInTheDocument();
    expect(screen.queryByText('Không hiển thị')).not.toBeInTheDocument();
  });

  it('tải slideshow khi block tham chiếu dữ liệu từ thư viện', async () => {
    const slideshowBlock: Block = {
      type: 'slideshow',
      title: 'Khoảnh khắc nổi bật',
      source: {type: 'slideshow', id: 'hero', limit: 2},
      emptyStateMessage: 'Không có slide',
      style: {container: 'wide'}
    } as Block;

    const getPosts = vi
      .fn<(query?: {limit?: number; category?: string; tag?: string; q?: string}) => Promise<Post[]>>()
      .mockResolvedValue([]);
    const getEvents = vi
      .fn<(options?: {limit?: number; status?: string; category?: string; q?: string}) => Promise<Event[]>>()
      .mockResolvedValue([]);
    const getGallery = vi
      .fn<(options: {slug: string; limit?: number; sort?: 'latest' | 'oldest'}) => Promise<null>>()
      .mockResolvedValue(null);
    const getSlideshow = vi
      .fn<(options: {id: string; limit?: number}) => Promise<SlideshowData | null>>()
      .mockResolvedValue({
        id: 'hero',
        tenantId: 'tenant-main',
        locale: 'vi',
        name: 'Hero',
        slides: [
          {
            id: 'slide-1',
            title: 'Slide 1',
            caption: 'Giới thiệu',
            image: {id: 'img-1', url: 'https://example.com/slide1.jpg'}
          }
        ]
      });

    const ui = await PageRenderer({
      blocks: [slideshowBlock],
      locale: 'vi',
      getPosts,
      getEvents,
      getGallery,
      getSlideshow,
      tenantPath: '',
      tenantId: 'tenant-main'
    });

    render(ui);

    expect(getSlideshow).toHaveBeenCalledWith({id: 'hero', limit: 2});
    expect(await screen.findByText('Slide 1')).toBeInTheDocument();
  });
});
