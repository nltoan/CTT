import {notFound} from 'next/navigation';
import Link from 'next/link';

import type {Metadata} from 'next';
import {PageShell} from '@components/layout/PageShell';
import {Breadcrumbs} from '@components/layout/Breadcrumbs';
import {getNavigation} from '@lib/pages';
import {getGallery} from '@lib/galleries';
import {
  createGalleryMetadata,
  buildGalleryJsonLd,
  buildBreadcrumbJsonLd,
  buildPath
} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getTenantGalleryStaticParams} from '@lib/static-paths';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getTenantGalleryStaticParams();
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
  const gallery = await getGallery({tenantId: tenant.id, locale, slug: params.slug});

  if (!gallery) {
    return {};
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createGalleryMetadata({gallery, tenant, locale, tenantPath, settings});
}

export default async function TenantGalleryDetail({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string; slug: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });
  const gallery = await getGallery({tenantId: tenant.id, locale, slug: params.slug});

  if (!gallery) {
    notFound();
  }

  const [headerNavigation, footerNavigation, settings] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getSettingsForTenant({tenantId: tenant.id, locale})
  ]);

  const jsonLd = buildGalleryJsonLd({gallery, tenant, locale, tenantPath, settings});
  const breadcrumbItems: {label: string; slugSegments?: string[]}[] = [
    {label: locale === 'vi' ? 'Trang chủ' : 'Home'},
    {label: locale === 'vi' ? 'Thư viện' : 'Galleries', slugSegments: ['galleries']},
    {label: gallery.title, slugSegments: ['galleries', gallery.slug]}
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

  const backHref = `/${[locale, tenantPath.replace(/^\//, ''), 'galleries'].filter(Boolean).join('/')}`.replace(/\/+/, '/');
  const layout = gallery.layout ?? 'grid';

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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <div className="space-y-6 text-center">
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
            {breadcrumbJsonLd ? (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbJsonLd)}}
              />
            ) : null}
            <Breadcrumbs items={breadcrumbLinks} className="flex justify-center" />
            <Link
              href={backHref}
              className="inline-flex items-center text-sm font-semibold text-primary hover:opacity-80"
            >
              {locale === 'vi' ? '← Quay lại Thư viện' : '← Back to Galleries'}
            </Link>
            <header className="space-y-4">
              {gallery.category ? (
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {gallery.category}
                </span>
              ) : null}
              <h1 className="font-display text-4xl text-secondary">{gallery.title}</h1>
              {gallery.description ? (
                <p className="text-base text-gray-600">{gallery.description}</p>
              ) : null}
              {gallery.tags?.length ? (
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                  {gallery.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>
          </div>

          {gallery.items.length ? (
            layout === 'masonry' ? (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {gallery.items.map((item) => (
                  <figure
                    key={item.id}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.media.url}
                      alt={item.media.alt ?? gallery.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {item.caption ? (
                      <figcaption className="bg-secondary bg-opacity-90 px-4 py-3 text-sm text-white">
                        {item.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {gallery.items.map((item) => (
                  <figure
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.media.url}
                      alt={item.media.alt ?? gallery.title}
                      className="h-64 w-full object-cover"
                      loading="lazy"
                    />
                    {item.caption ? (
                      <figcaption className="px-4 py-3 text-sm text-secondary text-opacity-80">
                        {item.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            )
          ) : (
            <p className="rounded-3xl border border-dashed border-gray-200 bg-slate-50 p-12 text-center text-sm text-gray-500">
              {locale === 'vi'
                ? 'Bộ sưu tập chưa có hình ảnh hoặc video nào.'
                : 'This gallery does not contain any media yet.'}
            </p>
          )}
        </div>
      </article>
    </PageShell>
  );
}
