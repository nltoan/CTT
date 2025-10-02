import type {Metadata} from 'next';

import {PeopleGrid} from '@components/blocks/PeopleGrid';
import {PageShell} from '@components/layout/PageShell';
import {getNavigation} from '@lib/pages';
import {getPeople} from '@lib/people';
import {createCollectionMetadata, buildPeopleJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';

const buildBaseBlock = (locale: 'vi' | 'en') => ({
  type: 'people-grid' as const,
  title: locale === 'vi' ? 'Ban cố vấn & giám khảo' : 'Advisory board & jury',
  description:
    locale === 'vi'
      ? 'Những nghệ sĩ và nhà sư phạm đồng hành cùng thí sinh trong suốt hành trình.'
      : 'Artists and pedagogues mentoring contestants throughout their journey.',
  emptyStateMessage:
    locale === 'vi'
      ? 'Danh sách ban cố vấn sẽ được công bố sớm.'
      : 'The advisory line-up will be announced soon.'
});

export const dynamic = 'force-static';

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant?: string};
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const title = locale === 'vi' ? 'Ban cố vấn & giám khảo' : 'Advisory board & jury';
  const description =
    locale === 'vi'
      ? 'Những nghệ sĩ và nhà sư phạm đồng hành cùng thí sinh trong suốt hành trình.'
      : 'Artists and pedagogues mentoring contestants throughout their journey.';

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['people'],
    title,
    description
  });
}

export default async function PeopleIndex({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant?: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const [headerNavigation, footerNavigation, people] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getPeople({tenantId: tenant.id, locale})
  ]);

  const block = {
    ...buildBaseBlock(locale),
    items: people.map((person) => ({
      name: person.name,
      title: person.title,
      bio: person.bio,
      photo: person.photo
    }))
  };

  const peopleJsonLd = buildPeopleJsonLd({people, tenant, locale, tenantPath});

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
    >
      {peopleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(peopleJsonLd)}}
        />
      )}
      <PeopleGrid block={block} />
    </PageShell>
  );
}
