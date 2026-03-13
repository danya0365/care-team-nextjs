'use client';

import { useSpring, animated, config } from '@react-spring/web';
import { useState, ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  id?: string;
}

const variantClasses = {
  primary:
    'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg',
  secondary:
    'bg-accent text-white shadow-md hover:shadow-lg',
  outline:
    'border-2 border-primary text-primary dark:text-primary-light hover:bg-primary-50 dark:hover:bg-primary-dark/20',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

/**
 * AnimatedButton
 * Button with hover/click spring animation
 * Uses useSpring from react-spring (NOT useTrail)
 */
export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  id,
}: AnimatedButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const spring = useSpring({
    scale: pressed ? 0.92 : hovered ? 1.06 : 1,
    y: hovered ? -2 : 0,
    config: config.wobbly,
  });

  const combinedClassName = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-colors focus-ring cursor-pointer
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const animatedStyle = {
    transform: spring.scale.to(
      (s) => `scale(${s}) translateY(${spring.y.get()}px)`
    ),
  };

  if (href) {
    return (
      <animated.a
        href={href}
        style={animatedStyle}
        className={combinedClassName}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        id={id}
      >
        {children}
      </animated.a>
    );
  }

  return (
    <animated.button
      onClick={onClick}
      style={animatedStyle}
      className={combinedClassName}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      id={id}
    >
      {children}
    </animated.button>
  );
}
