'use client';

import { useSpring, animated, config } from '@react-spring/web';
import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

/**
 * AnimatedSection
 * Section wrapper that fades + slides in when scrolled into viewport
 * Uses useSpring + IntersectionObserver (NOT useTrail)
 */
export function AnimatedSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return { x: -40, y: 0 };
      case 'right':
        return { x: 40, y: 0 };
      case 'up':
      default:
        return { x: 0, y: 40 };
    }
  };

  const initial = getInitialTransform();

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    x: inView ? 0 : initial.x,
    y: inView ? 0 : initial.y,
    delay,
    config: { ...config.gentle, duration: 600 },
  });

  return (
    <animated.div
      ref={ref}
      className={className}
      style={{
        opacity: spring.opacity,
        transform: spring.x.to(
          (x) => `translate3d(${x}px, ${spring.y.get()}px, 0)`
        ),
      }}
    >
      {children}
    </animated.div>
  );
}
