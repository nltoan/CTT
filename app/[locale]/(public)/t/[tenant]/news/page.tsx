import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {getNavigation, getRecentPosts} from '@lib/pages';
import {readTenantResolutionFromRequest} from '@lib/tenant';

export const dynamic = 'force-static';

export default async function TenantNewsIndex({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string; slug?: string[]};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });
  const [headerNavigation, footerNavigation, posts] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getRecentPosts({tenantId: tenant.id, locale})
  ]);

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
    >
      <section className="bg-slate-50 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <header className="space-y-3 text-center">
            <h1 className="font-display text-4xl text-secondary">
              {locale === 'vi' ? 'Tin tức' : 'News'}
            </h1>
            <p className="text-base text-gray-600">
              {locale === 'vi'
                ? 'Cập nhật thông tin mới nhất về cuộc thi và các hoạt động âm nhạc.'
                : 'Stay updated with the latest announcements and stories.'}
            </p>
          </header>
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
                  <h2 className="text-xl font-semibold text-secondary">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-gray-600">{post.excerpt}</p>}
                  <Link
                    href={`/${locale}${tenantPath}/news/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                  >
                    {locale === 'vi' ? 'Đọc thêm' : 'Read more'} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
