'use client';

import { useSpring, animated, config } from '@react-spring/web';
import { ReactNode, useEffect } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  type = 'info',
  isLoading = false,
}: ConfirmModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : ('none' as any),
    config: config.gentle,
  });

  const contentSpring = useSpring({
    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
    opacity: isOpen ? 1 : 0,
    config: config.wobbly,
  });

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-error/10',
          text: 'text-error',
          icon: <AlertTriangle className="w-8 h-8" />,
          buttonVariant: 'primary' as const,
          buttonClass: 'bg-error hover:bg-error-dark shadow-error/20',
        };
      case 'success':
        return {
          bg: 'bg-success/10',
          text: 'text-success',
          icon: <CheckCircle2 className="w-8 h-8" />,
          buttonVariant: 'primary' as const,
          buttonClass: 'bg-success hover:bg-success-dark shadow-success/20',
        };
      default:
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          icon: <InfoIcon className="w-8 h-8" />, // InfoIcon isn't standard in lucide-react if named differently, but lucide has Info
          buttonVariant: 'primary' as const,
          buttonClass: '',
        };
    }
  };

  const InfoIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const styles = getTypeStyles();

  if (!isOpen && backdropSpring.opacity.get() === 0) return null;

  return (
    <animated.div
      style={backdropSpring}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <animated.div
        style={contentSpring}
        className="w-full max-w-md bg-white dark:bg-card-bg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 md:p-10 flex flex-col items-center text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-text-muted hover:bg-surface-elevated dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-6 ${styles.bg} ${styles.text}`}>
            {styles.icon}
          </div>

          <h3 className="text-2xl font-black text-text-primary dark:text-foreground mb-3">
            {title}
          </h3>
          <p className="text-text-secondary dark:text-text-muted font-medium mb-10 leading-relaxed">
            {message}
          </p>

          <div className="flex w-full gap-4">
            <AnimatedButton
              onClick={onClose}
              variant="outline"
              className="flex-1 py-4 dark:border-white/10"
              disabled={isLoading}
            >
              {cancelText}
            </AnimatedButton>
            <AnimatedButton
              onClick={onConfirm}
              variant={styles.buttonVariant}
              className={`flex-1 py-4 font-bold ${styles.buttonClass}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                confirmText
              )}
            </AnimatedButton>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}
