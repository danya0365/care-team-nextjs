'use client';

import { useTheme } from 'next-themes';
import { useSpring, animated, config } from '@react-spring/web';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  // Spring animation for the toggle button
  const [springProps, api] = useSpring(() => ({
    rotate: 0,
    scale: 1,
    config: config.wobbly,
  }));

  const handleToggle = () => {
    api.start({
      from: { rotate: 0, scale: 0.6 },
      to: { rotate: 360, scale: 1 },
    });
    setTheme(isDark ? 'light' : 'dark');
  };

  // Hover animation
  const handleMouseEnter = () => {
    api.start({ scale: 1.15 });
  };

  const handleMouseLeave = () => {
    api.start({ scale: 1 });
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-dark/20" />
    );
  }

  return (
    <animated.button
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: springProps.rotate.to(
          (r) => `rotate(${r}deg) scale(${springProps.scale.get()})`
        ),
      }}
      className="relative w-10 h-10 rounded-full flex items-center justify-center focus-ring
        bg-primary-50 hover:bg-primary-100 dark:bg-primary-dark/20 dark:hover:bg-primary-dark/30
        transition-colors cursor-pointer"
      aria-label={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      id="theme-toggle"
    >
      {isDark ? (
        /* Sun icon */
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Moon icon */
        <svg
          className="w-5 h-5 text-primary-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </animated.button>
  );
}
