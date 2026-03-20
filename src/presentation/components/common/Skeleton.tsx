import { cn } from '@/src/presentation/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-surface-elevated/50 dark:bg-white/5 border border-border-light dark:border-white/5",
        className
      )}
      {...props}
    />
  );
}
