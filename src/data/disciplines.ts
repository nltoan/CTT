import type {Block} from '@types/blocks';
import type {Discipline} from '@types/cms';

const DEFAULT_UPDATED_AT = '2024-03-10T08:00:00.000Z';

type DisciplineLocaleContent = {
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  tags?: string[];
  blocks?: Block[];
  repertoire?: string[];
  requirements?: string[];
  schedule?: Discipline['schedule'];
};

type DisciplineSeed = {
  id: string;
  tenantId: string;
  translationKey: string;
  category?: string;
  level?: string;
  ageRange?: string;
  coverImage?: Discipline['coverImage'];
  jury?: string[];
  relatedPeople?: string[];
  updatedAt?: string;
  locales: Record<'vi' | 'en', DisciplineLocaleContent>;
};

function createDiscipline(seed: DisciplineSeed, locale: 'vi' | 'en'): Discipline {
  const translation = seed.locales[locale] ?? seed.locales.vi;

  return {
    id: seed.id,
    tenantId: seed.tenantId,
    translationKey: seed.translationKey,
    locale,
    slug: translation.slug,
    name: translation.name,
    shortDescription: translation.shortDescription,
    description: translation.description,
    category: seed.category,
    level: seed.level,
    ageRange: seed.ageRange,
    coverImage: seed.coverImage,
    tags: translation.tags,
    repertoire: translation.repertoire,
    requirements: translation.requirements,
    schedule: translation.schedule,
    jury: seed.jury,
    relatedPeople: seed.relatedPeople,
    blocks: translation.blocks,
    updatedAt: seed.updatedAt ?? DEFAULT_UPDATED_AT
  } satisfies Discipline;
}

const disciplineSeeds: DisciplineSeed[] = [
  {
    id: 'discipline-piano-main',
    tenantId: 'tenant-main',
    translationKey: 'discipline-piano',
    category: 'Keyboard',
    level: 'advanced',
    ageRange: '9 - 25 tuổi',
    coverImage: {
      id: 'discipline-piano-cover',
      url: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1600&q=80',
      alt: 'Contestant performing piano solo'
    },
    jury: ['nguyen-thu-ha', 'dang-quang-minh'],
    relatedPeople: ['nguyen-thu-ha', 'dang-quang-minh', 'lee-sung-hoon'],
    locales: {
      vi: {
        slug: 'piano',
        name: 'Piano',
        shortDescription: 'Biểu diễn solo và concerto với tác phẩm bắt buộc và tự chọn.',
        description:
          'Thí sinh trình diễn một tác phẩm bắt buộc do Ban tổ chức công bố và một tác phẩm tự chọn thể hiện thế mạnh cá nhân.',
        tags: ['solo', 'concerto', 'keyboard'],
        repertoire: [
          'J.S. Bach – Prelude and Fugue in C minor BWV 871',
          'L.V. Beethoven – Sonata Op. 53 “Waldstein” (1st movement)',
          'F. Liszt – La Campanella',
          'Tác phẩm tự chọn không quá 8 phút'
        ],
        requirements: [
          'Thời lượng tối đa 15 phút cho toàn bộ phần thi.',
          'Trình bày tối thiểu một tác phẩm Việt Nam hoặc đương đại.',
          'Thuộc lòng toàn bộ chương trình.',
          'Cung cấp bản nhạc cho Ban giám khảo trước buổi thi.'
        ],
        schedule: [
          {
            title: 'Vòng sơ loại',
            startsAt: '2025-05-12T01:00:00.000Z',
            description: 'Trình diễn trực tiếp tại phòng hoà nhạc 120 chỗ ngồi.'
          },
          {
            title: 'Vòng chung kết',
            startsAt: '2025-05-15T01:00:00.000Z',
            description: 'Biểu diễn với dàn nhạc thính phòng và livestream trên các nền tảng số.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<h2>Tiêu chí chấm điểm</h2><ul><li>Kỹ thuật và kiểm soát âm sắc.</li><li>Diễn cảm và phong cách.</li><li>Giao tiếp sân khấu.</li><li>Chương trình mang tính nghệ thuật cao.</li></ul>'
          },
          {
            type: 'timeline',
            title: 'Lịch tập dượt',
            items: [
              {
                title: 'Workshop cùng nghệ sĩ khách mời',
                datetime: '2025-05-10T08:00:00.000Z',
                description: 'Hướng dẫn cách thể hiện tác phẩm Việt Nam.'
              },
              {
                title: 'Buổi tổng duyệt',
                datetime: '2025-05-14T07:00:00.000Z',
                description: 'Tổng duyệt với piano concert grand tại khán phòng lớn.'
              }
            ]
          }
        ]
      },
      en: {
        slug: 'piano',
        name: 'Piano',
        shortDescription: 'Solo recital and concerto excerpts with compulsory and free-choice repertoire.',
        description:
          'Contestants present one compulsory piece announced by the festival and a free-choice work that showcases individuality.',
        tags: ['solo', 'concerto', 'keyboard'],
        repertoire: [
          'J.S. Bach – Prelude and Fugue in C minor BWV 871',
          'L.V. Beethoven – Sonata Op. 53 “Waldstein” (1st movement)',
          'F. Liszt – La Campanella',
          'Contestant’s choice under 8 minutes'
        ],
        requirements: [
          'Maximum total performance length: 15 minutes.',
          'Include at least one Vietnamese or contemporary piece.',
          'Perform entire program by memory.',
          'Provide scores to the jury prior to the audition.'
        ],
        schedule: [
          {
            title: 'Preliminary round',
            startsAt: '2025-05-12T01:00:00.000Z',
            description: 'Live audition in a 120-seat recital hall.'
          },
          {
            title: 'Final round',
            startsAt: '2025-05-15T01:00:00.000Z',
            description: 'Perform with chamber orchestra, streamed across digital channels.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<h2>Evaluation criteria</h2><ul><li>Technique and tonal control.</li><li>Musicality and stylistic understanding.</li><li>Stage presence.</li><li>Artistic programming.</li></ul>'
          },
          {
            type: 'timeline',
            title: 'Rehearsal plan',
            items: [
              {
                title: 'Guest artist workshop',
                datetime: '2025-05-10T08:00:00.000Z',
                description: 'Coaching on Vietnamese repertoire interpretation.'
              },
              {
                title: 'Dress rehearsal',
                datetime: '2025-05-14T07:00:00.000Z',
                description: 'Grand piano run-through at the main hall.'
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'discipline-strings-main',
    tenantId: 'tenant-main',
    translationKey: 'discipline-strings',
    category: 'Strings',
    level: 'intermediate',
    ageRange: '11 - 22 tuổi',
    coverImage: {
      id: 'discipline-strings-cover',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
      alt: 'Violinist performing on stage'
    },
    jury: ['tran-minh-an', 'lee-sung-hoon'],
    relatedPeople: ['tran-minh-an', 'lee-sung-hoon', 'trinh-gia-han'],
    locales: {
      vi: {
        slug: 'day-nhac',
        name: 'Nhạc cụ dây',
        shortDescription: 'Chương trình dành cho violin, viola và cello với phần thi bắt buộc song tấu.',
        description:
          'Thí sinh trình diễn hai tác phẩm tương phản (Baroque/Cổ điển và Lãng mạn/Đương đại) cùng phần song tấu với nghệ sĩ piano.',
        tags: ['violin', 'viola', 'cello'],
        repertoire: [
          'W.A. Mozart – Concerto (1st movement) theo nhạc cụ tương ứng',
          'M. Bruch – Kol Nidrei (đối với cello) / tác phẩm tương đương cho violin/viola',
          'Tác phẩm thính phòng chọn lọc với piano'
        ],
        requirements: [
          'Chuẩn bị 02 bản nhạc để biểu diễn cùng nghệ sĩ đệm.',
          'Cung cấp danh sách thiết bị cần thiết trước 07 ngày.',
          'Phần song tấu tối đa 7 phút.'
        ],
        schedule: [
          {
            title: 'Masterclass kỹ thuật arco',
            startsAt: '2025-05-11T02:00:00.000Z',
            description: 'Hướng dẫn bởi nghệ sĩ Lee Sung-hoon.'
          },
          {
            title: 'Biểu diễn showcase',
            startsAt: '2025-05-16T11:00:00.000Z',
            description: 'Các tiết mục xuất sắc biểu diễn tại gala dành cho khán giả công cộng.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<h2>Chuẩn bị trước khi thi</h2><p>Ban tổ chức cung cấp phòng tập 45 phút cho từng thí sinh vào ngày diễn ra vòng thi.</p>'
          }
        ]
      },
      en: {
        slug: 'strings',
        name: 'Strings',
        shortDescription: 'Open to violin, viola, and cello with mandatory collaborative round.',
        description:
          'Participants perform two contrasting works and collaborate with the festival pianist for a chamber excerpt.',
        tags: ['violin', 'viola', 'cello'],
        repertoire: [
          'W.A. Mozart – Concerto (1st movement) for the respective instrument',
          'M. Bruch – Kol Nidrei (cello) or equivalent lyrical work',
          'Selected chamber music movement with piano'
        ],
        requirements: [
          'Prepare scores for the collaborative pianist.',
          'Submit technical rider at least 7 days prior.',
          'Chamber excerpt limited to 7 minutes.'
        ],
        schedule: [
          {
            title: 'Arco technique masterclass',
            startsAt: '2025-05-11T02:00:00.000Z',
            description: 'Led by violinist Lee Sung-hoon.'
          },
          {
            title: 'Showcase performance',
            startsAt: '2025-05-16T11:00:00.000Z',
            description: 'Top performers join the gala concert for a public recital.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<h2>Preparation tips</h2><p>Each participant receives 45 minutes of rehearsal time on the audition day.</p>'
          }
        ]
      }
    }
  },
  {
    id: 'discipline-vocal-main',
    tenantId: 'tenant-main',
    translationKey: 'discipline-vocal',
    category: 'Voice',
    level: 'intermediate',
    ageRange: '13 - 28 tuổi',
    coverImage: {
      id: 'discipline-vocal-cover',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
      alt: 'Singer performing under spotlight'
    },
    jury: ['pham-an-quyen', 'maria-hernandez'],
    relatedPeople: ['pham-an-quyen', 'maria-hernandez'],
    locales: {
      vi: {
        slug: 'thanh-nhac',
        name: 'Thanh nhạc',
        shortDescription: 'Thể hiện aria cổ điển và ca khúc đương đại.',
        description:
          'Thí sinh chuẩn bị ba tác phẩm bằng ít nhất hai ngôn ngữ, bao gồm một aria opera và một bài hát nghệ thuật đương đại.',
        tags: ['opera', 'art song', 'vocal'],
        repertoire: [
          'G. Puccini – “O mio babbino caro” hoặc aria tương đương',
          'Ca khúc nghệ thuật Việt Nam',
          'Bài hát đương đại tự chọn'
        ],
        requirements: [
          'Có thể dùng playback hoặc pianist do Ban tổ chức cung cấp.',
          'Trang phục biểu diễn phù hợp sân khấu.',
          'Bắt buộc gửi bản dịch lời bài hát cho BGK.'
        ],
        schedule: [
          {
            title: 'Coaching phát âm',
            startsAt: '2025-05-09T07:30:00.000Z',
            description: 'Luyện phát âm tiếng Ý và tiếng Anh cùng chuyên gia.'
          },
          {
            title: 'Recording feedback',
            startsAt: '2025-05-13T05:00:00.000Z',
            description: 'Nhận góp ý từ BGK dựa trên bản thu video gửi trước.'
          }
        ],
        blocks: [
          {
            type: 'testimonials',
            title: 'Chia sẻ từ thí sinh',
            items: [
              {
                name: 'Lan Phương',
                title: 'Quán quân 2024',
                quote: 'Chương trình giúp mình tự tin làm chủ sân khấu opera quốc tế.'
              }
            ]
          }
        ]
      },
      en: {
        slug: 'vocal',
        name: 'Vocal',
        shortDescription: 'Perform classical aria and contemporary selections in multiple languages.',
        description:
          'Prepare three contrasting works in at least two languages, featuring one opera aria and one contemporary art song.',
        tags: ['opera', 'art song', 'vocal'],
        repertoire: [
          'G. Puccini – “O mio babbino caro” or equivalent aria',
          'Vietnamese art song',
          'Contemporary song of choice'
        ],
        requirements: [
          'Optional use of backing track or staff pianist.',
          'Stage-appropriate concert attire required.',
          'Submit translations of song texts to the jury.'
        ],
        schedule: [
          {
            title: 'Diction coaching',
            startsAt: '2025-05-09T07:30:00.000Z',
            description: 'Focus on Italian and English diction with resident coach.'
          },
          {
            title: 'Recording feedback',
            startsAt: '2025-05-13T05:00:00.000Z',
            description: 'Receive feedback from jurors on pre-submitted recordings.'
          }
        ],
        blocks: [
          {
            type: 'testimonials',
            title: 'Alumni stories',
            items: [
              {
                name: 'Lan Phuong',
                title: '2024 laureate',
                quote: 'The program empowered me to own the international opera stage.'
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'discipline-guitar-main',
    tenantId: 'tenant-main',
    translationKey: 'discipline-guitar',
    category: 'Guitar',
    level: 'advanced',
    ageRange: '10 - 24 tuổi',
    coverImage: {
      id: 'discipline-guitar-cover',
      url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1600&q=80',
      alt: 'Guitarist in competition'
    },
    jury: ['dang-quang-minh'],
    relatedPeople: ['dang-quang-minh'],
    locales: {
      vi: {
        slug: 'guitar',
        name: 'Guitar',
        shortDescription: 'Thi guitar cổ điển với chương trình độc tấu và hoà tấu song tấu bắt buộc.',
        description:
          'Thí sinh trình diễn một bản Prelude Baroque, một tác phẩm Romantic hoặc Latin và một tác phẩm Việt Nam chuyển soạn cho guitar.',
        tags: ['classical guitar', 'solo'],
        repertoire: [
          'J.S. Bach – Lute Suite BWV 996 (Preludio)',
          'A. Barrios – La Catedral (Allegro Solemne)',
          'Tác phẩm Việt Nam chuyển soạn cho guitar'
        ],
        requirements: [
          'Ghi rõ chỉnh dây đặc biệt (nếu có).',
          'Có thể sử dụng footstool hoặc hỗ trợ khác do thí sinh tự chuẩn bị.',
          'Thời lượng tối đa 12 phút.'
        ]
      },
      en: {
        slug: 'guitar',
        name: 'Guitar',
        shortDescription: 'Classical guitar category with solo and mandatory duet repertoire.',
        description:
          'Perform a Baroque prelude, a Romantic or Latin American work, and a Vietnamese arrangement for classical guitar.',
        tags: ['classical guitar', 'solo'],
        repertoire: [
          'J.S. Bach – Lute Suite BWV 996 (Prelude)',
          'A. Barrios – La Catedral (Allegro Solemne)',
          'Vietnamese work arranged for guitar'
        ],
        requirements: [
          'Indicate any scordatura in the score submission.',
          'Bring personal footstool/support accessories.',
          'Maximum duration: 12 minutes.'
        ]
      }
    }
  },
  {
    id: 'discipline-ukulele-main',
    tenantId: 'tenant-main',
    translationKey: 'discipline-ukulele',
    category: 'Ukulele',
    level: 'beginner',
    ageRange: '8 - 16 tuổi',
    coverImage: {
      id: 'discipline-ukulele-cover',
      url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1600&q=80',
      alt: 'Young ukulele ensemble'
    },
    jury: ['trinh-gia-han'],
    relatedPeople: ['trinh-gia-han'],
    locales: {
      vi: {
        slug: 'ukulele',
        name: 'Ukulele',
        shortDescription: 'Khuyến khích sáng tạo cho nhóm nhạc cụ dây nhỏ và biểu diễn kết hợp hát.',
        description:
          'Chương trình cho phép biểu diễn solo hoặc nhóm tối đa 4 thành viên, điểm cộng cho các bản phối sáng tạo.',
        tags: ['ensemble', 'creative'],
        requirements: [
          'Tối đa 2 tiết mục, mỗi tiết mục không quá 4 phút.',
          'Khuyến khích kết hợp hát hoặc nhạc cụ gõ đơn giản.',
          'Trang phục đồng nhất tạo ấn tượng sân khấu.'
        ]
      },
      en: {
        slug: 'ukulele',
        name: 'Ukulele',
        shortDescription: 'Celebrating creativity for soloists or ensembles up to four members.',
        description:
          'Participants may perform solo or as an ensemble with bonus points for creative arrangements and vocals.',
        tags: ['ensemble', 'creative'],
        requirements: [
          'Up to two pieces, each under four minutes.',
          'Vocals or simple percussion encouraged.',
          'Coordinated outfit enhances stage presentation.'
        ]
      }
    }
  },
  {
    id: 'discipline-orchestra-main',
    tenantId: 'tenant-main',
    translationKey: 'discipline-orchestra',
    category: 'Ensemble',
    level: 'advanced',
    ageRange: '15 - 30 tuổi',
    coverImage: {
      id: 'discipline-orchestra-cover',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
      alt: 'Youth orchestra in concert'
    },
    jury: ['lee-sung-hoon', 'dang-quang-minh'],
    relatedPeople: ['lee-sung-hoon', 'dang-quang-minh'],
    locales: {
      vi: {
        slug: 'dan-nhac',
        name: 'Dàn nhạc',
        shortDescription: 'Dành cho các dàn nhạc giao hưởng hoặc thính phòng tối thiểu 18 thành viên.',
        description:
          'Các dàn nhạc trình diễn chương trình từ 12 đến 18 phút gồm tác phẩm kinh điển và tác phẩm Việt Nam đương đại.',
        tags: ['orchestra', 'ensemble'],
        requirements: [
          'Cung cấp danh sách nhạc công và nhạc cụ.',
          'Có chỉ huy chính thức.',
          'Chấp hành quy định rehearsal của Ban tổ chức.'
        ]
      },
      en: {
        slug: 'orchestra',
        name: 'Orchestra',
        shortDescription: 'For symphony or chamber orchestras with at least 18 members.',
        description:
          'Perform a 12–18 minute program featuring a classical masterwork and a contemporary Vietnamese composition.',
        tags: ['orchestra', 'ensemble'],
        requirements: [
          'Submit instrumentation list and personnel roster.',
          'Must perform under an appointed conductor.',
          'Follow the rehearsal schedule provided by organizers.'
        ]
      }
    }
  },
  {
    id: 'discipline-piano-classic',
    tenantId: 'tenant-classic',
    translationKey: 'discipline-piano-classic',
    category: 'Keyboard',
    level: 'pre-college',
    ageRange: '7 - 16 tuổi',
    coverImage: {
      id: 'discipline-piano-classic-cover',
      url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80',
      alt: 'Young pianist practicing'
    },
    jury: ['tran-minh-an'],
    relatedPeople: ['tran-minh-an'],
    locales: {
      vi: {
        slug: 'piano-tre',
        name: 'Piano thiếu niên',
        shortDescription: 'Dành cho học viên tiền đại học với chương trình đề cao kỹ thuật nền tảng.',
        description:
          'Thí sinh chọn hai tác phẩm tương phản và một etude kỹ thuật phù hợp độ tuổi.',
        tags: ['youth', 'foundation'],
        requirements: [
          'Thời lượng tối đa 10 phút.',
          'Được phép sử dụng bản nhạc trong vòng sơ loại.',
          'Phải tham gia workshop định hướng nghề nghiệp.'
        ]
      },
      en: {
        slug: 'junior-piano',
        name: 'Junior Piano',
        shortDescription: 'Pre-college division focusing on strong technical fundamentals.',
        description: 'Perform two contrasting pieces and an age-appropriate technical etude.',
        tags: ['youth', 'foundation'],
        requirements: [
          'Maximum duration: 10 minutes.',
          'Sheet music permitted during preliminary stage.',
          'Mandatory career pathway workshop participation.'
        ]
      }
    }
  },
  {
    id: 'discipline-chamber-classic',
    tenantId: 'tenant-classic',
    translationKey: 'discipline-chamber-classic',
    category: 'Chamber music',
    level: 'advanced',
    ageRange: '14 - 26 tuổi',
    coverImage: {
      id: 'discipline-chamber-classic-cover',
      url: 'https://images.unsplash.com/photo-1524231757912-21b0f194be8e?auto=format&fit=crop&w=1600&q=80',
      alt: 'Chamber ensemble performing'
    },
    jury: ['lee-sung-hoon', 'maria-hernandez'],
    relatedPeople: ['lee-sung-hoon', 'maria-hernandez'],
    locales: {
      vi: {
        slug: 'hoa-tau-thinh-phong',
        name: 'Hoà tấu thính phòng',
        shortDescription: 'Tôn vinh sự phối hợp trong các nhóm nhạc thính phòng 3-6 thành viên.',
        description:
          'Các nhóm biểu diễn chương trình 18 phút gồm tác phẩm cổ điển và đương đại.',
        tags: ['ensemble', 'collaboration'],
        requirements: [
          'Không sử dụng người thay thế.',
          'Gửi sơ đồ bố trí sân khấu.',
          'Tham dự buổi tư vấn cùng nghệ sĩ khách mời.'
        ]
      },
      en: {
        slug: 'chamber-music',
        name: 'Chamber Music',
        shortDescription: 'Celebrating ensemble synergy for groups of three to six performers.',
        description: 'Present an 18-minute program of classical and contemporary repertoire.',
        tags: ['ensemble', 'collaboration'],
        requirements: [
          'No substitute players allowed.',
          'Submit stage plot diagram.',
          'Attend coaching session with guest artists.'
        ]
      }
    }
  }
];

export const disciplines: Discipline[] = disciplineSeeds
  .flatMap((seed) => [createDiscipline(seed, 'vi'), createDiscipline(seed, 'en')])
  .sort((a, b) => a.name.localeCompare(b.name, 'vi'));

function filterDisciplines({
  tenantId,
  locale,
  category,
  level,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  category?: string;
  level?: string;
  q?: string;
}) {
  const normalizedQuery = q?.trim().toLowerCase();
  return disciplines
    .filter((discipline) => discipline.tenantId === tenantId && discipline.locale === locale)
    .filter((discipline) => {
      if (!category) return true;
      return discipline.category?.toLowerCase() === category.toLowerCase();
    })
    .filter((discipline) => {
      if (!level) return true;
      return discipline.level?.toLowerCase() === level.toLowerCase();
    })
    .filter((discipline) => {
      if (!normalizedQuery) return true;
      const haystack = [
        discipline.name,
        discipline.shortDescription,
        discipline.description,
        discipline.category,
        discipline.level,
        ...(discipline.tags ?? []),
        ...(discipline.repertoire ?? []),
        ...(discipline.requirements ?? [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
}

export function listDisciplinesByTenant({
  tenantId,
  locale,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
}) {
  const filtered = filterDisciplines({tenantId, locale});
  if (!limit) {
    return filtered;
  }
  return filtered.slice(0, limit);
}

export function searchDisciplinesByTenant({
  tenantId,
  locale,
  page = 1,
  limit = 9,
  category,
  level,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  q?: string;
}) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 24));
  const filtered = filterDisciplines({tenantId, locale, category, level, q});
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const normalizedPage = Math.min(safePage, totalPages);
  const startIndex = (normalizedPage - 1) * safeLimit;
  const items = filtered.slice(startIndex, startIndex + safeLimit);

  return {
    items,
    total,
    page: normalizedPage,
    limit: safeLimit,
    totalPages,
    hasMore: normalizedPage < totalPages
  };
}

export function findDisciplineBySlug({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return disciplines.find(
    (discipline) =>
      discipline.tenantId === tenantId && discipline.locale === locale && discipline.slug === slug
  );
}

export function findDisciplineTranslations({
  translationKey,
  disciplineId
}: {
  translationKey: string;
  disciplineId?: string;
}) {
  return disciplines
    .filter((discipline) => discipline.translationKey === translationKey)
    .filter((discipline) => (disciplineId ? discipline.id !== disciplineId : true))
    .map((discipline) => ({
      locale: discipline.locale,
      slug: discipline.slug
    }));
}

export function listDisciplineCategories({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  const categories = new Map<string, {label: string; slug: string; count: number}>();
  filterDisciplines({tenantId, locale}).forEach((discipline) => {
    const category = discipline.category;
    if (!category) {
      return;
    }
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const current = categories.get(slug);
    if (current) {
      current.count += 1;
    } else {
      categories.set(slug, {label: category, slug, count: 1});
    }
  });
  return Array.from(categories.values()).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
}

export function listDisciplineLevels({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  const levels = new Map<string, {label: string; slug: string; count: number}>();
  filterDisciplines({tenantId, locale}).forEach((discipline) => {
    const level = discipline.level;
    if (!level) return;
    const slug = level.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const current = levels.get(slug);
    if (current) {
      current.count += 1;
    } else {
      levels.set(slug, {label: level, slug, count: 1});
    }
  });
  return Array.from(levels.values()).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
}

export function getDisciplineSuggestions({
  tenantId,
  locale,
  excludeSlug,
  limit = 3
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  excludeSlug: string;
  limit?: number;
}) {
  return filterDisciplines({tenantId, locale})
    .filter((discipline) => discipline.slug !== excludeSlug)
    .slice(0, limit);
}
