'use client';

import { useSpring, animated, config } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

interface StatsCounterProps {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: string;
  duration?: number;
  className?: string;
}

/**
 * StatsCounter
 * Animated number counter that animates when scrolled into view
 * Uses useSpring from react-spring (NOT useTrail)
 */
export function StatsCounter({
  end,
  label,
  suffix = '',
  prefix = '',
  icon,
  duration = 1500,
  className = '',
}: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

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
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Count animation
  const countSpring = useSpring({
    from: { val: 0 },
    val: inView ? end : 0,
    config: { duration },
  });

  // Hover animation
  const hoverSpring = useSpring({
    scale: hovered ? 1.08 : 1,
    y: hovered ? -4 : 0,
    config: config.gentle,
  });

  return (
    <animated.div
      ref={ref}
      className={`text-center ${className}`}
      style={{
        transform: hoverSpring.scale.to(
          (s) => `scale(${s}) translateY(${hoverSpring.y.get()}px)`
        ),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && (
        <div className="text-4xl mb-3">{icon}</div>
      )}
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
        <span>{prefix}</span>
        <animated.span>
          {countSpring.val.to((v) => Math.floor(v).toLocaleString())}
        </animated.span>
        <span>{suffix}</span>
      </div>
      <p className="text-sm font-medium text-text-secondary dark:text-text-muted">
        {label}
      </p>
    </animated.div>
  );
}
