import {notFound} from 'next/navigation';
import Link from 'next/link';
import type {Metadata} from 'next';

import {PageShell} from '@components/layout/PageShell';
import {PageRenderer} from '@components/PageRenderer';
import {getNavigation} from '@lib/pages';
import {
  getDiscipline,
  getRelatedDisciplines
} from '@lib/disciplines';
import {
  createDisciplineMetadata,
  buildDisciplineJsonLd,
  buildBreadcrumbJsonLd
} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';
import {getSettingsForTenant, DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';
import {getRootDisciplineStaticParams} from '@lib/static-paths';
import {getPeopleBySlugs} from '@lib/people';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getRootDisciplineStaticParams();
}

function formatDateTime(value?: string, locale: 'vi' | 'en') {
  if (!value) {
    return undefined;
  }
  try {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return undefined;
  }
}

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; slug: string; tenant?: string};
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });
  const discipline = await getDiscipline({tenantId: tenant.id, locale, slug: params.slug});

  if (!discipline) {
    return {};
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  return createDisciplineMetadata({discipline, tenant, locale, tenantPath, settings});
}

export default async function DisciplineDetail({
  params
}: {
  params: {locale: 'vi' | 'en'; slug: string; tenant?: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params: {tenant: params.tenant, slug: [params.slug]},
    locale: params.locale
  });

  const discipline = await getDiscipline({tenantId: tenant.id, locale, slug: params.slug});

  if (!discipline) {
    notFound();
  }

  const settings = getSettingsForTenant({tenantId: tenant.id, locale});

  const [headerNavigation, footerNavigation, relatedDisciplines, juryPeople, mentorPeople] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getRelatedDisciplines({tenantId: tenant.id, locale, excludeSlug: discipline.slug, limit: 3}),
    getPeopleBySlugs({tenantId: tenant.id, locale, slugs: discipline.jury}),
    getPeopleBySlugs({tenantId: tenant.id, locale, slugs: discipline.relatedPeople})
  ]);

  const jsonLd = buildDisciplineJsonLd({discipline, tenant, locale, tenantPath, settings});
  const breadcrumbs = buildBreadcrumbJsonLd({
    tenant,
    locale,
    tenantPath,
    items: [
      {
        name: locale === 'vi' ? 'Bộ môn' : 'Disciplines',
        url: `/${locale}${tenantPath}/disciplines`
      },
      {
        name: discipline.name,
        url: `/${locale}${tenantPath}/disciplines/${discipline.slug}`
      }
    ]
  });

  const infoItems: {label: string; value?: string}[] = [
    {
      label: locale === 'vi' ? 'Phân loại' : 'Category',
      value: discipline.category
    },
    {
      label: locale === 'vi' ? 'Trình độ' : 'Level',
      value: discipline.level
    },
    {
      label: locale === 'vi' ? 'Độ tuổi' : 'Age range',
      value: discipline.ageRange
    }
  ].filter((item) => Boolean(item.value));

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
      settings={settings}
    >
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />}
      {breadcrumbs && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbs)}} />
      )}

      <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
        {discipline.coverImage?.url && (
          <div className="absolute inset-0">
            <img
              src={discipline.coverImage.url}
              alt={discipline.coverImage.alt ?? discipline.name}
              className="h-full w-full object-cover opacity-40"
            />
          </div>
        )}
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
          <div className="inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em]">
            <span>{locale === 'vi' ? 'Bộ môn' : 'Discipline'}</span>
            {discipline.category && <span className="font-semibold text-primary-200">· {discipline.category}</span>}
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{discipline.name}</h1>
          {discipline.shortDescription && (
            <p className="max-w-3xl text-lg text-slate-100/90">{discipline.shortDescription}</p>
          )}
          {infoItems.length > 0 && (
            <dl className="mt-2 flex flex-wrap gap-4 text-sm text-slate-100/80">
              {infoItems.map((item) => (
                <div key={item.label} className="rounded-full bg-white/10 px-4 py-1.5">
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {discipline.tags && discipline.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-slate-100/70">
              {discipline.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/30 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            {discipline.description && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {locale === 'vi' ? 'Giới thiệu' : 'Overview'}
                </h2>
                <p className="text-base leading-relaxed text-slate-700">{discipline.description}</p>
              </div>
            )}

            {discipline.repertoire && discipline.repertoire.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  {locale === 'vi' ? 'Gợi ý tiết mục' : 'Suggested repertoire'}
                </h3>
                <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
                  {discipline.repertoire.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {discipline.requirements && discipline.requirements.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  {locale === 'vi' ? 'Yêu cầu bắt buộc' : 'Requirements'}
                </h3>
                <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
                  {discipline.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {discipline.schedule && discipline.schedule.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  {locale === 'vi' ? 'Lịch trình' : 'Schedule'}
                </h3>
                <ul className="space-y-3">
                  {discipline.schedule.map((item) => (
                    <li key={item.title} className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-primary">{formatDateTime(item.startsAt, locale)}</p>
                      <p className="text-base font-semibold text-slate-900">{item.title}</p>
                      {item.description && (
                        <p className="text-sm text-slate-600">{item.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {discipline.blocks && discipline.blocks.length > 0 && (
              <PageRenderer
                blocks={discipline.blocks}
                locale={locale}
                tenantId={tenant.id}
                tenantPath={tenantPath}
                getPosts={async () => []}
                getEvents={async () => []}
                getGallery={async () => null}
              />
            )}
          </div>

          <aside className="space-y-10">
            {juryPeople.length > 0 && (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  {locale === 'vi' ? 'Ban giám khảo' : 'Jury'}
                </h3>
                <ul className="space-y-4">
                  {juryPeople.map((person) => (
                    <li key={person.id} className="flex items-center gap-4">
                      {person.photo?.url ? (
                        <img
                          src={person.photo.url}
                          alt={person.photo.alt ?? person.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                          {person.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          <Link href={`/${locale}${tenantPath}/people/${person.slug}`} className="hover:text-primary">
                            {person.name}
                          </Link>
                        </p>
                        {person.title && <p className="text-xs text-slate-500">{person.title}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mentorPeople.length > 0 && (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  {locale === 'vi' ? 'Cố vấn đề xuất' : 'Suggested mentors'}
                </h3>
                <ul className="space-y-4">
                  {mentorPeople.map((person) => (
                    <li key={person.id} className="flex flex-col gap-1">
                      <Link href={`/${locale}${tenantPath}/people/${person.slug}`} className="text-sm font-semibold text-primary">
                        {person.name}
                      </Link>
                      {person.disciplines && (
                        <p className="text-xs text-slate-500">{person.disciplines.join(' • ')}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedDisciplines.length > 0 && (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  {locale === 'vi' ? 'Bộ môn liên quan' : 'Related disciplines'}
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  {relatedDisciplines.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/${locale}${tenantPath}/disciplines/${item.slug}`}
                        className="font-semibold text-primary hover:opacity-80"
                      >
                        {item.name}
                      </Link>
                      {item.shortDescription && <p className="text-xs text-slate-500">{item.shortDescription}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
