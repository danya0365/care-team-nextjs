import { HomeView } from '@/src/presentation/components/home/HomeView';
import { createServerHomePresenter } from '@/src/presentation/presenters/home/HomePresenterServerFactory';
import type { Metadata } from 'next';
import Link from 'next/link';

// Tell Next.js this is a dynamic page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for the homepage
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerHomePresenter();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Care Team Songkhla',
      description: 'กลุ่มคนทำงานดูแลผู้ใช้สารเสพติดจังหวัดสงขลา',
    };
  }
}

/**
 * Homepage - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function HomePage() {
  const presenter = createServerHomePresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <HomeView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching home data:', error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-text-muted mb-4">
            ไม่สามารถโหลดข้อมูลหน้าแรกได้
          </p>
          <Link
            href="/"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            ลองใหม่อีกครั้ง
          </Link>
        </div>
      </div>
    );
  }
}
