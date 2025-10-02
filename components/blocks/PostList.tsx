import Link from 'next/link';

import type {PostListBlock} from '@types/blocks';
import type {Post} from '@types/cms';

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
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        {(block.title || block.description) && (
          <header className="flex flex-col gap-2 text-center">
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
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                >
                  {block.ctaLabel ?? (locale === 'vi' ? 'Đọc thêm' : 'Read more')} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
