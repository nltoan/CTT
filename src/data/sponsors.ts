import type {Sponsor} from '@types/cms';

type SponsorSeed = {
  id: string;
  tenantId: string;
  tier?: Sponsor['tier'];
  url?: string;
  logo: Sponsor['logo'];
  locales: Record<'vi' | 'en', {name: string; description?: string}>;
};

const sponsorSeeds: SponsorSeed[] = [
  {
    id: 'sponsor-yamaha',
    tenantId: 'tenant-main',
    tier: 'gold',
    url: 'https://yamaha.com',
    logo: {
      id: 'yamaha',
      url: 'https://dummyimage.com/200x80/1f2937/ffffff&text=Yamaha',
      alt: 'Yamaha logo'
    },
    locales: {
      vi: {
        name: 'Yamaha Music',
        description: 'Đối tác chiến lược cung cấp nhạc cụ và học bổng biểu diễn.'
      },
      en: {
        name: 'Yamaha Music',
        description: 'Strategic partner for instruments and performance scholarships.'
      }
    }
  },
  {
    id: 'sponsor-steinway',
    tenantId: 'tenant-main',
    tier: 'silver',
    url: 'https://steinway.com',
    logo: {
      id: 'steinway',
      url: 'https://dummyimage.com/200x80/111827/ffffff&text=Steinway',
      alt: 'Steinway & Sons logo'
    },
    locales: {
      vi: {
        name: 'Steinway & Sons',
        description: 'Cung cấp piano chuẩn biểu diễn cho vòng chung kết.'
      },
      en: {
        name: 'Steinway & Sons',
        description: 'Providing concert-grade pianos for the finals.'
      }
    }
  },
  {
    id: 'sponsor-vietnam-airlines',
    tenantId: 'tenant-main',
    tier: 'bronze',
    url: 'https://vietnamairlines.com',
    logo: {
      id: 'vna',
      url: 'https://dummyimage.com/200x80/0f172a/ffffff&text=VN+Airlines',
      alt: 'Vietnam Airlines logo'
    },
    locales: {
      vi: {
        name: 'Vietnam Airlines',
        description: 'Đồng hành vận chuyển nghệ sĩ và ban giám khảo quốc tế.'
      },
      en: {
        name: 'Vietnam Airlines',
        description: 'Official travel partner for international artists and jury.'
      }
    }
  },
  {
    id: 'sponsor-kawai',
    tenantId: 'tenant-classic',
    tier: 'gold',
    url: 'https://kawai-global.com',
    logo: {
      id: 'kawai',
      url: 'https://dummyimage.com/200x80/1e293b/ffffff&text=Kawai',
      alt: 'Kawai logo'
    },
    locales: {
      vi: {
        name: 'Kawai Global',
        description: 'Tài trợ piano dành riêng cho chương trình học viện.'
      },
      en: {
        name: 'Kawai Global',
        description: 'Exclusive piano sponsor for the academy programme.'
      }
    }
  },
  {
    id: 'sponsor-tokyo-philharmonic',
    tenantId: 'tenant-classic',
    tier: 'silver',
    url: 'https://www.tpo.or.jp/en',
    logo: {
      id: 'tpo',
      url: 'https://dummyimage.com/200x80/0b1120/ffffff&text=Tokyo+Philharmonic',
      alt: 'Tokyo Philharmonic logo'
    },
    locales: {
      vi: {
        name: 'Tokyo Philharmonic',
        description: 'Đối tác trao đổi nghệ thuật và workshop định kỳ.'
      },
      en: {
        name: 'Tokyo Philharmonic',
        description: 'Artistic exchange partner hosting annual workshops.'
      }
    }
  }
];

export function listSponsorsByTenant({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}): Sponsor[] {
  return sponsorSeeds
    .filter((sponsor) => sponsor.tenantId === tenantId)
    .map((sponsor) => {
      const translation = sponsor.locales[locale] ?? sponsor.locales.vi;
      return {
        id: sponsor.id,
        tenantId: sponsor.tenantId,
        locale,
        name: translation.name,
        description: translation.description,
        tier: sponsor.tier,
        url: sponsor.url,
        logo: sponsor.logo
      } satisfies Sponsor;
    })
    .sort((a, b) => {
      const tierWeight = {gold: 0, silver: 1, bronze: 2};
      const aWeight = a.tier ? tierWeight[a.tier] : 3;
      const bWeight = b.tier ? tierWeight[b.tier] : 3;
      return aWeight - bWeight;
    });
}
