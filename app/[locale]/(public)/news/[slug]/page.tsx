import {notFound} from 'next/navigation';

import type {Metadata} from 'next';
import {PageShell} from '@components/layout/PageShell';
import {getNavigation, getPost} from '@lib/pages';
import {createPostMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant} from '@lib/settings';

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; slug: string; tenant?: string};
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

export default async function NewsDetail({
  params
}: {
  params: {locale: 'vi' | 'en'; slug: string; tenant?: string};
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

  const [headerNavigation, footerNavigation] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale})
  ]);

  const articleJsonLd = buildArticleJsonLd({post, tenant, locale, tenantPath, settings});
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    locale,
    tenantPath,
    items: [
      {name: locale === 'vi' ? 'Trang chủ' : 'Home'},
      {name: locale === 'vi' ? 'Tin tức' : 'News', slugSegments: ['news']},
      {name: post.title, slugSegments: ['news', post.slug]}
    ]
  });

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
        </div>
      </article>
    </PageShell>
  );
}
