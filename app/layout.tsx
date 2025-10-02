import './globals.css';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: {
    default: 'CTT Music Platform',
    template: '%s | CTT Music Platform'
  },
  description:
    'Nền tảng đa tenant dành cho website sự kiện/cuộc thi âm nhạc với hiệu năng cao và hỗ trợ đa ngôn ngữ.'
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
