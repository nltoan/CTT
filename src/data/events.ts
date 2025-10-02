import type {Event} from '@types/cms';

const mainEvents: Event[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `event-1-${locale}`,
    tenantId: 'tenant-main',
    locale,
    title: locale === 'vi' ? 'Hội thảo định hướng nghề nghiệp' : 'Career orientation workshop',
    startsAt: '2025-02-15T09:00:00.000Z',
    endsAt: '2025-02-15T11:30:00.000Z',
    location: 'Hà Nội',
    description:
      locale === 'vi'
        ? 'Chia sẻ từ các giảng viên và nghệ sĩ quốc tế về định hướng phát triển sự nghiệp.'
        : 'Insights from international faculty on building a sustainable music career.'
  },
  {
    id: `event-2-${locale}`,
    tenantId: 'tenant-main',
    locale,
    title: locale === 'vi' ? 'Concert Gala 2025' : '2025 Gala Concert',
    startsAt: '2025-05-02T19:00:00.000Z',
    location: 'Nhà hát lớn Hà Nội',
    description:
      locale === 'vi'
        ? 'Đêm nhạc vinh danh các tài năng đoạt giải cùng dàn nhạc giao hưởng.'
        : 'A celebration featuring award-winning talents with a symphony orchestra.'
  }
]);

const classicEvents: Event[] = ['vi', 'en'].flatMap((locale) => [
  {
    id: `classic-event-1-${locale}`,
    tenantId: 'tenant-classic',
    locale,
    title: locale === 'vi' ? 'Buổi audition học bổng' : 'Scholarship audition day',
    startsAt: '2025-06-12T08:30:00.000Z',
    location: 'TP. Hồ Chí Minh',
    description:
      locale === 'vi'
        ? 'Tuyển chọn học viên cho chương trình học bổng mùa Thu với hội đồng giảng viên quốc tế.'
        : 'Select candidates for the Fall scholarship program with international faculty.'
  }
]);

export const events: Event[] = [...mainEvents, ...classicEvents];

export function listEventsByTenant({
  tenantId,
  locale,
  from,
  to
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  from?: Date;
  to?: Date;
}) {
  return events.filter((event) => {
    if (event.tenantId !== tenantId || event.locale !== locale) {
      return false;
    }
    const startsAt = new Date(event.startsAt);
    if (from && startsAt < from) {
      return false;
    }
    if (to && startsAt > to) {
      return false;
    }
    return true;
  });
}
