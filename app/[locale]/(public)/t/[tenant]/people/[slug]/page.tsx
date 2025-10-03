import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';

import {PageShell} from '@components/layout/PageShell';
import {PageRenderer} from '@components/PageRenderer';
import {PeopleGrid} from '@components/blocks/PeopleGrid';
import {getNavigation} from '@lib/pages';
import {getPersonBySlug, getRelatedPeople} from '@lib/people';
import {
  createPersonMetadata,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd
} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getTenantPersonStaticParams} from '@lib/static-paths';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getTenantPersonStaticParams();
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

  const person = await getPersonBySlug({tenantId: tenant.id, locale, slug: params.slug});

  if (!person) {
    return {};
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createPersonMetadata({person, tenant, locale, tenantPath, settings});
}

export default async function TenantPersonDetail({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string; slug: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });

  const person = await getPersonBySlug({tenantId: tenant.id, locale, slug: params.slug});

  if (!person) {
    notFound();
  }

  const [headerNavigation, footerNavigation, related, settings] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getRelatedPeople({tenantId: tenant.id, locale, excludePersonId: person.id}),
    getSettingsForTenant({tenantId: tenant.id, locale})
  ]);

  const profilePath = `/${[locale, tenantPath.replace(/^\//, ''), 'people', person.slug]
    .filter(Boolean)
    .join('/')}`.replace(/\/+/, '/');

  const breadcrumb = buildBreadcrumbJsonLd({
    locale,
    tenantPath,
    items: [
      {name: locale === 'vi' ? 'Trang chủ' : 'Home'},
      {name: locale === 'vi' ? 'Ban cố vấn & giám khảo' : 'Advisory board & jury', slugSegments: ['people']},
      {name: person.name, slugSegments: ['people', person.slug]}
    ]
  });
  const organizationJsonLd = buildOrganizationJsonLd({tenant, locale, tenantPath, settings});
  const personJsonLd = buildPersonJsonLd({
    person,
    tenant,
    locale,
    tenantPath,
    settings
  });

  const hasAchievements = person.achievements?.length;
  const hasHighlights = person.highlights?.length;
  const hasBlocks = person.blocks?.length;

  const relatedBlock = related.length
    ? {
        type: 'people-grid' as const,
        title: locale === 'vi' ? 'Thành viên khác' : 'More mentors & judges',
        description:
          locale === 'vi'
            ? 'Khám phá thêm những chuyên gia đang đồng hành cùng CTT.'
            : 'Meet other experts supporting the CTT journey.',
        items: related.map((item) => ({
          name: item.name,
          title: item.title,
          photo: item.photo,
          bio: item.bio,
          disciplines: item.disciplines,
          href: `/${[locale, tenantPath.replace(/^\//, ''), 'people', item.slug].filter(Boolean).join('/')}`.replace(
            /\/+/,
            '/'
          ),
          ctaLabel: locale === 'vi' ? 'Xem hồ sơ' : 'View profile'
        }))
      }
    : undefined;

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {organizationJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd)}} />
      )}
      {personJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(personJsonLd)}} />
      )}
      {breadcrumb && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb)}} />
      )}

      <article className="bg-white py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
          <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              {person.photo ? (
                <img
                  src={person.photo.url}
                  alt={person.photo.alt ?? person.name}
                  className="h-40 w-40 rounded-full border-4 border-primary/20 object-cover shadow-lg"
                />
              ) : null}
              <div className="space-y-2">
                <h1 className="font-display text-4xl text-secondary">{person.name}</h1>
                {person.title ? <p className="text-lg text-gray-600">{person.title}</p> : null}
                {person.disciplines?.length ? (
                  <ul className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-wide lg:justify-start">
                    {person.disciplines.map((discipline) => (
                      <li
                        key={discipline}
                        className="rounded-full bg-secondary/5 px-3 py-1 font-semibold text-secondary/80"
                      >
                        {discipline}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {person.quote ? (
                <blockquote className="rounded-2xl bg-secondary/5 p-6 text-secondary/80">
                  <p className="text-base italic">“{person.quote}”</p>
                </blockquote>
              ) : null}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
                <Link href={profilePath} className="text-secondary/60 underline underline-offset-4">
                  {locale === 'vi' ? 'Liên kết tĩnh' : 'Canonical link'}
                </Link>
                {person.contactEmail ? (
                  <a
                    href={`mailto:${person.contactEmail}`}
                    className="rounded-full border border-primary/20 px-4 py-2 text-sm text-primary transition hover:bg-primary/10"
                  >
                    {locale === 'vi' ? 'Liên hệ email' : 'Contact via email'}
                  </a>
                ) : null}
                {person.contactPhone ? (
                  <a
                    href={`tel:${person.contactPhone}`}
                    className="rounded-full border border-primary/20 px-4 py-2 text-sm text-primary transition hover:bg-primary/10"
                  >
                    {locale === 'vi' ? 'Gọi trực tiếp' : 'Call now'}
                  </a>
                ) : null}
              </div>
            </div>
            {person.videoEmbedUrl ? (
              <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-3xl shadow-xl">
                <iframe
                  src={person.videoEmbedUrl}
                  title={person.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : null}
          </header>

          <section className="grid gap-8 lg:grid-cols-3">
            {hasAchievements ? (
              <div className="rounded-3xl bg-secondary/5 p-6">
                <h2 className="text-lg font-semibold text-secondary">{locale === 'vi' ? 'Thành tựu' : 'Achievements'}</h2>
                <ul className="mt-4 space-y-3 text-sm text-secondary/80">
                  {person.achievements?.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasHighlights ? (
              <div className="rounded-3xl bg-white p-6 shadow-md lg:col-span-2">
                <h2 className="text-lg font-semibold text-secondary">
                  {locale === 'vi' ? 'Điểm nhấn gần đây' : 'Recent highlights'}
                </h2>
                <dl className="mt-4 space-y-4">
                  {person.highlights?.map((highlight) => (
                    <div key={`${highlight.year}-${highlight.title}`} className="rounded-2xl border border-gray-100 p-4">
                      <dt className="flex items-center gap-3 text-sm font-semibold text-primary">
                        {highlight.year ? <span>{highlight.year}</span> : null}
                        <span>{highlight.title}</span>
                      </dt>
                      {highlight.description ? (
                        <dd className="mt-2 text-sm text-secondary/80">{highlight.description}</dd>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </section>

          {hasBlocks ? <PageRenderer blocks={person.blocks ?? []} locale={locale} tenantPath={tenantPath} /> : null}
        </div>
      </article>

      {relatedBlock ? <PeopleGrid block={relatedBlock} /> : null}
    </PageShell>
  );
}
