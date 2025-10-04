import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {Breadcrumbs} from '@components/layout/Breadcrumbs';
import {getNavigation, getPost, getRelatedPosts} from '@lib/pages';
import {
  createPostMetadata,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildPath
} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getTenantPostStaticParams} from '@lib/static-paths';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getTenantPostStaticParams();
}

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string; slug: string};
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });
  const post = await getPost({tenantId: tenant.id, locale, slug: params.slug});

  if (!post) {
    return {};
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createPostMetadata({post, tenant, locale, tenantPath, settings});
}

export default async function TenantNewsDetail({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string; slug: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });
  const post = await getPost({tenantId: tenant.id, locale, slug: params.slug});

  if (!post) {
    notFound();
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const [headerNavigation, footerNavigation, relatedPosts] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getRelatedPosts({
      tenantId: tenant.id,
      locale,
      postId: post.id,
      category: post.category,
      tags: post.tags,
      limit: 3
    })
  ]);

  const articleJsonLd = buildArticleJsonLd({post, tenant, locale, tenantPath, settings});
  const breadcrumbItems: {label: string; slugSegments?: string[]}[] = [
    {label: locale === 'vi' ? 'Trang chủ' : 'Home'},
    {label: locale === 'vi' ? 'Tin tức' : 'News', slugSegments: ['news']},
    {label: post.title, slugSegments: ['news', post.slug]}
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    locale,
    tenantPath,
    items: breadcrumbItems.map((item) => ({name: item.label, slugSegments: item.slugSegments}))
  });
  const breadcrumbLinks = breadcrumbItems.map((item, index) => ({
    label: item.label,
    href:
      index === breadcrumbItems.length - 1
        ? undefined
        : buildPath({locale, tenantPath, slugSegments: item.slugSegments})
  }));

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      <article className="bg-white py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(articleJsonLd)}}
        />
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbJsonLd)}}
          />
        )}
        <Breadcrumbs
          items={breadcrumbLinks}
          className="mx-auto w-full max-w-3xl px-6 pb-4 text-gray-500"
        />
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary">
              {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN')}
            </p>
            <h1 className="font-display text-4xl text-secondary">{post.title}</h1>
            {post.excerpt && <p className="text-base text-gray-600">{post.excerpt}</p>}
          </header>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-3xl object-cover shadow-lg"
            />
          )}
          <div className="space-y-4 text-lg leading-relaxed text-gray-700">
            {post.content ? (
              <div dangerouslySetInnerHTML={{__html: post.content}} />
            ) : (
              <p>
                {locale === 'vi'
                  ? 'Nội dung bài viết đang được cập nhật. Vui lòng quay lại sau.'
                  : 'The article content is being updated. Please check back soon.'}
              </p>
            )}
          </div>
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
      {relatedPosts.length ? (
        <aside className="bg-slate-50 py-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
            <h2 className="text-2xl font-semibold text-secondary">
              {locale === 'vi' ? 'Bài viết liên quan' : 'Related articles'}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <time className="text-xs uppercase tracking-wide text-primary">
                    {new Date(related.publishedAt).toLocaleDateString(
                      locale === 'en' ? 'en-US' : 'vi-VN'
                    )}
                  </time>
                  <h3 className="mt-2 text-base font-semibold text-secondary">{related.title}</h3>
                  {related.excerpt && (
                    <p className="mt-2 text-xs text-gray-600">{related.excerpt}</p>
                  )}
                  <Link
                    href={`/${locale}${tenantPath}/news/${related.slug}`}
                    className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:opacity-80"
                  >
                    {locale === 'vi' ? 'Đọc ngay' : 'Read article'} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </aside>
      ) : null}
    </PageShell>
  );
}
