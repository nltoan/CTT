import './globals.css';
import type {Metadata} from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://ctt.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CTT Music Platform',
    template: '%s | CTT Music Platform'
  },
  description:
    'Nền tảng đa tenant dành cho website sự kiện/cuộc thi âm nhạc với hiệu năng cao và hỗ trợ đa ngôn ngữ.',
  alternates: {
    languages: {
      vi: '/vi',
      en: '/en'
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
