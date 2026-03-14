'use client';

import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  badgeText?: string;
  className?: string;
  children?: ReactNode;
  spacing?: 'default' | 'large';
}

/**
 * PageHeader Component
 * 
 * A reusable header section for top-level pages with a consistent gradient background,
 * refined typography, and entrance animations.
 * 
 * @param title - The main heading text (wrapped in h1)
 * @param description - Optional subtitle text (wrapped in p)
 * @param badgeText - Optional pill badge text displayed above the title
 * @param spacing - Controls the vertical padding ('default' for standard, 'large' for more breathing room)
 * @param children - Optional extra content to render inside the header container
 */
export function PageHeader({ 
  title, 
  description, 
  badgeText, 
  className = '', 
  children,
  spacing = 'default'
}: PageHeaderProps) {
  const paddingClass = spacing === 'large' ? 'py-20 md:py-32' : 'py-16 md:py-24';

  return (
    <section 
      className={`relative ${paddingClass} ${className}`}
      style={{
        background: 'linear-gradient(to bottom, var(--gradient-hero-from), var(--gradient-hero-to))',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-dark/20 text-primary dark:text-primary-light text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {badgeText}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary dark:text-foreground mb-6 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-text-secondary dark:text-text-muted max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
}
