import '@/public/styles/index.css';
import { MainLayout } from '@/src/presentation/components/layout/MainLayout';
import { ThemeProvider } from '@/src/presentation/components/layout/ThemeProvider';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Care Team Songkhla | กลุ่มคนทำงานดูแลผู้ใช้สารเสพติดจังหวัดสงขลา',
  description:
    'ให้บริการด้านสุขภาพและสังคมแก่กลุ่มผู้ใช้สารเสพติด โดยมุ่งเน้นการลดอันตรายจากการใช้ยา (Harm Reduction) และการป้องกันโรคติดต่อ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} antialiased`}>
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
