import Link from 'next/link';
import clsx from 'clsx';

import type {PostListBlock} from '@types/blocks';
import type {Post} from '@types/cms';
import {BlockSection} from './BlockSection';

export function PostList({
  block,
  posts,
  locale,
  tenantPath = ''
}: {
  block: PostListBlock;
  posts: Post[];
  locale: string;
  tenantPath?: string;
}) {
  const headingAlign =
    block.style?.align === 'center'
      ? 'text-center'
      : block.style?.align === 'end'
        ? 'text-right'
        : 'text-left';

  return (
    <BlockSection block={block} innerClassName="flex flex-col gap-8">
      {(block.title || block.description) && (
        <header className={clsx('flex flex-col gap-2', headingAlign)}>
          {block.title && <h2 className="font-display text-3xl text-secondary">{block.title}</h2>}
          {block.description && <p className="text-base text-gray-600">{block.description}</p>}
        </header>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
            )}
            <div className="space-y-3 p-6">
              <time className="text-xs font-semibold uppercase text-primary">
                {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN')}
              </time>
              <h3 className="text-xl font-semibold text-secondary">{post.title}</h3>
              {post.excerpt && <p className="text-sm text-gray-600">{post.excerpt}</p>}
              <Link
                href={`/${locale}${tenantPath}/news/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
              >
                {block.ctaLabel ?? (locale === 'vi' ? 'Đọc thêm' : 'Read more')} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </BlockSection>
  );
}
