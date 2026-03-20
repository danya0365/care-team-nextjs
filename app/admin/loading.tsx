import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { Skeleton } from '@/src/presentation/components/common/Skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<Skeleton className="w-64 h-10 lg:h-14 mt-2" />}
        description={<Skeleton className="w-full max-w-md h-5 mt-4" />}
        spacing="default"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 w-full animate-in fade-in duration-1000">
        {/* Placeholder for top actions/search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-[52px] w-full md:w-[300px]" />
          <Skeleton className="h-[52px] w-[180px]" />
          <Skeleton className="h-[52px] w-[220px]" />
          <div className="flex-1"></div>
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-32 rounded-2xl" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-card-bg shadow-sm border border-border-light dark:border-white/5 h-[160px] flex flex-col justify-between">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div>
                <Skeleton className="w-20 h-3 mb-3" />
                <Skeleton className="w-14 h-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area Skeleton */}
        <div className="rounded-[2.5rem] bg-white dark:bg-card-bg shadow-xl shadow-black/5 dark:shadow-black/20 border border-border-light dark:border-white/5 p-0 overflow-hidden">
          {/* Table Header */}
          <div className="bg-primary/5 dark:bg-primary-dark/5 px-6 md:px-8 py-5 flex items-center justify-between">
             <Skeleton className="w-24 h-4 bg-primary/10" />
             <Skeleton className="w-32 h-4 bg-primary/10" />
             <Skeleton className="w-24 h-4 bg-primary/10" />
             <Skeleton className="w-16 h-4 bg-primary/10" />
             <Skeleton className="w-12 h-4 bg-primary/10" />
          </div>
          <div className="divide-y divide-border-light dark:divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-6 md:px-8 py-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-16 h-3" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-40 h-5" />
                  <Skeleton className="w-32 h-4" />
                </div>
                <Skeleton className="w-28 h-6 rounded-xl" />
                <Skeleton className="w-24 h-6 rounded-xl" />
                <div className="flex gap-2">
                   <Skeleton className="w-10 h-10 rounded-xl" />
                   <Skeleton className="w-10 h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
