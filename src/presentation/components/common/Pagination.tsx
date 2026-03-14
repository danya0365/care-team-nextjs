'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/src/presentation/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  limit: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  limit,
  className
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis-start');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('ellipsis-end');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-8 border-t border-border/50 bg-primary/5 dark:bg-primary-dark/5", className)}>
      <div className="text-xs font-bold text-text-muted">
        แสดง <span className="text-text-primary dark:text-foreground">{startRecord}</span> ถึง <span className="text-text-primary dark:text-foreground">{endRecord}</span> จากทั้งหมด <span className="text-text-primary dark:text-foreground">{totalRecords}</span> รายการ
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border/30 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, i) => (
          page === 'ellipsis-start' || page === 'ellipsis-end' ? (
            <div key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-text-muted">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-10 h-10 rounded-xl text-xs font-black transition-all border shadow-sm",
                currentPage === page
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-text-secondary hover:bg-white dark:hover:bg-white/10 border-border/30"
              )}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border/30 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
