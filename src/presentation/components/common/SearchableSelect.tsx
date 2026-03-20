'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/src/presentation/utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Overrides for button trigger
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'เลือก...',
  className,
  disabled = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  // Allow matching by both value and label
  const filteredOptions = options.filter(
    (opt) => 
      opt.label.toLowerCase().includes(search.toLowerCase()) || 
      opt.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch(''); // Reset search on open
          }
        }}
        className={cn(
          "w-full px-5 py-4 text-left rounded-xl bg-surface-elevated dark:bg-primary-dark/20",
          "border border-border-light dark:border-white/10",
          "focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
          "flex items-center justify-between font-bold text-text-primary dark:text-foreground",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className={cn("block truncate", !selectedOption && "text-text-muted italic font-normal")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1c23] border border-border-light dark:border-white/10 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Search Input Container */}
          <div className="p-2 border-b border-border-light dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                autoFocus
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface dark:bg-black/20 border border-border/50 rounded-lg text-sm text-text-primary dark:text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent closing
              />
            </div>
          </div>
          
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar bg-white dark:bg-[#1a1c23]">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-muted">ไม่พบตัวเลือกที่ค้นหา</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors text-left",
                    value === option.value 
                      ? "bg-primary/10 text-primary font-bold" 
                      : "text-text-primary dark:text-foreground hover:bg-surface-elevated dark:hover:bg-white/5"
                  )}
                >
                  <span className="truncate pr-4">{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
