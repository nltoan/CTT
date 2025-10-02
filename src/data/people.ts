import type {Person} from '@types/cms';

type PersonSeed = {
  id: string;
  slug: string;
  tenantId: string;
  order?: number;
  photo?: Person['photo'];
  socialLinks?: Person['socialLinks'];
  locales: Record<'vi' | 'en', {name: string; title?: string; bio?: string}>;
};

const peopleSeeds: PersonSeed[] = [
  {
    id: 'person-nguyen-thu-ha',
    slug: 'nguyen-thu-ha',
    tenantId: 'tenant-main',
    order: 1,
    photo: {
      id: 'judge-ha',
      url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
      alt: 'Nguyen Thu Ha portrait'
    },
    locales: {
      vi: {
        name: 'Nguyễn Thu Hà',
        title: 'Giám khảo trưởng – Piano',
        bio: 'Tiến sĩ Biểu diễn Piano tại Juilliard, hơn 15 năm giảng dạy và biểu diễn quốc tế.'
      },
      en: {
        name: 'Nguyen Thu Ha',
        title: 'Head Judge – Piano',
        bio: 'Doctor of Musical Arts (Piano) from Juilliard with 15 years of global performances.'
      }
    }
  },
  {
    id: 'person-tran-minh-quan',
    slug: 'tran-minh-quan',
    tenantId: 'tenant-main',
    order: 2,
    photo: {
      id: 'judge-quan',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      alt: 'Tran Minh Quan portrait'
    },
    locales: {
      vi: {
        name: 'Trần Minh Quân',
        title: 'Giám khảo – Violin',
        bio: 'Concertmaster của Dàn nhạc Giao hưởng Việt Nam, tốt nghiệp Học viện Liszt.'
      },
      en: {
        name: 'Tran Minh Quan',
        title: 'Jury – Violin',
        bio: 'Concertmaster of the Vietnam National Symphony, alumni of the Liszt Academy.'
      }
    }
  },
  {
    id: 'person-sarah-johnson',
    slug: 'sarah-johnson',
    tenantId: 'tenant-main',
    order: 3,
    photo: {
      id: 'advisor-sarah',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      alt: 'Sarah Johnson portrait'
    },
    locales: {
      vi: {
        name: 'Sarah Johnson',
        title: 'Cố vấn nghệ thuật',
        bio: 'Giám đốc nghệ thuật của London Young Artists, chuyên gia cố vấn chương trình biểu diễn.'
      },
      en: {
        name: 'Sarah Johnson',
        title: 'Artistic Advisor',
        bio: 'Artistic director of London Young Artists, specialising in performance coaching.'
      }
    }
  },
  {
    id: 'person-le-anh-tu',
    slug: 'le-anh-tu',
    tenantId: 'tenant-classic',
    order: 1,
    photo: {
      id: 'classic-judge-tu',
      url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
      alt: 'Le Anh Tu portrait'
    },
    locales: {
      vi: {
        name: 'Lê Anh Tú',
        title: 'Giám đốc học thuật',
        bio: 'Từng là trưởng khoa Piano tại Nhạc viện TP.HCM, phụ trách chương trình đào tạo nâng cao.'
      },
      en: {
        name: 'Le Anh Tu',
        title: 'Academic Director',
        bio: 'Former head of piano faculty at HCMC Conservatory, overseeing advanced training.'
      }
    }
  },
  {
    id: 'person-marie-dupont',
    slug: 'marie-dupont',
    tenantId: 'tenant-classic',
    order: 2,
    photo: {
      id: 'classic-judge-marie',
      url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
      alt: 'Marie Dupont portrait'
    },
    locales: {
      vi: {
        name: 'Marie Dupont',
        title: 'Giảng viên Thanh nhạc',
        bio: 'Soprano người Pháp, từng biểu diễn tại Opera de Lyon và giảng dạy tại CNSMD Paris.'
      },
      en: {
        name: 'Marie Dupont',
        title: 'Vocal Faculty',
        bio: 'French soprano with appearances at Opéra de Lyon and faculty member at CNSMD Paris.'
      }
    }
  },
  {
    id: 'person-pham-bich-ngoc',
    slug: 'pham-bich-ngoc',
    tenantId: 'tenant-classic',
    order: 3,
    photo: {
      id: 'classic-judge-ngoc',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e2',
      alt: 'Pham Bich Ngoc portrait'
    },
    locales: {
      vi: {
        name: 'Phạm Bích Ngọc',
        title: 'Cố vấn nghệ thuật',
        bio: 'Chuyên gia dàn dựng chương trình hòa nhạc dành cho thiếu niên, sáng lập CTT Chamber Lab.'
      },
      en: {
        name: 'Pham Bich Ngoc',
        title: 'Artistic Mentor',
        bio: 'Concert programme director for youth ensembles and founder of CTT Chamber Lab.'
      }
    }
  }
];

export function listPeopleByTenant({
  tenantId,
  locale,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
}): Person[] {
  const localized = peopleSeeds
    .filter((person) => person.tenantId === tenantId)
    .map((person) => {
      const translation = person.locales[locale] ?? person.locales.vi;
      return {
        id: person.id,
        slug: person.slug,
        tenantId: person.tenantId,
        locale,
        order: person.order,
        name: translation.name,
        title: translation.title,
        bio: translation.bio,
        photo: person.photo,
        socialLinks: person.socialLinks
      } satisfies Person;
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  if (typeof limit === 'number') {
    return localized.slice(0, limit);
  }

  return localized;
}

export function findPersonBySlug({
  tenantId,
  slug,
  locale
}: {
  tenantId: string;
  slug: string;
  locale: 'vi' | 'en';
}): Person | undefined {
  return listPeopleByTenant({tenantId, locale}).find((person) => person.slug === slug);
}
