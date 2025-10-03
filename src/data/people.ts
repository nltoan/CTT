import type {Person} from '@types/cms';

const DEFAULT_UPDATED_AT = '2024-03-12T09:00:00.000Z';

type PersonLocaleContent = {
  name: string;
  title?: string;
  bio?: string;
  quote?: string;
  achievements?: string[];
  highlights?: Person['highlights'];
  blocks?: Person['blocks'];
};

type PersonSeed = {
  id: string;
  slug: string;
  tenantId: string;
  order?: number;
  updatedAt?: string;
  disciplines?: string[];
  photo?: Person['photo'];
  socialLinks?: Person['socialLinks'];
  videoEmbedUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  locales: Record<'vi' | 'en', PersonLocaleContent>;
};

function matchesQuery(value: string | undefined, query: string) {
  return value?.toLowerCase().includes(query) ?? false;
}

function matchesList(values: string[] | undefined, query: string) {
  return (values ?? []).some((item) => item.toLowerCase().includes(query));
}

function createLocalizedPerson(seed: PersonSeed, locale: 'vi' | 'en'): Person {
  const translation = seed.locales[locale] ?? seed.locales.vi;

  return {
    id: seed.id,
    slug: seed.slug,
    tenantId: seed.tenantId,
    locale,
    order: seed.order,
    name: translation.name,
    title: translation.title,
    bio: translation.bio,
    photo: seed.photo,
    socialLinks: seed.socialLinks,
    disciplines: seed.disciplines,
    achievements: translation.achievements,
    highlights: translation.highlights,
    quote: translation.quote,
    videoEmbedUrl: seed.videoEmbedUrl,
    blocks: translation.blocks,
    updatedAt: seed.updatedAt ?? DEFAULT_UPDATED_AT,
    contactEmail: seed.contactEmail,
    contactPhone: seed.contactPhone
  } satisfies Person;
}

const peopleSeeds: PersonSeed[] = [
  {
    id: 'person-nguyen-thu-ha',
    slug: 'nguyen-thu-ha',
    tenantId: 'tenant-main',
    order: 1,
    updatedAt: '2024-03-18T08:30:00.000Z',
    disciplines: ['Piano', 'Chamber music'],
    photo: {
      id: 'judge-ha',
      url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
      alt: 'Nguyen Thu Ha portrait'
    },
    socialLinks: [
      {label: 'Website', url: 'https://thuha-piano.example.com', platform: 'website'},
      {label: 'YouTube', url: 'https://youtube.com/@thuha_piano', platform: 'youtube'}
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/8Z1eMyvP3dk',
    contactEmail: 'jury@cttmusic.vn',
    locales: {
      vi: {
        name: 'Nguyễn Thu Hà',
        title: 'Giám khảo trưởng – Piano',
        bio: 'Tiến sĩ Piano tại Juilliard, phụ trách nghệ thuật của chương trình CTT Showcase.',
        quote:
          'Tôi muốn mang lại một sân khấu vừa khắt khe vừa giàu cảm hứng để nghệ sĩ trẻ khám phá chính mình.',
        achievements: [
          'Giải Nhất cuộc thi Chopin quốc tế tại Warsaw (2018)',
          'Giảng viên thỉnh giảng tại Juilliard và Hochschule für Musik München',
          'Giám đốc nghệ thuật CTT Showcase từ năm 2022'
        ],
        highlights: [
          {
            year: '2024',
            title: 'Biểu diễn khai mạc Gala CTT',
            description: 'Trình diễn concerto mới đặt hàng riêng cho mùa giải CTT 2024.'
          },
          {
            year: '2023',
            title: 'Xuất bản giáo trình Piano đương đại',
            description: 'Giáo trình được giảng dạy tại hơn 20 học viện âm nhạc ở châu Á.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            title: 'Hành trình âm nhạc',
            content:
              '<p>Nguyễn Thu Hà theo học piano từ năm 4 tuổi và trở thành học viên nhỏ tuổi nhất của Học viện Âm nhạc Quốc gia. Sau khi tốt nghiệp loại xuất sắc tại Juilliard, cô tiếp tục theo đuổi sự nghiệp biểu diễn và giảng dạy ở châu Âu. Thu Hà hiện là giám đốc nghệ thuật của CTT Showcase và thường xuyên tổ chức workshop về kỹ thuật biểu diễn.</p>'
          },
          {
            type: 'timeline',
            title: 'Các cột mốc nổi bật',
            items: [
              {
                date: '2018',
                title: 'Quán quân Chopin International Piano Competition',
                desc: 'Được báo chí Ba Lan ca ngợi là “ngôi sao trẻ của thế kỷ”.'
              },
              {
                date: '2022',
                title: 'Giám đốc nghệ thuật CTT Showcase',
                desc: 'Định hình chương trình thành sân khấu quy mô khu vực.'
              },
              {
                date: '2024',
                title: 'Ra mắt tour diễn “Beyond Borders”',
                desc: 'Chuỗi hòa nhạc tại Singapore, Tokyo và Paris.'
              }
            ]
          }
        ]
      },
      en: {
        name: 'Nguyen Thu Ha',
        title: 'Head Judge – Piano',
        bio: 'DMA graduate from Juilliard and artistic director of the CTT Showcase.',
        quote: 'I strive to build a stage that is demanding yet inspiring for young musicians to grow.',
        achievements: [
          'First prize at the Chopin International Competition in Warsaw (2018)',
          'Guest faculty at Juilliard and Hochschule für Musik München',
          'Artistic director of the CTT Showcase since 2022'
        ],
        highlights: [
          {
            year: '2024',
            title: 'CTT Gala opening performance',
            description: 'Premiered a newly commissioned concerto for the 2024 season.'
          },
          {
            year: '2023',
            title: 'Published contemporary piano method',
            description: 'Adopted by over twenty music conservatories across Asia.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            title: 'Musical journey',
            content:
              '<p>Nguyen Thu Ha began piano lessons at four and was the youngest student admitted to the Vietnam National Academy of Music. After graduating with distinction from Juilliard, she pursued an international career as both performer and educator. Ha now directs the CTT Showcase and frequently leads masterclasses focused on artistic storytelling.</p>'
          },
          {
            type: 'timeline',
            title: 'Career milestones',
            items: [
              {
                date: '2018',
                title: 'Winner – Chopin International Piano Competition',
                desc: 'Praised by Polish press as “a rising star of the century”.'
              },
              {
                date: '2022',
                title: 'Artistic director of CTT Showcase',
                desc: 'Shaped the program into a regional flagship stage.'
              },
              {
                date: '2024',
                title: '“Beyond Borders” tour',
                desc: 'Concert series across Singapore, Tokyo, and Paris.'
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'person-tran-minh-quan',
    slug: 'tran-minh-quan',
    tenantId: 'tenant-main',
    order: 2,
    updatedAt: '2024-03-16T10:00:00.000Z',
    disciplines: ['Violin', 'Orchestral leadership'],
    photo: {
      id: 'judge-quan',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      alt: 'Tran Minh Quan portrait'
    },
    socialLinks: [
      {label: 'Instagram', url: 'https://instagram.com/minhquanviolin', platform: 'instagram'}
    ],
    videoEmbedUrl: 'https://player.vimeo.com/video/76979871',
    locales: {
      vi: {
        name: 'Trần Minh Quân',
        title: 'Giám khảo – Violin',
        bio: 'Concertmaster của Dàn nhạc Giao hưởng Việt Nam, chuyên gia dàn dựng tiết mục giao hưởng.',
        quote: 'Âm nhạc không chỉ là kỹ thuật mà còn là sự đồng điệu giữa từng thành viên trong dàn nhạc.',
        achievements: [
          'Concertmaster Dàn nhạc Giao hưởng Việt Nam từ năm 2016',
          'Giảng viên cao cấp tại Học viện Liszt Budapest',
          'Đồng sáng lập chương trình “Strings for Youth”'
        ],
        highlights: [
          {
            year: '2023',
            title: 'Chỉ huy dàn nhạc CTT Final Night',
            description: 'Dẫn dắt 60 nghệ sĩ trong chương trình chung kết được truyền hình trực tiếp.'
          },
          {
            year: '2021',
            title: 'Ra mắt album “Resonance”',
            description: 'Album thu live cùng dàn nhạc thính phòng Vienna Virtuosi.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Trần Minh Quân được biết đến với phong cách chỉ huy giàu năng lượng và khả năng kết nối dàn nhạc. Anh thường xuyên được mời làm giảng viên masterclass tại châu Âu và châu Á, tập trung vào việc xây dựng kỹ năng nghe tập thể và phản xạ sân khấu.</p>'
          },
          {
            type: 'timeline',
            items: [
              {date: '2016', title: 'Concertmaster VNSO', desc: 'Nhạc trưởng trẻ nhất đảm nhiệm vai trò này.'},
              {date: '2020', title: 'Co-founder Strings for Youth', desc: 'Dự án đào tạo dành cho học sinh vùng xa.'},
              {date: '2023', title: 'CTT Final Night Conductor', desc: 'Gala thu hút hơn 1 triệu lượt xem online.'}
            ]
          }
        ]
      },
      en: {
        name: 'Tran Minh Quan',
        title: 'Jury – Violin',
        bio: 'Concertmaster of the Vietnam National Symphony and specialist in orchestral coaching.',
        quote: 'Music thrives when every musician breathes in sync with the ensemble.',
        achievements: [
          'Concertmaster of the Vietnam National Symphony since 2016',
          'Senior lecturer at the Liszt Academy Budapest',
          'Co-founder of the “Strings for Youth” programme'
        ],
        highlights: [
          {
            year: '2023',
            title: 'Conducted the CTT Final Night orchestra',
            description: 'Led 60 musicians in a live televised finale.'
          },
          {
            year: '2021',
            title: 'Released “Resonance” live album',
            description: 'Recorded with the Vienna Virtuosi chamber orchestra.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Tran Minh Quan is celebrated for his electrifying stage presence and ability to unify ensembles. He frequently conducts international masterclasses focused on ensemble listening, leadership, and stage communication for string players.</p>'
          },
          {
            type: 'timeline',
            items: [
              {date: '2016', title: 'Concertmaster of VNSO', desc: 'Youngest musician to hold the chair.'},
              {date: '2020', title: 'Co-founded Strings for Youth', desc: 'Training programme for underserved students.'},
              {date: '2023', title: 'CTT Final Night conductor', desc: 'Finale reached more than one million online viewers.'}
            ]
          }
        ]
      }
    }
  },
  {
    id: 'person-sarah-johnson',
    slug: 'sarah-johnson',
    tenantId: 'tenant-main',
    order: 3,
    updatedAt: '2024-03-14T09:00:00.000Z',
    disciplines: ['Artistic coaching', 'Programme design'],
    photo: {
      id: 'advisor-sarah',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      alt: 'Sarah Johnson portrait'
    },
    socialLinks: [
      {label: 'Website', url: 'https://sarahjohnson.art', platform: 'website'},
      {label: 'LinkedIn', url: 'https://linkedin.com/in/sarahjohnsonart', platform: 'website'}
    ],
    locales: {
      vi: {
        name: 'Sarah Johnson',
        title: 'Cố vấn nghệ thuật',
        bio: 'Giám đốc nghệ thuật của London Young Artists, chuyên gia cố vấn phát triển chương trình.',
        achievements: [
          '15 năm điều hành chương trình London Young Artists',
          'Cố vấn nghệ thuật cho hơn 30 dự án đa quốc gia',
          'Tác giả sách “Designing Immersive Concerts”'
        ],
        highlights: [
          {
            year: '2022',
            title: 'Thiết kế chương trình CTT Residency',
            description: 'Khóa cư trú nghệ sĩ tập trung vào storytelling và trình diễn sân khấu.'
          },
          {
            year: '2020',
            title: 'Ra mắt podcast “Stagecraft”',
            description: 'Chuỗi podcast phỏng vấn các đạo diễn sân khấu hàng đầu.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Sarah Johnson đồng hành cùng các nhà tổ chức để phát triển trải nghiệm biểu diễn toàn diện. Cô đặc biệt chú trọng vào việc kết nối khán giả thông qua câu chuyện của nghệ sĩ và định hình hành trình cảm xúc của chương trình.</p>'
          },
          {
            type: 'cta-buttons',
            items: [
              {
                label: 'Đặt lịch tư vấn',
                href: 'mailto:advisory@cttmusic.vn',
                external: true
              }
            ]
          }
        ]
      },
      en: {
        name: 'Sarah Johnson',
        title: 'Artistic Advisor',
        bio: 'Artistic director of London Young Artists and consultant for immersive programme design.',
        achievements: [
          'Led London Young Artists for 15 years',
          'Advised over 30 international cultural initiatives',
          'Author of “Designing Immersive Concerts”'
        ],
        highlights: [
          {
            year: '2022',
            title: 'Designed the CTT Residency',
            description: 'Artist-in-residence focusing on narrative-driven performances.'
          },
          {
            year: '2020',
            title: 'Launched “Stagecraft” podcast',
            description: 'A series spotlighting directors shaping modern concert experiences.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Sarah Johnson partners with festivals to craft cohesive and emotionally engaging concert journeys. Her work centres on storytelling, inclusive programming, and creating memorable encounters between artists and audiences.</p>'
          },
          {
            type: 'cta-buttons',
            items: [
              {
                label: 'Book a consultation',
                href: 'mailto:advisory@cttmusic.vn',
                external: true
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'person-le-anh-tu',
    slug: 'le-anh-tu',
    tenantId: 'tenant-classic',
    order: 1,
    updatedAt: '2024-03-11T07:00:00.000Z',
    disciplines: ['Piano pedagogy', 'Curriculum design'],
    photo: {
      id: 'classic-judge-tu',
      url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
      alt: 'Le Anh Tu portrait'
    },
    socialLinks: [
      {label: 'Facebook', url: 'https://facebook.com/leanhtu.music', platform: 'facebook'}
    ],
    contactEmail: 'academy@classic.ctt.vn',
    locales: {
      vi: {
        name: 'Lê Anh Tú',
        title: 'Giám đốc học thuật',
        bio: 'Từng là trưởng khoa Piano tại Nhạc viện TP.HCM, xây dựng chương trình đào tạo nâng cao cho học viên trẻ.',
        achievements: [
          '20 năm kinh nghiệm đào tạo Piano chuyên nghiệp',
          'Tác giả bộ giáo trình “Piano Explorers”',
          'Giám khảo khách mời của ABRSM khu vực Đông Nam Á'
        ],
        highlights: [
          {
            year: '2023',
            title: 'Triển khai chương trình Piano Diploma',
            description: 'Lộ trình 3 năm giúp học viên đạt chứng chỉ quốc tế.'
          },
          {
            year: '2019',
            title: 'Giải thưởng Nhà giáo trẻ tiêu biểu',
            description: 'Được UBND TP.HCM vinh danh với đóng góp cho giáo dục nghệ thuật.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Lê Anh Tú chú trọng phát triển nền tảng kỹ thuật vững chắc, đồng thời khuyến khích học viên tự sáng tạo trên tác phẩm cổ điển. Ông là người định hình triết lý giảng dạy của CTT Classical Academy.</p>'
          },
          {
            type: 'timeline',
            items: [
              {date: '2015', title: 'Trưởng khoa Piano Nhạc viện TP.HCM'},
              {date: '2020', title: 'Thành lập CTT Classical Academy'},
              {date: '2023', title: 'Ra mắt chương trình Diploma quốc tế'}
            ]
          }
        ]
      },
      en: {
        name: 'Le Anh Tu',
        title: 'Academic Director',
        bio: 'Former head of piano faculty at HCMC Conservatory, architect of the Classical Academy curriculum.',
        achievements: [
          '20 years of professional piano teaching',
          'Author of the “Piano Explorers” syllabus',
          'Guest examiner for ABRSM Southeast Asia'
        ],
        highlights: [
          {
            year: '2023',
            title: 'Launched Diploma piano pathway',
            description: 'A three-year route to international certification.'
          },
          {
            year: '2019',
            title: 'Outstanding Young Educator award',
            description: 'Recognised by the Ho Chi Minh City People’s Committee.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Le Anh Tu focuses on developing solid technical foundations while empowering students to craft their own interpretations of classical repertoire. He shapes the educational philosophy of the CTT Classical Academy.</p>'
          },
          {
            type: 'timeline',
            items: [
              {date: '2015', title: 'Head of piano faculty – HCMC Conservatory'},
              {date: '2020', title: 'Founded CTT Classical Academy'},
              {date: '2023', title: 'Introduced international Diploma pathway'}
            ]
          }
        ]
      }
    }
  },
  {
    id: 'person-marie-dupont',
    slug: 'marie-dupont',
    tenantId: 'tenant-classic',
    order: 2,
    updatedAt: '2024-03-13T13:00:00.000Z',
    disciplines: ['Vocal performance', 'Opera coaching'],
    photo: {
      id: 'classic-judge-marie',
      url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
      alt: 'Marie Dupont portrait'
    },
    socialLinks: [
      {label: 'YouTube', url: 'https://youtube.com/@mariedupont', platform: 'youtube'}
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/aLZ0ZK8cOMo',
    locales: {
      vi: {
        name: 'Marie Dupont',
        title: 'Giảng viên Thanh nhạc',
        bio: 'Soprano người Pháp từng biểu diễn tại Opéra de Lyon và giảng dạy tại CNSMD Paris.',
        achievements: [
          'Solist chính của Opéra de Lyon (2012–2018)',
          'Tốt nghiệp xuất sắc CNSMD Paris',
          'Hướng dẫn kỹ thuật bel canto cho hơn 100 học viên quốc tế'
        ],
        highlights: [
          {
            year: '2024',
            title: 'Masterclass bel canto tại CTT',
            description: 'Chuỗi lớp học chuyên sâu kéo dài 10 ngày.'
          },
          {
            year: '2022',
            title: 'Dự án Opera Lab',
            description: 'Đồng sản xuất vở opera dành cho nghệ sĩ trẻ Đông Nam Á.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Marie Dupont tập trung xây dựng hơi thở và phát âm chuẩn xác cho ca sĩ trẻ. Cô kết hợp phương pháp bel canto truyền thống với các bài tập hiện đại giúp học viên phát triển bền vững.</p>'
          },
          {
            type: 'cta-buttons',
            items: [
              {
                label: 'Đăng ký lớp masterclass',
                href: 'https://classic.ctt.vn/masterclass',
                external: true
              }
            ]
          }
        ]
      },
      en: {
        name: 'Marie Dupont',
        title: 'Vocal Faculty',
        bio: 'French soprano with appearances at Opéra de Lyon and lecturer at CNSMD Paris.',
        achievements: [
          'Principal soloist at Opéra de Lyon (2012–2018)',
          'Graduated with distinction from CNSMD Paris',
          'Mentored over 100 international vocalists in bel canto technique'
        ],
        highlights: [
          {
            year: '2024',
            title: 'Bel canto masterclass at CTT',
            description: 'Ten-day intensive coaching programme.'
          },
          {
            year: '2022',
            title: 'Opera Lab project',
            description: 'Co-produced a youth opera across Southeast Asia.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Marie Dupont emphasises breath management and precise diction, blending classical bel canto training with contemporary wellness practices to support sustainable vocal growth.</p>'
          },
          {
            type: 'cta-buttons',
            items: [
              {
                label: 'Join the masterclass',
                href: 'https://classic.ctt.vn/masterclass',
                external: true
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'person-pham-bich-ngoc',
    slug: 'pham-bich-ngoc',
    tenantId: 'tenant-classic',
    order: 3,
    updatedAt: '2024-03-17T11:15:00.000Z',
    disciplines: ['Programme direction', 'Youth orchestra'],
    photo: {
      id: 'classic-judge-ngoc',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e2',
      alt: 'Pham Bich Ngoc portrait'
    },
    locales: {
      vi: {
        name: 'Phạm Bích Ngọc',
        title: 'Cố vấn nghệ thuật',
        bio: 'Chuyên gia dàn dựng chương trình hòa nhạc cho thiếu niên, sáng lập CTT Chamber Lab.',
        achievements: [
          '12 năm điều hành CTT Chamber Lab',
          'Đạo diễn hơn 40 chương trình giao hưởng thiếu nhi',
          'Cố vấn âm nhạc cho nhiều dự án giáo dục nghệ thuật tại Việt Nam'
        ],
        highlights: [
          {
            year: '2024',
            title: 'Dự án “Sound of Youth”',
            description: 'Tổ chức tour lưu diễn cho dàn nhạc thiếu niên qua 5 thành phố.'
          },
          {
            year: '2021',
            title: 'Ra mắt bộ tài liệu tập luyện trực tuyến',
            description: 'Hỗ trợ giáo viên âm nhạc triển khai chương trình hòa tấu từ xa.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Phạm Bích Ngọc tập trung xây dựng môi trường học tập cộng tác, nơi học viên trẻ học cách lắng nghe và lãnh đạo trong dàn nhạc. Cô là nhân tố quan trọng trong việc phát triển các dự án cộng đồng của CTT.</p>'
          },
          {
            type: 'timeline',
            items: [
              {date: '2012', title: 'Thành lập CTT Chamber Lab'},
              {date: '2018', title: 'Mở rộng chương trình ra 12 tỉnh thành'},
              {date: '2024', title: 'Tour lưu diễn Sound of Youth'}
            ]
          }
        ]
      },
      en: {
        name: 'Pham Bich Ngoc',
        title: 'Artistic Mentor',
        bio: 'Programme director for youth orchestras and founder of CTT Chamber Lab.',
        achievements: [
          'Directed CTT Chamber Lab for 12 years',
          'Produced more than 40 youth symphonic productions',
          'Advisor to multiple arts education initiatives across Vietnam'
        ],
        highlights: [
          {
            year: '2024',
            title: '“Sound of Youth” tour',
            description: 'Led a five-city tour for the CTT Youth Orchestra.'
          },
          {
            year: '2021',
            title: 'Launched online rehearsal toolkit',
            description: 'Enabled schools to run remote ensemble training.'
          }
        ],
        blocks: [
          {
            type: 'rich-content',
            content:
              '<p>Pham Bich Ngoc fosters collaborative learning environments where young musicians develop listening skills and leadership within ensembles. She drives CTT’s community outreach programmes.</p>'
          },
          {
            type: 'timeline',
            items: [
              {date: '2012', title: 'Founded CTT Chamber Lab'},
              {date: '2018', title: 'Expanded to 12 provinces'},
              {date: '2024', title: 'Sound of Youth touring production'}
            ]
          }
        ]
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
    .map((person) => createLocalizedPerson(person, locale))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  if (typeof limit === 'number') {
    return localized.slice(0, limit);
  }

  return localized;
}

export function searchPeopleByTenant({
  tenantId,
  locale,
  page = 1,
  limit = 6,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  q?: string;
}) {
  const normalizedQuery = q?.trim().toLowerCase();
  const normalizedLimit = Math.max(1, Math.min(Number.isFinite(limit) ? Number(limit) : 6, 50));
  const normalizedPage = Math.max(1, Number.isFinite(page) ? Number(page) : 1);
  const people = listPeopleByTenant({tenantId, locale});

  const filtered = normalizedQuery
    ? people.filter((person) => {
        if (matchesQuery(person.name, normalizedQuery)) return true;
        if (matchesQuery(person.title, normalizedQuery)) return true;
        if (matchesQuery(person.bio, normalizedQuery)) return true;
        if (matchesQuery(person.quote, normalizedQuery)) return true;
        if (matchesQuery(person.contactEmail, normalizedQuery)) return true;
        if (matchesQuery(person.contactPhone, normalizedQuery)) return true;
        if (matchesList(person.disciplines, normalizedQuery)) return true;
        if (matchesList(person.achievements, normalizedQuery)) return true;
        if (
          (person.highlights ?? []).some(
            (highlight) =>
              matchesQuery(highlight.title, normalizedQuery) ||
              matchesQuery(highlight.description, normalizedQuery)
          )
        ) {
          return true;
        }
        return false;
      })
    : people;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / normalizedLimit));
  const currentPage = Math.min(normalizedPage, totalPages);
  const startIndex = (currentPage - 1) * normalizedLimit;
  const items = filtered.slice(startIndex, startIndex + normalizedLimit);

  return {
    items,
    total,
    page: currentPage,
    limit: normalizedLimit,
    totalPages,
    hasMore: currentPage < totalPages
  };
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
  const seed = peopleSeeds.find((person) => person.tenantId === tenantId && person.slug === slug);
  if (!seed) {
    return undefined;
  }
  return createLocalizedPerson(seed, locale);
}

export function findPersonTranslations({
  tenantId,
  slug
}: {
  tenantId: string;
  slug: string;
}) {
  const seed = peopleSeeds.find((person) => person.tenantId === tenantId && person.slug === slug);
  if (!seed) {
    return [] as {locale: 'vi' | 'en'; slug: string}[];
  }

  return (Object.keys(seed.locales) as Array<'vi' | 'en'>).map((locale) => ({
    locale,
    slug: seed.slug
  }));
}
