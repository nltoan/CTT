import type {Page} from '@types/cms';
import type {
  ContactBlock,
  DisciplinesGridBlock,
  HeroCountdownBlock,
  PeopleGridBlock,
  PostListBlock,
  PrizesBlock,
  SponsorsGridBlock,
  TimelineBlock,
  TestimonialsBlock,
  ImageGalleryBlock,
  CtaButtonsBlock,
  SlideshowBlock,
  RichContentBlock
} from '@types/blocks';

const heroBlock = (locale: 'vi' | 'en'): HeroCountdownBlock => ({
  type: 'hero-countdown',
  heading:
    locale === 'vi'
      ? 'Cuộc thi tài năng âm nhạc CTT 2025'
      : 'CTT Music Talent Competition 2025',
  subheading:
    locale === 'vi'
      ? 'Sân chơi quốc tế dành cho các tài năng âm nhạc trẻ'
      : 'An international stage for emerging young musicians',
  description:
    locale === 'vi'
      ? 'Khám phá các bộ môn Piano, Dây, Thanh nhạc, Guitar, Ukulele và Dàn nhạc.'
      : 'Explore Piano, Strings, Vocal, Guitar, Ukulele and Orchestra disciplines.',
  deadline: '2025-03-01T23:59:59.000Z',
  countdownLabel: locale === 'vi' ? 'Hạn đăng ký còn' : 'Registration closes in',
  primaryCta: {
    label: locale === 'vi' ? 'Tra cứu thí sinh' : 'Contestant lookup',
    href: 'https://example.com/lookup',
    external: true
  },
  secondaryCta: {
    label: locale === 'vi' ? 'Đăng ký ngay' : 'Register now',
    href: 'https://example.com/register',
    external: true
  },
  background: {
    id: 'hero-bg',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    alt: 'Performance stage with piano'
  },
  overlay: true
});

const createDisciplinesBlock = (locale: 'vi' | 'en'): DisciplinesGridBlock => ({
  type: 'disciplines-grid',
  title: locale === 'vi' ? 'Bộ môn dự thi' : 'Competition disciplines',
  description:
    locale === 'vi'
      ? 'Khám phá các hạng mục biểu diễn dành cho thí sinh.'
      : 'Discover all categories available for contestants.',
  items: [
    {
      title: 'Piano',
      description:
        locale === 'vi' ? 'Biểu diễn solo và concerto.' : 'Solo recitals and concerto repertoire.',
      image: {
        id: 'piano',
        url: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf',
        alt: 'Piano keys'
      }
    },
    {
      title: locale === 'vi' ? 'Nhạc cụ dây' : 'Strings',
      description:
        locale === 'vi' ? 'Violin, Viola, Cello.' : 'Violin, viola and cello performances.',
      image: {
        id: 'strings',
        url: 'https://images.unsplash.com/photo-1513883560-9c31a7c9e8e8',
        alt: 'String instruments'
      }
    },
    {
      title: locale === 'vi' ? 'Thanh nhạc' : 'Vocal',
      description:
        locale === 'vi'
          ? 'Giọng ca cổ điển và đương đại.'
          : 'Classical and contemporary vocal performances.',
      image: {
        id: 'vocal',
        url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        alt: 'Singer on stage'
      }
    },
    {
      title: 'Guitar',
      description:
        locale === 'vi' ? 'Acoustic & Classic.' : 'Acoustic and classical guitar.',
      image: {
        id: 'guitar',
        url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167',
        alt: 'Guitar player'
      }
    },
    {
      title: 'Ukulele',
      description:
        locale === 'vi' ? 'Trình diễn solo và nhóm.' : 'Solo and ensemble showcases.',
      image: {
        id: 'ukulele',
        url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
        alt: 'Ukulele'
      }
    },
    {
      title: locale === 'vi' ? 'Dàn nhạc' : 'Orchestra',
      description:
        locale === 'vi' ? 'Giao hưởng & hòa tấu.' : 'Symphonic and chamber orchestra.',
      image: {
        id: 'orchestra',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        alt: 'Orchestra on stage'
      }
    }
  ]
});

const createTimelineBlock = (locale: 'vi' | 'en'): TimelineBlock => ({
  type: 'timeline',
  title: locale === 'vi' ? 'Mốc thời gian' : 'Key milestones',
  description:
    locale === 'vi'
      ? 'Theo dõi các giai đoạn quan trọng của cuộc thi.'
      : 'Follow the major stages of the competition.',
  items: [
    {
      title: locale === 'vi' ? 'Vòng sơ khảo' : 'Preliminary round',
      datetime: '2025-03-05T09:00:00.000Z',
      description:
        locale === 'vi'
          ? 'Nộp video dự thi online và chấm điểm vòng loại.'
          : 'Submit audition videos online for preliminary judging.'
    },
    {
      title: locale === 'vi' ? 'Vòng bán kết' : 'Semifinal',
      datetime: '2025-04-10T09:00:00.000Z',
      description:
        locale === 'vi'
          ? 'Biểu diễn trực tiếp tại Hà Nội với ban giám khảo quốc tế.'
          : 'Perform live in Hanoi with an international jury.'
    },
    {
      title: locale === 'vi' ? 'Chung kết & Gala' : 'Final & Gala',
      datetime: '2025-05-02T19:00:00.000Z',
      description:
        locale === 'vi'
          ? 'Trình diễn tại Nhà hát lớn với dàn nhạc giao hưởng.'
          : 'Perform at the Opera House with a symphony orchestra.'
    }
  ]
});

const createPrizesBlock = (locale: 'vi' | 'en'): PrizesBlock => ({
  type: 'prizes',
  title: locale === 'vi' ? 'Giải thưởng nổi bật' : 'Signature awards',
  description:
    locale === 'vi'
      ? 'Vinh danh các tài năng xuất sắc và trao cơ hội biểu diễn quốc tế.'
      : 'Celebrate outstanding talents with international performance opportunities.',
  items: [
    {
      title: locale === 'vi' ? 'Quán quân' : 'Grand Prize',
      description:
        locale === 'vi'
          ? 'Giải thưởng tiền mặt 5.000 USD và suất biểu diễn quốc tế.'
          : 'USD 5,000 cash prize and an international recital invitation.'
    },
    {
      title: locale === 'vi' ? 'Á quân' : 'Second Prize',
      description:
        locale === 'vi'
          ? 'Giải thưởng tiền mặt 2.500 USD và workshop nâng cao.'
          : 'USD 2,500 cash prize and an intensive masterclass package.'
    },
    {
      title: locale === 'vi' ? 'Hạng mục triển vọng' : 'Promising Artist',
      description:
        locale === 'vi'
          ? 'Chứng nhận Festival và cơ hội biểu diễn cùng dàn nhạc.'
          : 'Festival certificate and a featured performance with orchestra.'
    }
  ]
});

const createSponsorsBlock = (locale: 'vi' | 'en'): SponsorsGridBlock => ({
  type: 'sponsors-grid',
  title: locale === 'vi' ? 'Đối tác & nhà tài trợ' : 'Partners & sponsors',
  description:
    locale === 'vi'
      ? 'Kết nối với các thương hiệu đồng hành cùng cuộc thi.'
      : 'Meet the brands supporting our competition.',
  items: [
    {
      name: 'Yamaha Music',
      tier: 'gold',
      url: 'https://yamaha.com',
      logo: {
        id: 'yamaha',
        url: 'https://dummyimage.com/200x80/1f2937/ffffff&text=Yamaha',
        alt: 'Yamaha logo'
      }
    },
    {
      name: 'Steinway & Sons',
      tier: 'silver',
      url: 'https://steinway.com',
      logo: {
        id: 'steinway',
        url: 'https://dummyimage.com/200x80/111827/ffffff&text=Steinway',
        alt: 'Steinway logo'
      }
    },
    {
      name: 'VN Airlines',
      tier: 'bronze',
      url: 'https://vietnamairlines.com',
      logo: {
        id: 'vna',
        url: 'https://dummyimage.com/200x80/0f172a/ffffff&text=VN+Airlines',
        alt: 'Vietnam Airlines logo'
      }
    }
  ]
});

const createPeopleBlock = (locale: 'vi' | 'en'): PeopleGridBlock => ({
  type: 'people-grid',
  title: locale === 'vi' ? 'Ban cố vấn & giám khảo' : 'Advisory board & jury',
  description:
    locale === 'vi'
      ? 'Đội ngũ chuyên gia uy tín đồng hành cùng thí sinh.'
      : 'Esteemed artists and mentors accompanying contestants.',
  items: [
    {
      name: 'Nguyễn Thu Hà',
      title: locale === 'vi' ? 'Giám khảo trưởng - Piano' : 'Head Judge – Piano',
      photo: {
        id: 'judge-ha',
        url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
        alt: 'Nguyen Thu Ha'
      }
    },
    {
      name: 'Trần Minh Quân',
      title: locale === 'vi' ? 'Giám khảo - Violin' : 'Judge – Violin',
      photo: {
        id: 'judge-quan',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        alt: 'Tran Minh Quan'
      }
    },
    {
      name: 'Sarah Johnson',
      title: locale === 'vi' ? 'Cố vấn nghệ thuật' : 'Artistic Advisor',
      photo: {
        id: 'advisor-sarah',
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
        alt: 'Sarah Johnson'
      }
    }
  ]
});

const createTestimonialsBlock = (locale: 'vi' | 'en'): TestimonialsBlock => ({
  type: 'testimonials',
  title: locale === 'vi' ? 'Chia sẻ từ giám khảo & thí sinh' : 'Voices from judges & contestants',
  description:
    locale === 'vi'
      ? 'Những câu chuyện truyền cảm hứng về hành trình âm nhạc cùng CTT.'
      : 'Inspiring stories from the CTT music journey.',
  items: [
    {
      quote:
        locale === 'vi'
          ? 'CTT mang đến sân khấu chuẩn quốc tế để nghệ sĩ trẻ tự tin tỏa sáng.'
          : 'CTT delivers an international-standard stage for young artists to shine.',
      name: locale === 'vi' ? 'TS. Lưu Quang Minh' : 'Dr. Luu Quang Minh',
      title: locale === 'vi' ? 'Giám khảo hạng mục Piano' : 'Piano jury member',
      avatar: {
        id: 'testimonial-1',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        alt: 'Jury member portrait'
      }
    },
    {
      quote:
        locale === 'vi'
          ? 'Khoảnh khắc biểu diễn tại gala CTT sẽ là ký ức đẹp nhất của tôi.'
          : 'Performing at the CTT gala was the highlight of my musical journey.',
      name: locale === 'vi' ? 'Trần Mai Anh' : 'Mai Anh Tran',
      title: locale === 'vi' ? 'Quán quân 2024 - Thanh nhạc' : '2024 Vocal champion',
      avatar: {
        id: 'testimonial-2',
        url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
        alt: 'Contest winner portrait'
      }
    }
  ]
});

const createGalleryBlock = (locale: 'vi' | 'en'): ImageGalleryBlock => ({
  type: 'image-gallery',
  title: locale === 'vi' ? 'Khoảnh khắc nổi bật' : 'Highlights from the stage',
  description:
    locale === 'vi'
      ? 'Hình ảnh từ các vòng thi và chương trình hòa nhạc của CTT.'
      : 'Scenes captured from CTT rounds and concerts.',
  layout: 'masonry',
  items: [
    {
      media: {
        id: 'gallery-1',
        url: 'https://images.unsplash.com/photo-1485579149621-3123dd979885',
        alt: 'Pianist performing on stage'
      },
      caption: locale === 'vi' ? 'Biểu diễn Piano đêm chung kết' : 'Final night piano performance'
    },
    {
      media: {
        id: 'gallery-2',
        url: 'https://images.unsplash.com/photo-1520512202623-51c5cdb34f6f',
        alt: 'String quartet'
      },
      caption: locale === 'vi' ? 'Tứ tấu dây học viện' : 'Academy string quartet'
    },
    {
      media: {
        id: 'gallery-3',
        url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
        alt: 'Audience applauding'
      },
      caption: locale === 'vi' ? 'Khán giả tại Nhà hát lớn' : 'Audience at the Opera House'
    },
    {
      media: {
        id: 'gallery-4',
        url: 'https://images.unsplash.com/photo-1484920287878-4b5e04d74fdc',
        alt: 'Vocal performance'
      },
      caption: locale === 'vi' ? 'Thí sinh hạng mục Thanh nhạc' : 'Vocal category contestant'
    }
  ]
});

const createCtaBlock = (locale: 'vi' | 'en'): CtaButtonsBlock => ({
  type: 'cta-buttons',
  title: locale === 'vi' ? 'Sẵn sàng tham gia?' : 'Ready to join?',
  description:
    locale === 'vi'
      ? 'Chọn hành động phù hợp để bắt đầu hành trình cùng CTT.'
      : 'Take the next step and begin your journey with CTT.',
  align: 'center',
  items: [
    {
      label: locale === 'vi' ? 'Đăng ký dự thi' : 'Apply now',
      href: 'https://example.com/apply',
      external: true
    },
    {
      label: locale === 'vi' ? 'Tải thể lệ' : 'Download guidelines',
      href: 'https://example.com/rules.pdf',
      external: true
    },
    {
      label: locale === 'vi' ? 'Nhận tư vấn' : 'Book consultation',
      href: '/contact'
    }
  ]
});

const createSlideshowBlock = (locale: 'vi' | 'en'): SlideshowBlock => ({
  type: 'slideshow',
  title: locale === 'vi' ? 'Không khí lễ hội CTT' : 'The CTT festival atmosphere',
  description:
    locale === 'vi'
      ? 'Cảm nhận năng lượng của các buổi biểu diễn và chương trình giao lưu.'
      : 'Feel the energy from performances and community events.',
  slides: [
    {
      id: 'slide-1',
      title: locale === 'vi' ? 'Khai mạc ấn tượng' : 'Grand opening night',
      caption:
        locale === 'vi'
          ? 'Toàn bộ dàn nhạc và giọng ca mở màn mùa thi mới.'
          : 'The full orchestra and vocalists open the new season.',
      image: {
        id: 'slide-1-img',
        url: 'https://images.unsplash.com/photo-1503424886303-4c8b4d82b1fb',
        alt: 'Opening concert stage'
      }
    },
    {
      id: 'slide-2',
      title: locale === 'vi' ? 'Workshop chuyên sâu' : 'Immersive masterclasses',
      caption:
        locale === 'vi'
          ? 'Giảng viên quốc tế đồng hành cùng thí sinh trong suốt quá trình luyện tập.'
          : 'International faculty guiding contestants throughout preparation.',
      image: {
        id: 'slide-2-img',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
        alt: 'Masterclass session'
      }
    },
    {
      id: 'slide-3',
      title: locale === 'vi' ? 'Gala vinh danh' : 'Celebration gala',
      caption:
        locale === 'vi'
          ? 'Tôn vinh những tài năng xuất sắc và kết nối cộng đồng âm nhạc.'
          : 'Honouring talents and connecting the music community.',
      image: {
        id: 'slide-3-img',
        url: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae',
        alt: 'Gala celebration'
      }
    }
  ],
  options: {
    autoplay: true,
    interval: 7000,
    loop: true
  }
});

const createRichContentBlock = (locale: 'vi' | 'en'): RichContentBlock => ({
  type: 'rich-content',
  title: locale === 'vi' ? 'Tầm nhìn & sứ mệnh' : 'Vision & mission',
  content:
    locale === 'vi'
      ? `<p>CTT hướng đến xây dựng cộng đồng âm nhạc trẻ đa văn hóa, tạo điều kiện cho các tài năng khám phá bản thân thông qua biểu diễn, sáng tạo và kết nối.</p>
         <p>Chúng tôi kết hợp hệ thống đánh giá minh bạch cùng chương trình cố vấn chuyên sâu để đồng hành cùng thí sinh trên hành trình dài hạn.</p>`
      : `<p>CTT nurtures a multicultural community of young musicians, empowering talents to explore their artistry through performance, creativity and collaboration.</p>
         <p>Transparent evaluation standards and long-term mentorship ensure each contestant receives personalised guidance.</p>`
});

const createContactBlock = (locale: 'vi' | 'en'): ContactBlock => ({
  type: 'contact',
  title: locale === 'vi' ? 'Liên hệ' : 'Contact',
  address:
    locale === 'vi'
      ? '123 Lý Thường Kiệt, Hà Nội, Việt Nam'
      : '123 Ly Thuong Kiet, Hanoi, Vietnam',
  addressLabel: locale === 'vi' ? 'Địa chỉ' : 'Address',
  phone: '+84 24 1234 5678',
  phoneLabel: locale === 'vi' ? 'Điện thoại' : 'Phone',
  email: 'hello@cimfc.local',
  emailLabel: 'Email',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.376909743348!2d105.83966957604814!3d21.01703998834733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7f5e63d019%3A0xa40dfd1f720733d8!2zSMOgIE7hu5lpIFRo4bqldCAtIEPDtG5nIHZp4buFbiBiw6AgdGh14bqtdA!5e0!3m2!1sen!2s!4v1706810000000!5m2!1sen!2s'
});

const createPostListBlock = (locale: 'vi' | 'en'): PostListBlock => ({
  type: 'post-list',
  title: locale === 'vi' ? 'Tin tức mới nhất' : 'Latest news',
  description:
    locale === 'vi'
      ? 'Cập nhật thông tin hoạt động, lịch thi và câu chuyện truyền cảm hứng.'
      : 'News, schedules and inspiring stories from the festival.',
  ctaLabel: locale === 'vi' ? 'Đọc thêm' : 'Read more',
  query: {limit: 4}
});

const mainPages = ['vi', 'en'].flatMap((locale) => [
  {
    id: `home-${locale}`,
    slug: '',
    title: locale === 'vi' ? 'Trang chủ' : 'Home',
    tenantId: 'tenant-main',
    locale,
    blocks: [
      heroBlock(locale),
      createCtaBlock(locale),
      createDisciplinesBlock(locale),
      createSlideshowBlock(locale),
      createTimelineBlock(locale),
      createRichContentBlock(locale),
      createGalleryBlock(locale),
      createTestimonialsBlock(locale),
      createPrizesBlock(locale),
      createSponsorsBlock(locale),
      createPeopleBlock(locale),
      createPostListBlock(locale),
      createContactBlock(locale)
    ]
  },
  {
    id: `about-${locale}`,
    slug: 'about',
    title: locale === 'vi' ? 'Giới thiệu' : 'About',
    tenantId: 'tenant-main',
    locale,
    blocks: [createPeopleBlock(locale), createContactBlock(locale)]
  },
  {
    id: `contact-${locale}`,
    slug: 'contact',
    title: locale === 'vi' ? 'Liên hệ' : 'Contact',
    tenantId: 'tenant-main',
    locale,
    blocks: [createContactBlock(locale)]
  }
]);

const classicHeroBlock = (locale: 'vi' | 'en'): HeroCountdownBlock => ({
  ...heroBlock(locale),
  heading: locale === 'vi' ? 'Học viện Âm nhạc Cổ điển CTT' : 'CTT Classical Academy',
  subheading:
    locale === 'vi'
      ? 'Chương trình đào tạo và biểu diễn dành cho học viên trẻ'
      : 'Training and performance programs for young musicians',
  description:
    locale === 'vi'
      ? 'Khai giảng mùa Thu 2025 với các lớp Thính phòng, Piano và Nhạc lý nâng cao.'
      : 'Fall 2025 intake with chamber music, piano and advanced theory tracks.',
  deadline: '2025-08-20T23:59:59.000Z',
  primaryCta: {
    label: locale === 'vi' ? 'Tư vấn tuyển sinh' : 'Admissions counselling',
    href: 'https://example.com/admissions',
    external: true
  },
  secondaryCta: {
    label: locale === 'vi' ? 'Tải brochure' : 'Download brochure',
    href: 'https://example.com/brochure.pdf',
    external: true
  },
  background: {
    id: 'classic-hero',
    url: 'https://images.unsplash.com/photo-1507835661278-14e85f2d0d5b',
    alt: 'Classical orchestra rehearsal'
  }
});

const classicPages = ['vi', 'en'].flatMap((locale) => [
  {
    id: `classic-home-${locale}`,
    slug: '',
    title: locale === 'vi' ? 'Trang chủ' : 'Home',
    tenantId: 'tenant-classic',
    locale,
    blocks: [
      classicHeroBlock(locale),
      createDisciplinesBlock(locale),
      createSlideshowBlock(locale),
      createTimelineBlock(locale),
      createRichContentBlock(locale),
      createTestimonialsBlock(locale),
      createPeopleBlock(locale),
      createContactBlock(locale)
    ]
  },
  {
    id: `classic-about-${locale}`,
    slug: 'about',
    title: locale === 'vi' ? 'Về học viện' : 'About the academy',
    tenantId: 'tenant-classic',
    locale,
    blocks: [createPeopleBlock(locale), createContactBlock(locale)]
  }
]);

export const pages: Page[] = [...mainPages, ...classicPages];

export function findPageBySlug({
  tenantId,
  slug,
  locale
}: {
  tenantId: string;
  slug: string;
  locale: 'vi' | 'en';
}) {
  return pages.find(
    (page) =>
      page.tenantId === tenantId &&
      page.locale === locale &&
      (page.slug === slug || (page.slug === '' && slug === ''))
  );
}
