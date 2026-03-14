'use client';

import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/src/presentation/utils/cn';

interface DataTableHeaderProps {
  label: string;
  sortBy: string;
  currentSortBy: string;
  currentSortOrder: 'asc' | 'desc';
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

export function DataTableHeader({
  label,
  sortBy,
  currentSortBy,
  currentSortOrder,
  onSort,
  className
}: DataTableHeaderProps) {
  const isSorted = currentSortBy === sortBy;

  const handleClick = () => {
    const nextOrder = isSorted && currentSortOrder === 'asc' ? 'desc' : 'asc';
    onSort(sortBy, nextOrder);
  };

  return (
    <th 
      className={cn(
        "px-6 md:px-8 py-5 border-b border-border-light dark:border-white/5 cursor-pointer hover:bg-primary/10 transition-colors group",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "transition-colors",
          isSorted ? "text-primary" : "text-text-muted group-hover:text-text-primary dark:group-hover:text-foreground"
        )}>
          {label}
        </span>
        <div className="flex flex-col opacity-30 group-hover:opacity-100 transition-opacity">
          {isSorted ? (
            currentSortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />
          ) : (
            <ArrowUpDown className="w-3 h-3" />
          )}
        </div>
      </div>
    </th>
  );
}
