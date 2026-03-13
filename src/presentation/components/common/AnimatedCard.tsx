'use client';

import { useSpring, animated, config } from '@react-spring/web';
import { useState, ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  hoverRotate?: number;
}

/**
 * AnimatedCard
 * A card component with hover scale + shadow and click spring effects
 * Uses useSpring from react-spring (NOT useTrail)
 */
export function AnimatedCard({
  children,
  className = '',
  onClick,
  hoverScale = 1.03,
  hoverRotate = 0,
}: AnimatedCardProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const spring = useSpring({
    scale: clicked ? 0.97 : hovered ? hoverScale : 1,
    rotateZ: hovered ? hoverRotate : 0,
    y: hovered ? -6 : 0,
    shadow: hovered ? 20 : 5,
    config: config.gentle,
  });

  return (
    <animated.div
      className={`card-surface cursor-pointer ${className}`}
      style={{
        transform: spring.scale
          .to((s) => spring.y.get())
          .to((_, i) =>
            `scale(${spring.scale.get()}) translateY(${spring.y.get()}px) rotateZ(${spring.rotateZ.get()}deg)`
          ),
        boxShadow: spring.shadow.to(
          (s) => `0 ${s}px ${s * 2}px rgba(33, 150, 243, ${s * 0.005})`
        ),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setClicked(false);
      }}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onClick={onClick}
    >
      {children}
    </animated.div>
  );
}
