import { AdminSidebar } from '@/src/presentation/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
