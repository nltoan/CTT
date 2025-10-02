import {PeopleGrid} from '@components/blocks/PeopleGrid';
import {PageShell} from '@components/layout/PageShell';
import {getNavigation} from '@lib/pages';
import {getPeople} from '@lib/people';
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

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
    >
      <PeopleGrid block={block} />
    </PageShell>
  );
}
