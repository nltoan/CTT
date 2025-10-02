import type {Metadata} from 'next';

import {SponsorsGrid} from '@components/blocks/SponsorsGrid';
import {PageShell} from '@components/layout/PageShell';
import {getNavigation} from '@lib/pages';
import {getSponsors} from '@lib/people';
import {createCollectionMetadata, buildSponsorsJsonLd} from '@lib/seo';
import {readTenantResolutionFromRequest} from '@lib/tenant';

const buildBaseBlock = (locale: 'vi' | 'en') => ({
  type: 'sponsors-grid' as const,
  title: locale === 'vi' ? 'Đối tác đồng hành' : 'Supporting partners',
  description:
    locale === 'vi'
      ? 'Các thương hiệu dành riêng cho tenant này.'
      : 'Partners dedicated to this tenant site.',
  emptyStateMessage:
    locale === 'vi'
      ? 'Hiện chưa có nhà tài trợ cho tenant này.'
      : 'No sponsors have been assigned to this tenant yet.'
});

export const dynamic = 'force-static';

export async function generateMetadata({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string};
}): Promise<Metadata> {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const title = locale === 'vi' ? 'Đối tác & nhà tài trợ' : 'Partners & sponsors';
  const description =
    locale === 'vi'
      ? 'Các thương hiệu và tổ chức đồng hành cùng chương trình CTT.'
      : 'Brands and organisations supporting the CTT programme.';

  return createCollectionMetadata({
    tenant,
    locale,
    tenantPath,
    slugSegments: ['partners'],
    title,
    description
  });
}

export default async function TenantPartnersIndex({
  params
}: {
  params: {locale: 'vi' | 'en'; tenant: string};
}) {
  const {tenant, locale, tenantPath} = readTenantResolutionFromRequest({
    params,
    locale: params.locale
  });

  const [headerNavigation, footerNavigation, sponsors] = await Promise.all([
    getNavigation({tenantId: tenant.id, key: 'header', locale}),
    getNavigation({tenantId: tenant.id, key: 'footer', locale}),
    getSponsors({tenantId: tenant.id, locale})
  ]);

  const block = {
    ...buildBaseBlock(locale),
    items: sponsors.map((sponsor) => ({
      name: sponsor.name,
      tier: sponsor.tier,
      url: sponsor.url,
      logo: sponsor.logo
    }))
  };

  const sponsorsJsonLd = buildSponsorsJsonLd({sponsors, tenant, locale, tenantPath});

  return (
    <PageShell
      tenant={tenant}
      locale={locale}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      tenantPath={tenantPath}
    >
      {sponsorsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(sponsorsJsonLd)}}
        />
      )}
      <SponsorsGrid block={block} />
    </PageShell>
  );
}
