import {PeopleGrid} from '@components/blocks/PeopleGrid';
import {PageShell} from '@components/layout/PageShell';
import {getNavigation} from '@lib/pages';
import {getPeople} from '@lib/people';
import {readTenantResolutionFromRequest} from '@lib/tenant';

const buildBaseBlock = (locale: 'vi' | 'en') => ({
  type: 'people-grid' as const,
  title: locale === 'vi' ? 'Ban cố vấn & giảng viên' : 'Advisory board & faculty',
  description:
    locale === 'vi'
      ? 'Đội ngũ cố vấn và giảng viên chuyên môn của từng tenant.'
      : 'Specialised mentors and faculty for each tenant site.',
  emptyStateMessage:
    locale === 'vi'
      ? 'Ban cố vấn sẽ được cập nhật trong thời gian tới.'
      : 'The mentoring board will be updated soon.'
});

export const dynamic = 'force-static';

export default async function TenantPeopleIndex({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string};
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
