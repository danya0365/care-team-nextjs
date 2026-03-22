import { AdminSidebar } from '@/src/presentation/components/layout/AdminSidebar';
import { getSessionAction } from '@/src/presentation/actions/authActions';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionAction();

  // 1. Auth Check - If no session, go to login
  if (!session) {
    // We add ?reason=stale so that proxy.ts knows to CLEAR the cookie
    // even if it passes the cryptographic JWT check (ghost session)
    redirect('/login?reason=stale');
  }

  // 2. Role Check - Strict Admin Only
  if (session.activeProfile.roleId !== 'admin') {
    return (
      <div className="min-h-screen bg-ui-bg dark:bg-background flex items-center justify-center p-6 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-ui-card rounded-2xl shadow-xl p-8 text-center border border-red-100 dark:border-red-900/30">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-ui-text-primary dark:text-white mb-3">Access Denied</h1>
          <p className="text-ui-text-muted dark:text-text-muted mb-8 text-lg font-light leading-relaxed">
            ขออภัย คุณไม่มีสิทธิ์เข้าถึงส่วนของผู้ดูแลระบบ (Admin Only)
          </p>
          <Link
            href="/"
            className="inline-block w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-ui-bg dark:bg-background min-h-screen transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-1 w-full overflow-hidden relative">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
